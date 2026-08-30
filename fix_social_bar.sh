#!/bin/bash

# Find all HTML files except admin.html
for file in *.html; do
  [ "$file" = "admin.html" ] && continue
  
  # Check if file has the social bar
  if grep -q "<!-- SOCIAL BAR -->" "$file"; then
    # Extract social bar content
    social=$(sed -n '/<!-- SOCIAL BAR -->/,/<\/div>/p' "$file" | head -n -1)
    
    # Remove old social bar location
    sed -i '/<!-- SOCIAL BAR -->/,/<\/div>/d' "$file"
    
    # Insert social bar after nav-logo (before nav-links)
    sed -i "/<\/a>$/{N;s/<\/a>\n/<\/a>\n  $social\n/;}" "$file"
  fi
done
