#!/usr/bin/env node
import { access, constants, readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import process from 'process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

const MIN_FONT_BYTES = Number(process.env.MIN_WOFF2_BYTES ?? 1024);
const roots = process.argv.slice(2);
const searchRoots = roots.length > 0 ? roots : ['apps/web/.next/static/media'];

async function pathExists(targetPath) {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function collectWoff2Files(directory) {
  const files = [];
  const stack = [directory];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!(await pathExists(current))) {
      continue;
    }

    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.woff2')) {
        files.push(entryPath);
      }
    }
  }

  return files;
}

async function validateFont(filePath) {
  const fileInfo = await stat(filePath);
  if (fileInfo.size < MIN_FONT_BYTES) {
    throw new Error(
      `Font at ${filePath} is smaller than the minimum ${MIN_FONT_BYTES} bytes (actual: ${fileInfo.size} bytes).`
    );
  }

  const fontBuffer = await readFile(filePath);
  const font = fontkit.create(fontBuffer);
  if (!font.familyName) {
    throw new Error(`Font metadata missing for ${filePath}.`);
  }
}

async function main() {
  const report = [];
  let inspectedFonts = 0;

  for (const root of searchRoots) {
    if (!(await pathExists(root))) {
      report.push(`Skipping ${root} (not found).`);
      continue;
    }

    const fonts = await collectWoff2Files(root);
    if (fonts.length === 0) {
      report.push(`No .woff2 files found under ${root}.`);
      continue;
    }

    for (const fontPath of fonts) {
      await validateFont(fontPath);
      inspectedFonts += 1;
    }
  }

  for (const line of report) {
    console.log(line);
  }

  console.log(`Verified ${inspectedFonts} font file(s) with minimum size ${MIN_FONT_BYTES} bytes.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
