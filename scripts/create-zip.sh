#!/bin/bash
# Create the final Launchpad source ZIP — full source code with versioned name
# matching the upstream release naming convention (launchpad-sourcecode-vX.XXX.zip).
# Excludes node_modules, .next, .git, build artifacts, and dev-only files.
set -e

cd /home/z/my-project

# Read the version from package.json so the zip name always matches the shipped version.
# Strip the trailing ".0" patch component to match the upstream naming convention
# (e.g. "5.931.0" -> "v5.931", producing "launchpad-sourcecode-v5.931.zip").
RAW_VERSION=$(grep -o '"version": *"[0-9.]*"' package.json | head -1 | grep -o '[0-9.]*')
VERSION=$(echo "$RAW_VERSION" | sed 's/\.0$//')
OUT="/home/z/my-project/download/launchpad-sourcecode-v${VERSION}.zip"

# Remove any previous ZIP (both the versioned name and the old generic name)
rm -f "$OUT" /home/z/my-project/download/launchpad-source.zip

# Create the ZIP. The exclude list matches the original upstream release zip —
# only build artifacts, dev-only scratch folders, and auto-generated files are
# excluded. ALL website source files (including public/icons/*.png, bun.lock,
# README.md, CHANGELOG.md) are included so the zip is a complete, runnable
# source tree.
zip -r "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".zscripts/*" \
  -x "upload/*" \
  -x "launchpad-src/*" \
  -x "analysis/*" \
  -x "tool-results/*" \
  -x "skills/*" \
  -x "examples/*" \
  -x "dev.log" \
  -x "download/*" \
  -x "db/*" \
  -x "worklog.md" \
  -x "*.log" \
  -x ".env" \
  -x "next-env.d.ts" \
  -x "mini-services/*" \
  -x "prisma/*" \
  -x "tailwind.config.ts" \
  > /dev/null

echo "Created: $OUT"
echo "Size: $(du -h "$OUT" | cut -f1)"
echo "File count: $(unzip -l "$OUT" | tail -1 | awk '{print $2}')"
