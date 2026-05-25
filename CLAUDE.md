# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Overview

This is a **vanilla HTML/CSS/JavaScript photography portfolio website** (no build system, no package manager, no tests). It's deployed on GitHub Pages at **jagadeesh5532.github.io** and showcases wedding, portrait, sports, and travel photography through dynamic galleries.

---

## High-Level Architecture

### Technology Stack
- **HTML**: Static templates for each page (home, portfolio, 5 albums, about, contact, testimonials, admin)
- **CSS**: Single `style.css` file with CSS custom properties (variables) for theming — color palette uses Indian cultural theme (saffron, crimson, gold, purple, teal)
- **JavaScript**: Vanilla `main.js` — no frameworks, jQuery, or build tools
- **External Services**:
  - **Pixieset**: Image gallery hosting for "Travel & Nature" and "Portraits" albums (embedded via `<iframe>`)
  - **Formspree**: Contact form + testimonials submission handler (JSON POST method for AJAX)
  - **GitHub Pages**: Static hosting with auto-deployment on commit

### Key Design Patterns

#### **1. Responsive Design**
- Desktop-first approach with **800px breakpoint** for mobile fallback
- Fixed navbar (blur backdrop) with hamburger menu on mobile
- Hero sections use `background-image` with gradient overlays
- All interactive elements adapt via CSS media query

#### **2. Dynamic Image Galleries**
**Local albums** (`portraits/`, `sports/`, `candids/`, `celebrations/`):
- Photos stored as `01.jpg`, `02.jpg`, ... `NN.jpg` in `images/{folder}/`
- JavaScript builds image paths dynamically — no HTML editing needed for new photos
- `main.js` functions:
  - `loadDynamicAlbum()` — renders batch-loaded galleries with lazy loading
  - `setRandomCovers()` — picks random album photos for portfolio card cover images
  - `initAlbumGallery()` and `initMosaic()` — attach lightbox listeners

**External galleries** (Pixieset):
- `travel-nature.html` and `portraits.html` embed Pixieset via `<iframe src="https://jgmoments.pixieset.com/...">`
- **Important**: Pixieset privacy settings (email-gated vs. public) are controlled in the Pixieset dashboard, **NOT in HTML code**
- `index.html` references Pixieset direct image URL for Portraits album card

#### **3. Lightbox System**
- `main.js` handles a single global lightbox with keyboard navigation:
  - **Escape** closes
  - **Arrow Left/Right** navigates between images
  - Click outside overlay closes
- Works for both local album galleries and mosaic grids
- Images passed as array `[src1, src2, ...]` to `openLightbox(imgs, index)`

#### **4. Form Handling (Formspree)**
- All forms use AJAX submission with JSON method (most reliable)
- Form submission flow:
  1. User submits → `e.preventDefault()`
  2. `FormData` collected into plain object
  3. `fetch()` POST to Formspree endpoint with `Content-Type: application/json`
  4. On success: button shows "✓ Sent Successfully!" (green), form resets after 5 seconds
  5. On error: button shows "Failed — please try again" (red), auto-resets after 4 seconds
- Email delivery goes to `contact@jg-moments.com` (Formspree-managed)
- Testimonials submitted via contact form are tagged with `[Testimonial]` prefix in email

#### **5. Testimonials Admin Panel**
- `admin.html` — password-protected browser-based testimonial manager
- No backend database — all data stored in browser localStorage as JSON
- Default password: `testadmin` (user should change this)
- Workflow:
  1. User receives testimonials via Formspree email
  2. Opens admin.html, authenticates with password
  3. Adds/edits/deletes testimonial cards
  4. Exports JSON via download button
  5. Claude or user manually updates `testimonials.html` with JSON content (static HTML - no dynamic rendering)
- See `ADMIN_SETUP.md` for full documentation

#### **6. CSS Variable Theming**
All colors, fonts, spacing defined as CSS custom properties in `:root`:
```css
:root {
  --saffron: #FF6B00;
  --crimson: #C41230;
  --gold: #D4A017;
  --purple: #6E1FA8;
  --teal: #00897B;
  --text: #FFFBF5;
  --bg: #080404;
  --font-display: 'Cormorant Garamond';
  --font-body: 'Inter';
}
```
Used throughout for buttons, links, backgrounds, text colors. Change `--saffron` to update the primary accent globally.

#### **7. Scroll Animations**
- **Fade-up on scroll**: Elements with `.fade-up` class are observed by IntersectionObserver; visibility added when entering viewport (`threshold: 0.1`)
- **Hero background zoom**: `heroBg` gets `.loaded` class after 100ms, triggering CSS scale animation
- **Navbar scroll behavior**: When `scrollY > 60`, navbar gets `.scrolled` class (affects backdrop blur intensity)

---

## File Structure & Key Code Sections

### Core Files
- **`index.html`** — Home page with hero, featured mosaic grid (6 cards), testimonials preview, scrolling gallery, contact CTA
- **`portfolio.html`** — Album overview with 5 portfolio cards (Portraits, Sports, Candids, Celebrations, Travel & Nature)
- **`{album}.html`** — Individual album pages (`portraits.html`, `sports.html`, `candids.html`, `celebrations.html`, `travel-nature.html`)
  - Each contains a hero section + dynamic gallery or Pixieset iframe
- **`about.html`** — Photographer bio
- **`contact.html`** — Contact form + Formspree endpoint
- **`testimonials.html`** — 6 static testimonial cards (manually updated from admin.html exports)
- **`admin.html`** — Testimonials management dashboard (password-protected, localStorage-backed)
- **`main.js`** — All JavaScript interactions (navbar, hamburger, lightbox, galleries, forms, animations)
- **`style.css`** — Single stylesheet with mobile-first design, CSS variables, responsive breakpoints

### Image Folders
```
images/
├── home/              ← Hero hero.jpg + featured-01.jpg through featured-06.jpg
├── logo/              ← logo.png + logo-white.png (referenced in nav)
├── portraits/         ← 01.jpg–NN.jpg + optional hero.jpg
├── sports/            ← 01.jpg–NN.jpg + optional hero.jpg
├── candids/           ← 01.jpg–NN.jpg + optional hero.jpg
├── celebrations/      ← 01.jpg–NN.jpg + optional hero.jpg
└── travel-nature/     ← 01.jpg–NN.jpg + optional hero.jpg
```

---

## Common Development Tasks

### Adding Photos to an Album
1. Rename photos sequentially: `01.jpg`, `02.jpg`, `03.jpg`, ...
2. Push to GitHub in `images/{folder}/`
3. Update the `data-photo-count` attribute in `portfolio.html` if the total changed
4. Hard refresh browser (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows)

**Example**: To add 5 new photos to Celebrations, rename them `19.jpg`–`23.jpg` (if last was 18), push to `images/celebrations/`, and update `portfolio.html`:
```html
<!-- Before: -->
<img data-photo-count="18" ...>
<!-- After: -->
<img data-photo-count="23" ...>
```

### Changing Album Hero Image
Upload a file named `hero.jpg` to the album folder (`images/{folder}/hero.jpg`). The lightbox system ignores it; `main.js` uses it only for the page banner background.

### Changing the Logo
Upload new logo to `images/logo/logo.png`. The navbar automatically references it on all pages.

### Changing the Home Page Featured Mosaic
Edit `index.html` — the 6 mosaic grid items reference images in `images/home/` (currently sourced from Adobe Portfolio CDN URL). To use local images:
1. Upload 6 images to `images/home/` named `featured-01.jpg` through `featured-06.jpg`
2. Update the `src` attributes in the mosaic grid HTML

### Updating Testimonials
1. Receive testimonial via Formspree email (`contact@jg-moments.com`)
2. Open `admin.html` in a browser, authenticate with admin password
3. Add testimonial using the form (quote, author, rating, category)
4. Click "Export as JSON" to download the data
5. Copy the JSON and paste into `testimonials.html` `<script>` block (at bottom of file)
6. Or paste individual cards as HTML in the testimonials grid section

### Debugging Form Issues
If contact form doesn't send emails:
1. Check Formspree dashboard at https://formspree.io
2. Verify the form endpoint (`action` attribute in HTML) matches your Formspree project
3. Check spam folder for emails
4. Test with a different email provider if available

---

## Important Implementation Details

### Pixieset Integration
- **Portfolio cards** on `index.html` and `portfolio.html` link to Pixieset galleries
- **Album pages** embed Pixieset via `<iframe>` (e.g., `<iframe src="https://jgmoments.pixieset.com/travelandnature/">`)
- **Email gate behavior**: Controlled by **Pixieset dashboard settings** (Privacy > Require email), NOT by HTML
  - If a gallery asks for email and another doesn't, the difference is in Pixieset account settings, not code
  - Solution: Log into Pixieset, go to gallery settings, change privacy level

### Gallery Photo Count
Some templates hardcode `data-photo-count="XX"` in `portfolio.html`. This tells `main.js` how many files to expect:
```html
<img data-photo-count="35" data-random-folder="portraits" ...>
```
Update this if the folder changes size (checked by `parseInt(el.dataset.photoCount || '0')` in `main.js`).

### External Gallery Configuration
`main.js` has an `externalGalleries` object that maps album folders to Pixieset URLs:
```javascript
const externalGalleries = {
  'travel-nature': {
    type: 'pixieset',
    baseUrl: 'https://jgmoments.pixieset.com/travelandnature/',
    imageUrl: '//images.pixieset.com/343064511/...-xxlarge.jpg'
  }
};
```
This is used by `setRandomCovers()` to display random cover images on portfolio cards.

---

## Documentation References

- **`README.md`** — User-facing maintenance guide (photo uploads, logo changes, cache clearing, contact form)
- **`ADMIN_SETUP.md`** — Testimonials admin panel setup and workflow
- **`QUICK_REFERENCE.md`** — Summary of recent updates (fonts, testimonials page, image gallery)

---

## Browser Compatibility & Testing

- Tested on modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile breakpoint: **800px** (below this, hamburger menu activates)
- All form submissions use Fetch API (requires ES6 support)
- Lightbox uses IntersectionObserver (polyfill may be needed for IE11, but IE11 is not officially supported)

---

## Notes for Future Work

1. **No build system** — This is intentional. Changes are deployed directly to GitHub Pages on commit. No bundling, minification, or linting in CI/CD.
2. **No database** — All content is static HTML. Testimonials use browser localStorage (admin.html) + JSON export → manual paste into `testimonials.html`.
3. **CSS variables** — Update `:root` in `style.css` to change the entire color scheme globally.
4. **Responsive images** — Some `<picture>` elements use WebP with JPEG fallback. Browsers that don't support WebP fall back to JPEG automatically.
5. **Form submissions** — Formspree JSON method is chosen over form-encoded because it's more reliable with CORS and CSP headers.

---

*Last updated: 2026-05-25 · For questions, refer to README.md, ADMIN_SETUP.md, or inline code comments*
