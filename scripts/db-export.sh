#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <mongo-uri | --compose> [out-file]" >&2
  echo "  $0 'mongodb+srv://user:pass@cluster.mongodb.net/warhammer' backups/test.archive.gz" >&2
  echo "  $0 --compose" >&2
  exit 1
fi

source=$1
out=${2:-backups/warhammer-$(date +%Y%m%d-%H%M%S).archive.gz}
mkdir -p "$(dirname "$out")"

if [[ $source == --compose ]]; then
  docker compose -f "$(dirname "$0")/../docker-compose.yml" exec -T mongo \
    mongodump --db=warhammer --gzip --archive > "$out"
else
  docker run --rm --network host mongo:7 \
    mongodump --uri="$source" --gzip --archive > "$out"
fi

echo "saved $out ($(du -h "$out" | cut -f1))"
