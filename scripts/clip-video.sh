#!/usr/bin/env bash
# Builds the web versions of a clip for src/components/ClipVideo.vue.
#
# For the original <name>.mp4 (or .mov) two silent files per width are written
# under public/video/<folder>: <name>-<width>.av1.mp4 (SVT-AV1, 10 bit) and
# <name>-<width>.h264.mp4 (x264, the fallback for browsers without AV1). The
# poster frame <name>-video.jpg lands next to the original; run
# scripts/zeitreise-images.py on it into public/img/<folder> for the web sizes.
#
# AV1 lands at roughly a third of the H.264 size at the same quality (measured
# on the start page clips, October 2026), so ClipVideo offers it first.
#
# Usage: scripts/clip-video.sh <folder with originals> <folder> <name> <width> [width ...]
#   scripts/clip-video.sh ~/Downloads start mahlzeit 1168 720
# Set NOTE to a sentence that goes into the file's metadata, e.g. for an
# AI-generated clip: NOTE="KI-generiert (Grok), kein reales Tier. vegan.to"
set -euo pipefail

source_dir="$1"
folder="$2"
name="$3"
shift 3
target_dir="public/video/$folder"
mkdir -p "$target_dir"

original="$source_dir/$name.mp4"
[ -f "$original" ] || original="$source_dir/$name.mov"
[ -f "$original" ] || { echo "no original for $name" >&2; exit 1; }
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$original")
meta=()
[ -n "${NOTE:-}" ] && meta=(-metadata "comment=$NOTE")

for width in "$@"; do
  ffmpeg -y -v error -i "$original" -an -r "$fps" -vf "scale=$width:-2" \
    -c:v libsvtav1 -preset 4 -crf 34 -g 120 -pix_fmt yuv420p10le -svtav1-params tune=0 \
    -movflags +faststart "${meta[@]}" "$target_dir/$name-$width.av1.mp4"
  ffmpeg -y -v error -i "$original" -an -r "$fps" -vf "scale=$width:-2" \
    -c:v libx264 -preset slow -crf 23 -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "${meta[@]}" "$target_dir/$name-$width.h264.mp4"
done
ffmpeg -y -v error -ss 1 -i "$original" -frames:v 1 -q:v 2 "$source_dir/$name-video.jpg"
echo "$name done"
