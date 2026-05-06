# 📸 Add Images to Your Portfolio - Automated Script

This script automates the entire process of adding new images to any album on your photography website.

## **Quick Start**

### **1. Create the Staging Folder (First Time Only)**
```bash
cd ~/Documents/GitHub/jagadeesh5532.github.io
./add-images.sh portraits
```

This will create a `new-images` folder. ✓

### **2. Add Your Images**
Copy your JPG files to the `new-images` folder:
```bash
cp ~/Downloads/photo1.jpg new-images/
cp ~/Downloads/photo2.jpg new-images/
cp ~/Downloads/photo3.jpg new-images/
```

### **3. Run the Script**
```bash
./add-images.sh portraits
```

**That's it!** The script will:
- ✓ Number images sequentially
- ✓ Create WebP versions (for faster loading)
- ✓ Commit to git
- ✓ Push to GitHub
- ✓ Clean up staging folder

---

## **Available Albums**

```bash
./add-images.sh portraits           # People, lifestyle, family
./add-images.sh candids             # Unscripted moments
./add-images.sh celebrations        # Events, festivals
./add-images.sh shared-moments      # Togetherness, belonging
./add-images.sh sports         # Sports, aquatics
./add-images.sh travel-nature       # Landscapes, wandering
```

---

## **What the Script Does**

```
1. Check for new JPGs in 'new-images' folder
2. Find the highest number in your album (e.g., 41.jpg)
3. Number new images sequentially (42.jpg, 43.jpg, ...)
4. Create optimized WebP versions automatically
5. Copy files to the album folder
6. Clean up the staging folder
7. Commit with a descriptive message
8. Push to GitHub
```

---

## **Example Workflow**

```bash
# Add 5 new travel photos
cp ~/Pictures/trip-2024/{1,2,3,4,5}.jpg new-images/

# Run script
./add-images.sh travel-nature

# Output:
# ✓ Found 5 image(s) to process
# ✓ Last image in album: 56.jpg
# ✓ New images will start at: 57.jpg
# ✓ Processing image 1/5: 1.jpg
# ✓ Copied to: 57.jpg
# ✓ Created WebP: 57.webp
# ... (repeat for each image)
# ✓ Git commit created
# ✓ Pushed to GitHub!
```

---

## **Image Requirements**

| Requirement | Recommendation |
|-------------|-----------------|
| **Format** | JPG (JPEG) |
| **Quality** | 80+ quality setting |
| **File Size** | Under 3MB per image |
| **Dimensions** | Any (script handles) |

The script will warn if files are too large, but will proceed anyway.

---

## **Troubleshooting**

### **"ImageMagick not found" error**
Install ImageMagick (creates WebP files):
```bash
brew install imagemagick
```

### **"Git push failed" warning**
This happens when running from the sandbox. Simply run from your terminal:
```bash
cd ~/Documents/GitHub/jagadeesh5532.github.io
git push origin main
```

### **"Album not recognized" error**
Check spelling. Run with no arguments to see available albums:
```bash
./add-images.sh
```

---

## **How Files Are Named**

Images are numbered **01 through 999** in each album.

```
portraits/
├── 01.jpg  ├── 01.webp
├── 02.jpg  ├── 02.webp
├── ...
└── 41.jpg  └── 41.webp    (current last image)

# When you add 3 new images:
├── 42.jpg  ├── 42.webp
├── 43.jpg  ├── 43.webp
└── 44.jpg  └── 44.webp    (newly added)
```

---

## **What About Existing Images?**

To replace an existing image, manually:
```bash
# Replace image 25 with a better version
cp ~/Downloads/better-photo.jpg \
  ~/Documents/GitHub/jagadeesh5532.github.io/images/portraits/25.jpg

# Create new WebP
cd ~/Documents/GitHub/jagadeesh5532.github.io/images/portraits
convert 25.jpg -quality 80 25.webp

# Commit
cd ~/Documents/GitHub/jagadeesh5532.github.io
git add images/portraits/25.*
git commit -m "Update portrait image 25 with better version"
git push origin main
```

---

## **Next Steps**

1. ✓ Save this script
2. ✓ Make it executable: `chmod +x add-images.sh`
3. ✓ Run it to create staging folder: `./add-images.sh portraits`
4. ✓ Add your first batch of images
5. ✓ Run again to process them

**Website updates live in ~30 seconds after push!** 🚀
