#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'node:path';
import Ajv, { type ErrorObject } from 'ajv';
import Archiver from 'archiver';
import axios from 'axios';
import chalk from 'chalk';

const program = new Command();
const DEFAULT_MANIFEST_VERSION = '1.1';
const MANIFEST_FILENAME = 'extension.manifest.json';

const manifestSchema = {
  type: 'object',
  required: ['manifest_version', 'identifier', 'version', 'entrypoint'],
  properties: {
    manifest_version: { type: 'string', enum: ['1.0', '1.1'] },
    identifier: { type: 'string', pattern: '^[a-z0-9\\-]+(\\.[a-z0-9\\-]+)*$' },
    version: { type: 'string' },
    description: { type: 'string' },
    entrypoint: { type: 'string', pattern: '^[^:]+:[^:]+$' },
    permissions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          scopes: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    metadata: { type: 'object' }
  }
} as const;

const ajv = new Ajv({ allErrors: true });
const validateManifest = ajv.compile(manifestSchema);

async function loadManifest(manifestPath: string) {
  const resolvedPath = path.resolve(manifestPath);
  let stats: fs.Stats | undefined;
  try {
    stats = await fs.stat(resolvedPath);
  } catch {
    stats = undefined;
  }

  const absolutePath = stats?.isDirectory()
    ? path.join(resolvedPath, MANIFEST_FILENAME)
    : stats
      ? resolvedPath
      : path.join(resolvedPath, MANIFEST_FILENAME);

  if (!(await fs.pathExists(absolutePath))) {
    throw new Error(`Manifest not found at ${absolutePath}`);
  }

  const payload = await fs.readJSON(absolutePath);
  const valid = validateManifest(payload);
  if (!valid) {
    const messages = (validateManifest.errors || [])
      .map(err => {
        const typedError = err as ErrorObject;
        const location = (typedError.instancePath as string | undefined) || '/';
        return `${location} ${typedError.message}`;
      })
      .join('\n');
    throw new Error(`Manifest validation failed:\n${messages}`);
  }

  return { manifest: payload, path: absolutePath };
}

async function ensureDirectory(targetPath: string) {
  await fs.ensureDir(targetPath);
}

async function packageExtension(rootDir: string, output: string) {
  await new Promise<void>((resolve, reject) => {
    const archive = Archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(output);

    stream.on('close', () => resolve());
    stream.on('error', reject);
    archive.on('error', reject);

    archive.pipe(stream);
    archive.directory(rootDir, false);
    archive.finalize();
  });
}

async function validateExtension(targetPath: string) {
  const { manifest, path: manifestPath } = await loadManifest(targetPath);
  const entryModule = manifest.entrypoint.split(':')[0];
  const entryFile = path.join(path.dirname(manifestPath), `${entryModule.split('.').join(path.sep)}.py`);

  if (!(await fs.pathExists(entryFile))) {
    throw new Error(`Arquivo de entrada esperado não encontrado: ${entryFile}`);
  }

  return { manifest, manifestPath, entryFile };
}

program
  .name('bmad-ext')
  .description('Ferramentas oficiais para desenvolvimento de extensões BMAD.')
  .version('0.1.0');

program
  .command('init')
  .description('Gera um esqueleto de extensão com manifesto e ponto de entrada sandboxed.')
  .option('-d, --directory <path>', 'Diretório de destino', '.')
  .action(async options => {
    const baseDir = path.resolve(options.directory ?? '.');
    await ensureDirectory(baseDir);
    const answers = await inquirer.prompt([
      { name: 'identifier', message: 'Identificador da extensão (ex: parceiros.analytics)', validate: Boolean },
      { name: 'description', message: 'Descrição curta', default: 'Extensão BMAD personalizada' }
    ]);

    const manifestPath = path.join(baseDir, MANIFEST_FILENAME);
    if (await fs.pathExists(manifestPath)) {
      throw new Error(`Já existe um manifesto em ${manifestPath}`);
    }

    const manifest = {
      manifest_version: DEFAULT_MANIFEST_VERSION,
      identifier: answers.identifier,
      version: '0.1.0',
      description: answers.description,
      entrypoint: 'src.index:handler',
      permissions: [],
      metadata: {
        created_at: new Date().toISOString()
      }
    };

    const srcDir = path.join(baseDir, 'src');
    await ensureDirectory(srcDir);
    const entrypointPath = path.join(srcDir, 'index.py');
    await fs.writeFile(
      entrypointPath,
      `def handler(event, context):\n    \\\"Entrypoint padrão de uma extensão BMAD.\\\"\n    return {"status": "ok", "event": event}\n`
    );

    await fs.writeJSON(manifestPath, manifest, { spaces: 2 });
    console.log(chalk.green(`Extensão criada em ${baseDir}`));
  });

program
  .command('validate [path]')
  .description('Valida manifesto e estrutura mínima da extensão.')
  .action(async (targetPath = '.') => {
    await validateExtension(targetPath);
    console.log(chalk.green('Manifesto válido.'));
  });

program
  .command('package [path]')
  .description('Empacota a extensão em um arquivo .zip pronto para publicação.')
  .option('-o, --output <file>', 'Arquivo de saída', 'extension-package.zip')
  .action(async (targetPath = '.', options) => {
    const { manifest, manifestPath } = await validateExtension(targetPath);
    const rootDir = path.dirname(manifestPath);
    const output = path.resolve(options.output ?? 'extension-package.zip');

    await packageExtension(rootDir, output);

    console.log(chalk.green(`Pacote gerado: ${output}`));
    console.log(`Identificador: ${manifest.identifier}`);
  });

program
  .command('publish [path]')
  .description('Publica a extensão em um registro remoto com validações adicionais.')
  .option('-r, --registry <url>', 'URL da API de registro', 'https://extensions.bmad.io/api/v1/extensions')
  .option('-t, --token <token>', 'Token de autenticação')
  .option('-o, --output <file>', 'Arquivo de pacote reutilizado', 'extension-package.zip')
  .action(async (targetPath = '.', options) => {
    const { manifest, manifestPath } = await validateExtension(targetPath);
    const packagePath = path.resolve(options.output ?? 'extension-package.zip');
    const rootDir = path.dirname(manifestPath);

    if (!(await fs.pathExists(packagePath))) {
      console.log(chalk.yellow('Pacote não encontrado, gerando automaticamente...'));
      await packageExtension(rootDir, packagePath);
    }

    const fileData = await fs.readFile(packagePath);
    const response = await axios.post(options.registry, fileData, {
      headers: {
        'Content-Type': 'application/zip',
        Authorization: options.token ? `Bearer ${options.token}` : undefined,
        'X-BMAD-Extension-Identifier': manifest.identifier,
        'X-BMAD-Extension-Version': manifest.version
      },
      maxBodyLength: Infinity
    });

    console.log(chalk.green('Extensão publicada com sucesso.'));
    console.log(`Status da API: ${response.status}`);
  });

program
  .command('lint')
  .description('Executa validações locais (manifesto + estrutura).')
  .action(async () => {
    await validateExtension('.');
    console.log(chalk.green('Validações concluídas.'));
  });

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(message));
    process.exitCode = 1;
  }
}

main();
