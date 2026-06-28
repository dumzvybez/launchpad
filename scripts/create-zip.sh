#!/bin/bash
# Create the final Launchpad source ZIP — excludes node_modules, .next, .git, etc.
set -e

cd /home/z/my-project
OUT=/home/z/my-project/download/launchpad-source.zip

# Remove any previous ZIP
rm -f "$OUT"

# Create the ZIP, excluding build artifacts and dev files
zip -r "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".zscripts/*" \
  -x "upload/*" \
  -x "launchpad-src/*" \
  -x "skills/*" \
  -x "examples/*" \
  -x "dev.log" \
  -x "bun.lock" \
  -x "download/SETUP-GUIDE.md" \
  -x "db/*" \
  -x "*.log" \
  > /dev/null

echo "Created: $OUT"
echo "Size: $(du -h "$OUT" | cut -f1)"
echo "File count: $(unzip -l "$OUT" | tail -1 | awk '{print $2}')"
