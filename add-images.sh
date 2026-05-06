#!/bin/bash

# ============================================================================
# JG Moments Photography - Automated Image Addition Script
# ============================================================================
# Usage: ./add-images.sh [album-name]
# Example: ./add-images.sh portraits
#          ./add-images.sh swim-events
# ============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$REPO_ROOT/images"
STAGING_DIR="$REPO_ROOT/new-images"  # Temporary folder for new images
QUALITY=80

ALBUMS=(
  "portraits"
  "candids"
  "celebrations"
  "shared-moments"
  "swim-events"
  "travel-nature"
)

# ============================================================================
# FUNCTIONS
# ============================================================================

show_help() {
  echo -e "${BLUE}JG Moments Photography - Image Addition Tool${NC}"
  echo ""
  echo "Usage: $0 [album-name]"
  echo ""
  echo "Available albums:"
  for album in "${ALBUMS[@]}"; do
    echo "  - $album"
  done
  echo ""
  echo "Examples:"
  echo "  $0 portraits"
  echo "  $0 swim-events"
  echo ""
  echo "Process:"
  echo "  1. Place your JPG images in the '$STAGING_DIR' folder"
  echo "  2. Run this script with the album name"
  echo "  3. Script will automatically:"
  echo "     - Find highest image number in album"
  echo "     - Number new images sequentially"
  echo "     - Create WebP versions"
  echo "     - Commit to git"
  echo "     - Push to GitHub"
  echo ""
}

log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

validate_album() {
  local album=$1
  for valid_album in "${ALBUMS[@]}"; do
    if [[ "$valid_album" == "$album" ]]; then
      return 0
    fi
  done
  return 1
}

get_last_image_number() {
  local album=$1
  local last_num=$(ls "$IMAGES_DIR/$album"/*.jpg 2>/dev/null | \
                   sed 's/.*\///' | sed 's/\.jpg$//' | sort -V | tail -1)

  if [[ -z "$last_num" ]]; then
    echo "0"
  else
    echo "$last_num"
  fi
}

find_jpg_files() {
  find "$STAGING_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) 2>/dev/null | sort
}

validate_jpg_quality() {
  local file=$1
  local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  local size_mb=$((size / 1048576))

  if [[ $size_mb -gt 5 ]]; then
    log_warning "Image '$file' is ${size_mb}MB (ideal: <3MB)"
    return 1
  fi
  return 0
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  JG Moments Photography - Automated Image Addition         ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  # Validate arguments
  if [[ -z "$1" ]]; then
    log_error "Album name not provided"
    echo ""
    show_help
    exit 1
  fi

  ALBUM="$1"

  if ! validate_album "$ALBUM"; then
    log_error "Album '$ALBUM' not recognized"
    echo ""
    show_help
    exit 1
  fi

  ALBUM_PATH="$IMAGES_DIR/$ALBUM"

  # Check album exists
  if [[ ! -d "$ALBUM_PATH" ]]; then
    log_error "Album folder not found: $ALBUM_PATH"
    exit 1
  fi

  log_info "Album: $ALBUM"

  # Check staging folder exists
  if [[ ! -d "$STAGING_DIR" ]]; then
    log_warning "Staging folder doesn't exist: $STAGING_DIR"
    log_info "Creating staging folder..."
    mkdir -p "$STAGING_DIR"
    log_success "Staging folder created"
    echo ""
    log_info "Please add your JPG images to:"
    echo "  $STAGING_DIR"
    echo ""
    log_info "Then run this script again"
    exit 0
  fi

  # Find new images
  IMAGES=($(find_jpg_files))

  if [[ ${#IMAGES[@]} -eq 0 ]]; then
    log_warning "No JPG images found in staging folder"
    echo ""
    log_info "Place your images in: $STAGING_DIR"
    exit 0
  fi

  log_success "Found ${#IMAGES[@]} image(s) to process"
  echo ""

  # Get last image number
  LAST_NUM=$(get_last_image_number "$ALBUM")
  START_NUM=$((LAST_NUM + 1))

  log_info "Last image in album: $(printf '%02d' $LAST_NUM).jpg"
  log_info "New images will start at: $(printf '%02d' $START_NUM).jpg"
  echo ""

  # Process each image
  for ((i=0; i<${#IMAGES[@]}; i++)); do
    SOURCE="${IMAGES[$i]}"
    NEW_NUM=$((START_NUM + i))
    NEW_NUM_STR=$(printf '%02d' $NEW_NUM)

    DEST_JPG="$ALBUM_PATH/$NEW_NUM_STR.jpg"
    DEST_WEBP="$ALBUM_PATH/$NEW_NUM_STR.webp"

    log_info "Processing image $((i+1))/${#IMAGES[@]}: $(basename "$SOURCE")"

    # Validate file size
    if ! validate_jpg_quality "$SOURCE"; then
      log_warning "Proceeding anyway..."
    fi

    # Copy JPG
    cp "$SOURCE" "$DEST_JPG"
    log_success "Copied to: $NEW_NUM_STR.jpg"

    # Create WebP
    if command -v convert &> /dev/null; then
      convert "$DEST_JPG" -quality $QUALITY "$DEST_WEBP"
      local webp_size=$(stat -f%z "$DEST_WEBP" 2>/dev/null || stat -c%s "$DEST_WEBP" 2>/dev/null)
      local webp_size_mb=$((webp_size / 1048576))
      log_success "Created WebP: $NEW_NUM_STR.webp (${webp_size_mb}MB)"
    else
      log_warning "ImageMagick not found - skipping WebP conversion"
      log_warning "Install: brew install imagemagick"
    fi

    # Clean up staging file
    rm "$SOURCE"

    echo ""
  done

  # Git operations
  log_info "Preparing git commit..."
  cd "$REPO_ROOT"

  git add "images/$ALBUM/"

  COMMIT_MSG="Add ${#IMAGES[@]} new image(s) to $ALBUM album ($(printf '%02d' $START_NUM)-$(printf '%02d' $((START_NUM + ${#IMAGES[@]} - 1))))"

  git commit -m "$COMMIT_MSG"
  log_success "Git commit created: $COMMIT_MSG"

  # Git push
  log_info "Pushing to GitHub..."
  if git push origin main 2>&1; then
    log_success "Pushed to GitHub!"
  else
    log_warning "Could not push from sandbox - please run locally:"
    echo "  git push origin main"
  fi

  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  ✓ All Done!                                              ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  log_success "New images added to $ALBUM album"
  log_info "Reload website to see changes: https://jgmomentsphotography.com/$ALBUM.html"
  echo ""
}

# Run main function
main "$@"
