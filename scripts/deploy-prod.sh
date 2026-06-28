#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${HOST:-203.161.47.46}"
PORT="${PORT:-22022}"
USER_NAME="${USER_NAME:-deployer}"
TARGET_DIR="${TARGET_DIR:-/usr/local/lsws/Example/html}"
ARCHIVE_PATH="${ARCHIVE_PATH:-/tmp/expoin-dist.tgz}"
IDENTITY_FILE="${IDENTITY_FILE:-$HOME/.ssh/expoin_deploy_ed25519}"

bash "$ROOT_DIR/scripts/package-dist.sh" "$ARCHIVE_PATH"

ssh -p "$PORT" -i "$IDENTITY_FILE" -o IdentitiesOnly=yes -o BatchMode=yes \
  -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=2 \
  "$USER_NAME@$HOST" "mkdir -p '$TARGET_DIR' && tar -xzf - -C '$TARGET_DIR'" < "$ARCHIVE_PATH"

echo "Deployed to $USER_NAME@$HOST:$TARGET_DIR"
