#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Usage: $0 [-f <from_ref>] [-t <to_ref>] [-o <output_file>]

Generates a changelog section agrupando commits por tipo com base em Conventional Commits.
Por padrão, usa a tag mais recente como origem e HEAD como destino, escrevendo em CHANGELOG.md (append).
USAGE
}

FROM_REF=""
TO_REF="HEAD"
OUTPUT_FILE="CHANGELOG.md"

while getopts ":f:t:o:h" opt; do
  case "$opt" in
    f) FROM_REF="$OPTARG" ;;
    t) TO_REF="$OPTARG" ;;
    o) OUTPUT_FILE="$OPTARG" ;;
    h) usage; exit 0 ;;
    :) echo "Erro: opção -$OPTARG requer um valor." >&2; usage; exit 1 ;;
    \?) echo "Erro: opção inválida -$OPTARG" >&2; usage; exit 1 ;;
  esac
done

if ! git rev-parse --verify "$TO_REF" >/dev/null 2>&1; then
  echo "Destino $TO_REF inválido" >&2
  exit 1
fi

if [[ -z "$FROM_REF" ]]; then
  if LAST_TAG=$(git describe --tags --abbrev=0 "$TO_REF"^ 2>/dev/null); then
    FROM_REF="$LAST_TAG"
  else
    FROM_REF=$(git rev-list --max-parents=0 "$TO_REF" | tail -n1)
  fi
fi

if ! git rev-parse --verify "$FROM_REF" >/dev/null 2>&1; then
  echo "Origem $FROM_REF inválida" >&2
  exit 1
fi

mapfile -t COMMITS < <(git log --pretty=format:'%s::%h' "$FROM_REF".."$TO_REF")

if [[ ${#COMMITS[@]} -eq 0 ]]; then
  echo "Nenhum commit entre $FROM_REF e $TO_REF" >&2
  exit 0
fi

TODAY=$(date -u +%Y-%m-%d)
HEADER="## $(git rev-parse --short "$TO_REF") - $TODAY"

{
  printf '%s\n' "$HEADER"
  declare -a FEATURES FIXES DOCS CHORES OTHERS
  for entry in "${COMMITS[@]}"; do
    subject=${entry%%::*}
    hash=${entry##*::}
    clean=$subject
    if [[ $subject =~ ^[a-zA-Z]+(\([^)]+\))?: ]]; then
      clean=${subject#*: }
    fi
    case $subject in
      feat*) FEATURES+=("$clean::$hash") ;;
      fix*) FIXES+=("$clean::$hash") ;;
      docs*) DOCS+=("$clean::$hash") ;;
      chore*) CHORES+=("$clean::$hash") ;;
      *) OTHERS+=("$clean::$hash") ;;
    esac
  done

  emit_section() {
    local title=$1
    shift
    local -n ref=$1
    printf '\n### %s\n' "$title"
    if [[ ${#ref[@]} -eq 0 ]]; then
      printf ' - _Sem entradas_\n'
    else
      for item in "${ref[@]}"; do
        printf ' - %s (%s)\n' "${item%%::*}" "${item##*::}"
      done
    fi
  }

  emit_section "Features" FEATURES
  emit_section "Correções" FIXES
  emit_section "Documentação" DOCS
  emit_section "Chores" CHORES
  emit_section "Outros" OTHERS
} >> "$OUTPUT_FILE"

echo "Changelog atualizado em $OUTPUT_FILE com commits de $FROM_REF..$TO_REF"
