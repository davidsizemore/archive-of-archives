#!/usr/bin/env bash
set -euo pipefail

THUMBNAIL_DIR="${1:-images/thumbnails}"
MAX_BYTES=153600
QUALITY_START=80
QUALITY_MIN=40
SKIP_FILES=("og-aoa.jpg")

require_cwebp() {
  if ! command -v cwebp >/dev/null 2>&1; then
    echo "Error: cwebp is required. Install with: brew install webp" >&2
    exit 1
  fi
}

format_bytes() {
  local bytes="$1"
  if [ "$bytes" -ge 1024 ]; then
    printf "%d KB" $((bytes / 1024))
  else
    printf "%d B" "$bytes"
  fi
}

convert_jpg_to_webp() {
  local src="$1"
  local dest="${src%.*}.webp"
  local quality="$QUALITY_START"
  local size_bytes=0

  echo "Converting $(basename "$src") -> $(basename "$dest")"

  while [ "$quality" -ge "$QUALITY_MIN" ]; do
    cwebp -quiet -q "$quality" -m 6 "$src" -o "$dest"
    size_bytes=$(wc -c < "$dest" | tr -d ' ')

    if [ "$size_bytes" -le "$MAX_BYTES" ]; then
      echo "  quality=${quality}, size=$(format_bytes "$size_bytes")"
      rm "$src"
      echo "  removed $(basename "$src")"
      return 0
    fi

    quality=$((quality - 5))
  done

  rm -f "$dest"
  echo "Error: could not compress $(basename "$src") below 150 KB" >&2
  return 1
}

main() {
  require_cwebp

  if [ ! -d "$THUMBNAIL_DIR" ]; then
    echo "Error: directory not found: $THUMBNAIL_DIR" >&2
    exit 1
  fi

  shopt -s nullglob
  local sources=("$THUMBNAIL_DIR"/*.jpg "$THUMBNAIL_DIR"/*.jpeg "$THUMBNAIL_DIR"/*.JPG "$THUMBNAIL_DIR"/*.JPEG)
  shopt -u nullglob

  if [ "${#sources[@]}" -eq 0 ]; then
    echo "No JPG files found in $THUMBNAIL_DIR"
    exit 0
  fi

  local failed=0
  for src in "${sources[@]}"; do
    local basename
    basename="$(basename "$src")"
    local skip=0
    for excluded in "${SKIP_FILES[@]}"; do
      if [ "$basename" = "$excluded" ]; then
        skip=1
        break
      fi
    done
    if [ "$skip" -eq 1 ]; then
      echo "Skipping $basename"
      continue
    fi

    if ! convert_jpg_to_webp "$src"; then
      failed=1
    fi
  done

  if [ "$failed" -ne 0 ]; then
    exit 1
  fi

  echo "Done. Converted ${#sources[@]} file(s) to WebP."
}

main "$@"
