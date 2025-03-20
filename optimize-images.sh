#!/bin/bash

# Create WebP versions of all images
for img in public/images/*; do
  if [[ $img =~ .*\.(jpg|jpeg|png)$ ]]; then
    cwebp -q 80 "$img" -o "${img%.*}.webp"
  fi
done

# Optimize existing images
for img in public/images/*.{jpg,jpeg,png}; do
  if [ -f "$img" ]; then
    imagemin "$img" --out-dir=public/images/optimized/
  fi
done