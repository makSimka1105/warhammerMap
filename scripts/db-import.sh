#!/usr/bin/env bash
# Restore an archive made by db-export.sh. Existing collections with the same
# names are dropped first. --compose restores into the mongo service of
# docker-compose.prod.yml without exposing its port.
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 <mongo-uri | --compose> <archive> [source-db] [target-db]" >&2
  echo "  $0 --compose backups/test.archive.gz" >&2
  echo "  $0 'mongodb://localhost:27017' backups/test.archive.gz warhammer warhammer_copy" >&2
  exit 1
fi

target=$1
archive=$2
rename=()
if [[ $# -ge 4 ]]; then
  rename=(--nsFrom="$3.*" --nsTo="$4.*")
fi

if [[ $target == --compose ]]; then
  docker compose -f "$(dirname "$0")/../docker-compose.prod.yml" exec -T mongo \
    mongorestore --gzip --archive --drop "${rename[@]}" < "$archive"
else
  docker run --rm -i --network host mongo:7 \
    mongorestore --uri="$target" --gzip --archive --drop "${rename[@]}" < "$archive"
fi
