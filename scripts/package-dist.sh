#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE_PATH="${1:-/tmp/expoin-dist.tgz}"

cd "$ROOT_DIR"

npm run build

rm -f "$ARCHIVE_PATH"

# Disable macOS metadata so Linux tar on the server does not emit xattr warnings.
COPYFILE_DISABLE=1 tar --no-xattrs -czf "$ARCHIVE_PATH" -C dist .

echo "Archive created: $ARCHIVE_PATH"
