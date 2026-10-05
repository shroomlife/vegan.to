#!/usr/bin/env bash
# Builds the web versions of a licensed Envato clip for /video/zeitreise.
#
# For every original <name>.mov (or .mp4) three silent H.264 files are written,
# <name>-1440.mp4, <name>-1080.mp4 and <name>-720.mp4 at 25 fps, plus the poster frame
# <name>-video.jpg next to the originals; scripts/zeitreise-images.py then
# turns the poster into the three web sizes under public/img/zeitreise.
#
# Usage: scripts/zeitreise-video.sh <folder with originals> <name> [name ...]
# The licensed originals are not part of the repository.
set -euo pipefail

source_dir="$1"
shift
target_dir="public/video/zeitreise"
mkdir -p "$target_dir"

for name in "$@"; do
  original="$source_dir/$name.mov"
  [ -f "$original" ] || original="$source_dir/$name.mp4"
  [ -f "$original" ] || { echo "no original for $name" >&2; exit 1; }
  for size in 1440 1080 720; do
    width=$(( size == 1440 ? 2560 : size == 1080 ? 1920 : 1280 ))
    crf=$(( size == 720 ? 24 : 23 ))
    ffmpeg -y -v error -i "$original" -an -r 25 -vf "scale=$width:-2" \
      -c:v libx264 -preset slow -crf "$crf" -profile:v high -pix_fmt yuv420p \
      -movflags +faststart "$target_dir/$name-$size.mp4"
  done
  ffmpeg -y -v error -ss 1 -i "$original" -frames:v 1 -vf "scale=1920:-2" -q:v 2 "$source_dir/$name-video.jpg"
  echo "$name done"
done
