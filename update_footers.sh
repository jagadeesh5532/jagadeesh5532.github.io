#!/bin/bash

# Replacement footer albums section
FOOTER_ALBUMS='    <div>
      <p class="footer-heading">Featured Albums</p>
      <ul class="footer-links">
        <li><a href="portraits.html">Children & Teens</a></li>
        <li><a href="sports.html">Swimming</a></li>
        <li><a href="portraits-families.html">Portraits & Families</a></li>
        <li><a href="celebrations.html">Celebrations</a></li>
        <li><a href="travel-nature.html">Travel &amp; Nature</a></li>
        <li style="margin-top:0.5rem;"><a href="portfolio.html" style="color:var(--saffron);font-weight:500;">View All Albums →</a></li>
      </ul>
    </div>'

# Find all HTML files and replace Albums section
for file in *.html */*.html 2>/dev/null; do
  if [ -f "$file" ] && grep -q "footer-heading.*Albums" "$file"; then
    # Use perl for multiline replacement
    perl -i -0pe 's/<div>\s*<p class="footer-heading">Albums<\/p>.*?<\/ul>\s*<\/div>/'"$(echo "$FOOTER_ALBUMS" | sed 's/\//\\\//g' | sed 's/\$/\\$/g')"'/s' "$file"
    echo "Updated: $file"
  fi
done
