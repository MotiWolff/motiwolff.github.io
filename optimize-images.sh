#!/bin/bash

# Create optimized versions of images
for img in assets/images/*.{jpg,jpeg,JPG,JPEG}; do
    if [ -f "$img" ]; then
        # Create WebP versions
        cwebp -q 80 "$img" -o "${img%.*}.webp"
        
        # Create responsive sizes
        convert "$img" -resize 400x400 "${img%.*}-400w.${img##*.}"
        convert "$img" -resize 800x800 "${img%.*}-800w.${img##*.}"
        
        # Create WebP versions of responsive sizes
        cwebp -q 80 "${img%.*}-400w.${img##*.}" -o "${img%.*}-400w.webp"
        cwebp -q 80 "${img%.*}-800w.${img##*.}" -o "${img%.*}-800w.webp"
        
        # Optimize original
        jpegoptim --max=80 "$img"
    fi
done