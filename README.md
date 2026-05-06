# JG Moments Photography — Site Maintenance Guide

Welcome! This guide covers everything you need to manage and update your website at **jagadeesh5532.github.io** — no coding knowledge required.

---

## 📁 Folder Structure

```
jagadeesh5532.github.io/
│
├── images/
│   ├── home/          ← Hero + featured photos for the Home page
│   ├── logo/          ← Your logo files (logo.png, logo-white.png)
│   ├── portraits/     ← Photos for Portraits & Lifestyle album
│   ├── sports/   ← Photos for Swim Events album
│   ├── candids/       ← Photos for Candids album
│   ├── celebrations/  ← Photos for Celebrations album
│   └── travel-nature/ ← Photos for Travel & Nature album
│
├── index.html         ← Home page
├── portfolio.html     ← Album overview page
├── portraits.html     ← Portraits album page
├── sports.html   ← Swim Events album page
├── candids.html       ← Candids album page
├── celebrations.html  ← Celebrations album page
├── travel-nature.html ← Travel & Nature album page
├── about.html         ← About page
├── contact.html       ← Contact/Booking page
├── testimonials.html  ← Testimonials page
├── style.css          ← All site styling
└── main.js            ← Site functionality
```

---

## 📸 How to Upload Photos to an Album

Photos are **automatically displayed** — no HTML editing needed! Just upload files with the right names.

### Step 1 — Name your photos
Rename your photos sequentially before uploading:
```
01.jpg
02.jpg
03.jpg
04.jpg
...
```
Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

### Step 2 — Upload to GitHub

1. Go to [github.com/jagadeesh5532/jagadeesh5532.github.io](https://github.com/jagadeesh5532/jagadeesh5532.github.io)
2. Click the **`images`** folder
3. Click the correct album folder (e.g. `candids`)
4. Click **"Add file"** → **"Upload files"**
5. Drag and drop your renamed photos
6. Scroll down, click **"Commit changes"**
7. Wait ~60 seconds, then refresh your website — photos appear automatically!

### Which folder goes to which page?

| Folder | Website Page |
|--------|-------------|
| `images/portraits/` | portraits.html |
| `images/sports/` | sports.html |
| `images/candids/` | candids.html |
| `images/celebrations/` | celebrations.html |
| `images/travel-nature/` | travel-nature.html |

### Tips
- Upload in any batch — the site handles up to 60 photos per album
- Gaps in numbering are OK (01, 02, 05 still works — 03 & 04 just won't show)
- To **remove** a photo: delete it from the GitHub folder. To delete on GitHub, click the file → click the trash icon → commit
- To **reorder** photos: rename them (01 shows first, 02 second, etc.)

---

## 🖼️ How to Change the Hero / Cover Photo on Each Page

Each page has a large banner photo at the top called the **hero image**.

### For Portraits, Candids, Celebrations, Travel & Nature pages
Upload a file named **`hero.jpg`** into that album's folder:
- `images/portraits/hero.jpg` → Portraits page banner
- `images/candids/hero.jpg` → Candids page banner
- `images/celebrations/hero.jpg` → Celebrations page banner
- `images/travel-nature/hero.jpg` → Travel & Nature page banner

`hero.jpg` is reserved and will NOT appear in the photo gallery — it only shows as the page banner.

### For the Home page hero
1. Go to GitHub → open `index.html`
2. Click the pencil ✏️ edit icon
3. Find this line (near the top of the file):
   ```
   background-image:url('https://cdn.myportfolio.com/...
   ```
4. Replace the URL with `images/home/hero.jpg`
5. Upload your desired hero photo to `images/home/hero.jpg`
6. Commit both changes

---

## 🔖 How to Change the Logo

The logo appears in the navigation bar on every page.

### Quick method
1. Prepare your logo file — name it exactly **`logo.png`**
   - Recommended: white or transparent background version, roughly 200×80px
2. Go to GitHub → `images/logo/` folder
3. Upload `logo.png` (overwrite the existing one)
4. Done — the new logo appears on all pages within ~60 seconds

### If you have a white version for dark backgrounds
- Upload it as `images/logo/logo-white.png`
- Ask Claude to update the site to use it

---

## 🌐 How to Force the Website to Reload (Clear Cache)

Sometimes your browser shows an old version of the site even after you've made changes. Here's how to fix that:

### On Desktop
- **Chrome / Edge:** `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- **Firefox:** `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- **Safari:** `Cmd + Option + R`

### On Mobile
- Close the browser tab completely, then reopen the site
- Or open the site in a **Private / Incognito** tab — always loads fresh

### If visitors are seeing old content
Ask Claude to "bump the cache version" — it updates a version number in all HTML files which forces all visitors' browsers to reload the latest files.

---

## 🏠 How to Update the Home Page Featured Photos (Mosaic Grid)

The 6 featured photos on the home page mosaic grid are currently sourced from your Adobe Portfolio CDN.

To swap them with your own photos:
1. Upload your 6 best photos to `images/home/` named: `featured-01.jpg` through `featured-06.jpg`
2. Tell Claude: *"Update the home page mosaic to use my local featured photos"* — Claude will update `index.html` for you

---

## 📩 Contact Form & Testimonials

- Contact form submissions → your email **jgmoments.htx@gmail.com** via Formspree
- Testimonial submissions → same inbox, tagged `[Testimonial]`
- If emails stop arriving, check your Formspree dashboard at [formspree.io](https://formspree.io)

---

## ✏️ Quick Edits You Can Do Yourself on GitHub

For small text changes (your bio, phone number, captions):
1. Go to GitHub → click the HTML file you want to edit
2. Click the pencil ✏️ icon (top right)
3. Make your changes
4. Click **"Commit changes"** at the bottom
5. Changes go live in ~60 seconds

---

## 🤝 Getting Help from Claude

For anything more complex, just message Claude and describe what you want:

> *"Add 8 new photos to my Celebrations album"*
> *"Change the home page hero photo to this image"*
> *"Update my bio on the About page"*
> *"The form is not sending emails"*
> *"Change the logo to the white version"*

Claude can upload files directly to GitHub on your behalf.

---

## 🔐 GitHub Token Note

Your GitHub personal access token was used during setup. If you ever need Claude to push changes again, you may need to generate a new token at:
**GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**

Generate with **`repo`** scope checked, then share with Claude in chat.

---

*Site built and maintained with ❤️ by Claude for JG Moments Photography · Houston, TX*
