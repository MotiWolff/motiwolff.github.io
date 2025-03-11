#!/bin/bash

# Convert images to WebP
for img in *.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        cwebp -q 80 "$img" -o "${img%.*}.webp"
        
        # Create responsive versions
        convert "$img" -resize 400x me-400w.${img##*.}
        convert "$img" -resize 800x me-800w.${img##*.}
        
        cwebp -q 80 "me-400w.${img##*.}" -o "me-400w.webp"
        cwebp -q 80 "me-800w.${img##*.}" -o "me-800w.webp"
    fi
done 