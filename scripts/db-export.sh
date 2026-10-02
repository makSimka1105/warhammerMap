#!/usr/bin/env bash
# Dump the whole app state (planets, legions, events, GridFS images, users)
# into one gzipped archive. Works for Atlas and local URIs; needs only docker.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <mongo-uri> [out-file]" >&2
  echo "  $0 'mongodb+srv://user:pass@cluster.mongodb.net/warhammer' backups/test.archive.gz" >&2
  exit 1
fi

uri=$1
out=${2:-backups/warhammer-$(date +%Y%m%d-%H%M%S).archive.gz}
mkdir -p "$(dirname "$out")"

docker run --rm --network host mongo:7 \
  mongodump --uri="$uri" --gzip --archive > "$out"

echo "saved $out ($(du -h "$out" | cut -f1))"
