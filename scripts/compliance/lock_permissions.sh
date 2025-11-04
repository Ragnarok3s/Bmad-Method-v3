#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/compliance/lock_permissions.sh <command> [options]

Commands:
  check   Validate that release artifacts match the expected permission mode
  fix     Update release artifacts to match the expected permission mode

Options:
  --release <id>     Release identifier (required)
  --base-path <dir>  Base directory containing release folders (default: docs/compliance/releases)
  --mode <octal>     Expected permission mode for files (default: 0644)
  -h, --help         Show this help message
USAGE
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 1
fi

command="$1"
shift

release=""
base_path="docs/compliance/releases"
expected_mode="0644"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --release)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --release" >&2
        exit 1
      fi
      release="$2"
      shift 2
      ;;
    --base-path)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --base-path" >&2
        exit 1
      fi
      base_path="$2"
      shift 2
      ;;
    --mode)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --mode" >&2
        exit 1
      fi
      expected_mode="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$release" ]]; then
  echo "--release is required" >&2
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ "$base_path" != /* ]]; then
  base_path="$repo_root/$base_path"
fi

release_dir="$base_path/$release"

if [[ ! -d "$release_dir" ]]; then
  echo "Release directory not found: $release_dir" >&2
  exit 1
fi

if [[ ! "$expected_mode" =~ ^0?[0-7]{3,4}$ ]]; then
  echo "Invalid mode: $expected_mode" >&2
  exit 1
fi

python3 - "$command" "$release_dir" "$expected_mode" <<'PY'
import stat
import sys
from pathlib import Path

command, release_dir, expected_mode_str = sys.argv[1:4]
expected_mode = int(expected_mode_str, 8)
release_path = Path(release_dir)

files = [path for path in release_path.rglob("*") if path.is_file()]

mismatched: list[tuple[Path, int]] = []
for file_path in files:
    current_mode = stat.S_IMODE(file_path.stat().st_mode)
    if current_mode != expected_mode:
        mismatched.append((file_path, current_mode))

if command == "check":
    if mismatched:
        print("Found files with unexpected permissions:")
        for path, mode in mismatched:
            print(f"  {path.relative_to(release_path)} -> {mode:04o}")
        sys.exit(1)
    print(f"All files under {release_path} have mode {expected_mode:04o}")
elif command == "fix":
    if not mismatched:
        print("No files required updates.")
    for path, mode in mismatched:
        path.chmod(expected_mode)
        print(f"Updated {path.relative_to(release_path)} from {mode:04o} to {expected_mode:04o}")
else:
    print(f"Unsupported command: {command}", file=sys.stderr)
    sys.exit(2)
PY

PY_EXIT=$?
if [[ $PY_EXIT -ne 0 ]]; then
  exit $PY_EXIT
fi

if [[ "$command" == "fix" ]]; then
  echo "Permissions updated for release '$release'."
fi
