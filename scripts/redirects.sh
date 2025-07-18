#!/bin/bash

# Configuration: define directories and their base paths for aliasing
# Add multiples like this:
# directories_to_alias["./content/en/docs/rosenpass-project/"]="/docs/ /test/"
declare -A directories_to_alias
directories_to_alias["./content/en/docs/rosenpass-project/"]="/docs/"
directories_to_alias["./content/en/docs/rosenpass-tool/"]="/docs/"

# Loop through each directory for aliasing
for dir in "${!directories_to_alias[@]}"; do
    base_paths=(${directories_to_alias[$dir]})
    
    # Find all .md and .html files in directory
    find "$dir" -type f \( -iname "*.md" -o -iname "*.html" \) | while read file; do
        [ -e "$file" ] || continue
        
        test=""
        # Check if file is _index.html
        if [[ "$(basename "$file")" == "_index.html" ]]; then
            # Strip _index.html
            relative_path="${file%_index.html}"
            relative_path="${relative_path#${dir}}"  # Strip base directory
        else
            # For other files, remove the directory part
            relative_path="${file#${dir}}"
            # Strip the extension (.md or .html)
            relative_path="${relative_path%.*}"
        fi
        
        # Remove leading slash
        relative_path="${relative_path#/}"
        
        # Create the alias
        alias_paths=()
        for base_path in "${base_paths[@]}"; do
            alias_paths+=("${base_path}${relative_path}")
        done

        # Format the alias line
        alias_line="aliases: [$(IFS=', '; echo "${alias_paths[*]}")]"

        # Remove any extra aliases headers in the file
        sed -i '/^aliases:/d' "$file"

        # Add the alias line at line 2 if no aliases header exists
        if ! grep -q "^aliases:" "$file"; then
            sed -i "2i $alias_line" "$file"
        else
            # Otherwise, update the alias header
            sed -i "s|^aliases: \[.*\]|$alias_line|" "$file"
        fi
    done
done

echo "Alias redirects updated."