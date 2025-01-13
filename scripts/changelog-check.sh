#!/bin/bash

SUBMODULE_FILE="./submodules/rosenpass/CHANGELOG.md"
SYMLINK="./content/en/docs/changelog.md"
CACHED_FILE="./.cache/CHANGELOG-cached.md"

# Ensure the target directory exists (only for the target, not submodules)
mkdir -p "$(dirname "$SYMLINK")"

# Check if the submodule file exists
if [ -f "$SUBMODULE_FILE" ]; then
    echo "Submodule found. Creating symlink..."
    ln -sf "../../../$SUBMODULE_FILE" "$SYMLINK"
else
    echo "Submodule not found. Using cached version..."
    # Remove the dangling symlink if it exists
    if [ -L "$SYMLINK" ]; then
        rm "$SYMLINK"
    fi
    # Copy the cached file to the target location
    cp "$CACHED_FILE" "$SYMLINK"
fi
