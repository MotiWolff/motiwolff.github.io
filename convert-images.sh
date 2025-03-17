#!/bin/bash

# Install cwebp if not already installed
# sudo apt-get install webp

# Create directories if they don't exist
mkdir -p assets/images

# Convert main image to WebP versions
for size in 400 800; do
    convert me.jpg -resize ${size}x me-${size}w.jpg
    cwebp -q 80 me-${size}w.jpg -o assets/images/me-${size}w.webp
done

# Move original image
cp me.jpg assets/images/me.jpg

# Clean up temporary files
rm me-*w.jpg

for img in *.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        cwebp -q 80 "$img" -o "${img%.*}.webp"
    fi
done 