#!/usr/bin/env bash
# install.sh — install MemoryAI Coding-Guard via npx (no global install)
# Usage: curl -fsSL https://coding-guard.memoryai.dev/install.sh | bash

set -euo pipefail

PKG="@memoryai.dev/coding-guard"

echo
echo "  MemoryAI Coding-Guard installer"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "  ERROR: Node.js >= 18 required."
  echo "  Install from https://nodejs.org/"
  exit 1
fi

NODE_MAJOR=$(node -p "parseInt(process.versions.node.split('.')[0], 10)")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "  ERROR: Node.js 18+ required (found $(node -v))."
  exit 1
fi

echo "  Detected Node $(node -v)"
echo "  Running: npx -y $PKG install \"$@\""
echo
exec npx -y "$PKG" install "$@"
