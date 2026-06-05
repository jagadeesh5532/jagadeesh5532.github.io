// JG Moments Photography — Main JS

// NAV SCROLL
const navbar = document.getElementById('navbar');
if (navbar) {
window.addEventListener('scroll', () => {
navbar.classList.toggle('scrolled', window.scrollY > 60);
});
}

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
mobileNav.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(a => {
a.addEventListener('click', () => {
hamburger.classList.remove('open');
mobileNav.classList.remove('open');
});
});
}

// HERO BG ZOOM
const heroBg = document.getElementById('heroBg');
if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);

// FADE UP ON SCROLL
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
const obs = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));
}

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let lbImages = [], lbIndex = 0;

function openLightbox(imgs, idx) {
lbImages = imgs; lbIndex = idx;
lbImg.src = lbImages[lbIndex];
lightbox.classList.add('open');
document.body.style.overflow = 'hidden';
}
function closeLightbox() {
lightbox.classList.remove('open');
document.body.style.overflow = '';
lbImg.src = '';
}
function lbNavigate(dir) {
lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
lbImg.src = lbImages[lbIndex];
}
if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev) lbPrev.addEventListener('click', () => lbNavigate(-1));
if (lbNext) lbNext.addEventListener('click', () => lbNavigate(1));
if (lightbox) {
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
if (!lightbox.classList.contains('open')) return;
if (e.key === 'Escape') closeLightbox();
if (e.key === 'ArrowLeft') lbNavigate(-1);
if (e.key === 'ArrowRight') lbNavigate(1);
});
}

// ALBUM GALLERY LIGHTBOX
function initAlbumGallery() {
const photos = document.querySelectorAll('.album-photo');
if (!photos.length) return;
const imgs = Array.from(photos).map(p => p.querySelector('img').src);
photos.forEach((photo, i) => photo.addEventListener('click', () => openLightbox(imgs, i)));
}
initAlbumGallery();

// MOSAIC LIGHTBOX
function initMosaic() {
const items = document.querySelectorAll('.mosaic-item');
if (!items.length) return;
const imgs = Array.from(items).map(m => m.querySelector('img').src);
items.forEach((item, i) => item.addEventListener('click', () => openLightbox(imgs, i)));
}
initMosaic();

// GALLERY GRID LIGHTBOX (for album pages like Amber Billy, Jessica Gifford)
function initGalleryGrid() {
const items = document.querySelectorAll('.gallery-item');
if (!items.length) return;
const imgs = Array.from(items).map(item => item.querySelector('img').src);
items.forEach((item, i) => item.addEventListener('click', () => openLightbox(imgs, i)));
}
initGalleryGrid();

// ===== FORMSPREE AJAX SUBMIT (JSON method — most reliable) =====
document.querySelectorAll('.ajax-form').forEach(form => {
form.addEventListener('submit', async function(e) {
e.preventDefault();

const btn = form.querySelector('[type=submit]');
const succMsg = form.querySelector('.success-msg');
const origTxt = btn.textContent;

// Collect form fields into a plain object (works with all inputs, selects, textareas)
const payload = {};
new FormData(form).forEach((val, key) => { payload[key] = val; });

btn.textContent = 'Sending…';
btn.disabled = true;

try {
const res = await fetch(form.action, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
body: JSON.stringify(payload)
});

if (res.ok) {
form.reset();
btn.textContent = '✓ Sent Successfully!';
btn.style.background = 'var(--teal)';
if (succMsg) { succMsg.style.display = 'block'; succMsg.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
setTimeout(() => {
btn.textContent = origTxt;
btn.style.background = '';
btn.disabled = false;
}, 5000);
} else {
const errData = await res.json().catch(() => ({}));
console.error('Formspree error:', errData);
btn.textContent = 'Failed — please try again';
btn.style.background = 'var(--crimson)';
btn.disabled = false;
setTimeout(() => { btn.textContent = origTxt; btn.style.background = ''; }, 4000);
}
} catch (err) {
console.error('Network error:', err);
// Fallback: submit form normally if fetch fails
btn.textContent = 'Redirecting…';
form.submit();
}
});
});

// ===== DYNAMIC ALBUM GALLERY (instant render from data-photo-count) =====
function loadDynamicAlbum() {
const gallery = document.getElementById('dynamicGallery');
if (!gallery) return;
const folder = gallery.dataset.folder;
if (!folder) return;
const comingSoon = document.getElementById('albumComingSoon');
const count = parseInt(gallery.dataset.photoCount || '0');

if (!count) {
if (comingSoon) comingSoon.style.display = 'block';
return;
}
if (comingSoon) comingSoon.style.display = 'none';

const INITIAL_BATCH = 6;
const SUBSEQUENT_BATCH = 12;
let loadedCount = 0;

// Build src list immediately — no sequential HTTP probing needed
const srcs = Array.from({ length: count }, (_, i) => {
const num = String(i + 1).padStart(2, '0');
return `images/${folder}/${num}.jpg`;
});

function renderBatch(startIdx, batchSize = SUBSEQUENT_BATCH) {
const endIdx = Math.min(startIdx + batchSize, srcs.length);
for (let i = startIdx; i < endIdx; i++) {
const src = srcs[i];
const webpSrc = src.replace(/\.jpg$/i, '.webp');
const div = document.createElement('div');
div.className = 'album-photo fade-up';

// Generate descriptive alt text based on folder
let altText = 'Photography photo';
const folderMap = {
'portraits': 'Professional portrait and lifestyle photography - Image from JG Moments Houston',
'sports': 'Competitive swimming and aquatic sports photography - Action moment captured',
'celebrations': 'Celebration and festival photography featuring vibrant special moments',
'travel-nature': 'Travel and nature landscape photography showcasing scenic destinations'
};
if (folderMap[folder]) {
altText = folderMap[folder];
}

div.innerHTML = `<picture><source srcset="${webpSrc}" type="image/webp"><img src="${src}" alt="${altText}" loading="lazy"/></picture><div class="album-photo-icon"><span>+</span></div>`;
div.querySelector('img').onerror = function() { div.style.display = 'none'; };
div.addEventListener('click', () => openLightbox(srcs, i));
gallery.appendChild(div);
}

const obs = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
gallery.querySelectorAll('.fade-up:not(.visible)').forEach(el => obs.observe(el));

loadedCount = endIdx;

if (loadedCount < srcs.length) {
const lastPhoto = gallery.lastChild;
if (lastPhoto) {
const sentinel = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) { renderBatch(loadedCount); sentinel.disconnect(); }
});
}, { rootMargin: '100px' });
sentinel.observe(lastPhoto);
}
}
}

renderBatch(0, INITIAL_BATCH);
}
loadDynamicAlbum();

// ===== RANDOM ALBUM COVERS (portfolio cards + page heroes) =====
// Configuration for external gallery sources (like Pixieset)
const externalGalleries = {
'travel-nature': {
type: 'pixieset',
baseUrl: 'https://jgmoments.pixieset.com/travelandnature/',
// Using direct image URL from Pixieset
imageUrl: '//images.pixieset.com/343064511/91cfb9487adfb451faa5eefce55bcf59-xxlarge.jpg'
}
};

function setRandomCovers() {
const targets = document.querySelectorAll('[data-random-folder]');
if (!targets.length) return;

targets.forEach(el => {
const folder = el.dataset.randomFolder;
const isExternal = externalGalleries[folder];

if (isExternal) {
// Handle external galleries (Pixieset, etc.)
const config = externalGalleries[folder];

if (config.type === 'pixieset') {
// For Pixieset, use the direct image URL
let imageSrc = config.imageUrl || '';

if (imageSrc) {
// Ensure protocol is included
if (imageSrc.startsWith('//')) {
imageSrc = 'https:' + imageSrc;
}

if (el.classList.contains('page-hero-bg') || el.dataset.type === 'bg') {
el.style.backgroundImage = `url('${imageSrc}')`;
} else {
el.src = imageSrc;
}
}
}
} else {
// Handle local albums (existing logic)
const max = parseInt(el.dataset.photoCount || '10');
// Pick a random index instantly — all files 01..max are known to exist
const i = Math.floor(Math.random() * max) + 1;
const num = String(i).padStart(2, '0');
const src = `images/${folder}/${num}.jpg`;
const webpSrc = src.replace(/\.jpg$/i, '.webp');

if (el.classList.contains('page-hero-bg') || el.dataset.type === 'bg') {
el.style.backgroundImage = `image-set(url('${webpSrc}') type('image/webp'), url('${src}') type('image/jpeg'))`;
} else {
el.src = src;
}
}
});
}
setRandomCovers();

function initScrollingGallery() {
const gallery = document.getElementById('scrollingGallery');
if (!gallery) return;

const sources = [];
const folders = [
{ name: 'portraits', count: 35 },
{ name: 'celebrations', count: 18 },
{ name: 'sports', count: 7 }
];

folders.forEach(({ name, count }) => {
for (let i = 1; i <= count; i += 1) {
const num = String(i).padStart(2, '0');
sources.push(`images/${name}/${num}.jpg`);
}
});

if (!sources.length) return;

const shuffled = sources.sort(() => Math.random() - 0.5);
const display = shuffled.slice(0, Math.min(shuffled.length, 28));
const loopImages = display.concat(display);

loopImages.forEach(src => {
const picture = document.createElement('picture');
const webpSrc = src.replace(/\.jpg$/i, '.webp');
const source = document.createElement('source');
source.srcset = webpSrc;
source.type = 'image/webp';
picture.appendChild(source);
const img = document.createElement('img');
img.src = src;
img.alt = 'Featured photo';
img.loading = 'lazy';
picture.appendChild(img);
gallery.appendChild(picture);
});
}
initScrollingGallery();

// Scrolling Albums
const scrollingWrapper = document.querySelector('.scrolling-wrapper');
if (scrollingWrapper) {
scrollingWrapper.addEventListener('mouseover', () => scrollingWrapper.style.animationPlayState = 'paused');
scrollingWrapper.addEventListener('mouseout', () => scrollingWrapper.style.animationPlayState = 'running');
}
