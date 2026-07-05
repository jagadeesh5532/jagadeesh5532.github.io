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

// GALLERY GRID LIGHTBOX & AUTO-FIT (for album pages like Amber Billy, Jessica Gifford)
function initGalleryGrid() {
const grid = document.querySelector('.gallery-grid');
const items = document.querySelectorAll('.gallery-item');
if (!items.length || !grid) return;

const imgs = Array.from(items).map(item => {
const img = item.querySelector('img');
return img ? img.src : '';
}).filter(src => src);

// Set lightbox listeners
items.forEach((item, i) => {
item.style.cursor = 'pointer';
item.addEventListener('click', (e) => {
e.stopPropagation();
openLightbox(imgs, i);
});
});

// Auto-fit: adjust grid columns based on viewport width
function adjustGridColumns() {
const width = window.innerWidth;
let minWidth = 280;

if (width <= 400) minWidth = 200;
else if (width <= 600) minWidth = 200;
else if (width <= 768) minWidth = 240;
else if (width <= 1024) minWidth = 260;
else minWidth = 280;

grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}px, 1fr))`;
}

// Adjust columns on load and resize
adjustGridColumns();
window.addEventListener('resize', adjustGridColumns);

// Auto-adjust image spans based on aspect ratio (landscape images span 2 columns)
items.forEach(item => {
const img = item.querySelector('img');
if (!img) return;

// Wait for image to load to get aspect ratio
if (img.complete) {
handleImageLoad();
} else {
img.addEventListener('load', handleImageLoad);
}

function handleImageLoad() {
const ratio = img.naturalWidth / img.naturalHeight;
// If landscape (wider than tall), make it span 2 columns for visual prominence
if (ratio > 1.2) {
item.classList.add('landscape');
} else {
item.classList.remove('landscape');
}
}
});
}

// Initialize on load and after DOM ready
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initGalleryGrid);
} else {
initGalleryGrid();
}

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
},
'arya-cake-smash': {
type: 'pixieset',
baseUrl: 'https://jgmoments.pixieset.com/aryacakesmash/',
imageUrl: 'https://images.pixieset.com/962486611/524949cf8e0aa024297b4378827ed72d-xxlarge.jpg'
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

// ===== TESTIMONIALS CAROUSEL =====
const testimonials = [
  { author: 'Jessica Smith', type: 'Engagement Photography, Humble', quote: 'We could not be happier with our engagement photo experience! From the moment he arrived, we knew we were in great hands. He came prepared with a wagon stocked with bottled water, a fan, and even a pop-up changing tent, which made outfit changes so much easier and more comfortable in the Texas heat. He was incredibly kind, professional, and accommodating throughout the entire session. He happily incorporated specific poses and shots that I had requested, and even rolled with additional props and ideas we came up with on the spot. Nothing felt rushed, and he truly wanted to make sure we got the photos we envisioned. What impressed us even more was the turnaround time, our photos were beautifully edited and delivered in just three days! Not only did we receive them quickly, but there was also a wonderful variety of images, each one capturing genuine moments and emotions. The photos are absolutely beautiful and perfectly reflect the love, joy, and connection between us. These are memories we will cherish for the rest of our lives, and we are so grateful for the care and talent he brought to our engagement session. We highly recommend him to anyone looking for a photographer who is talented, thoughtful, prepared, and truly passionate about what he does.', photos: ['https://images.pixieset.com/574949611/8b314e896d6d738c38017a29b862d707-xxlarge.jpg', 'https://images.pixieset.com/574949611/c5afb4b7b9350ae32cdb3b9b1a435cdf-xxlarge.jpg', 'https://images.pixieset.com/574949611/a119842726a6f672fdce0e66737a6769-xxlarge.jpg', 'https://images.pixieset.com/574949611/9cd8d10b9a2556c929eab36dcd3311aa-xxlarge.jpg'] },
  { author: 'Dominque Joshua', type: 'Wedding Photography, Spring', quote: 'After receiving our initial wedding photos back, we realized I didn\'t get 1 photo by myself in my wedding gown nor too many of us by ourselves.. so we scheduled a photoshoot! The photographer came to our home & was amazing! This was so fun & intimate! It was wild having to get back into these wedding clothes 3 weeks later because so many emotions from that day came back, but it was so worth it! Thank you to @jg_moments for making this happen for us! We appreciate you!', photos: ['https://images.pixieset.com/313429611/acf2144ed655efb996404dc3d4a289b9-xxlarge.jpg', 'https://images.pixieset.com/313429611/ae856e80166afc1b831bed210a3218ed-xxlarge.jpg', 'https://images.pixieset.com/313429611/eb1a4651b91f5fefda91204601c4d338-xxlarge.png', 'https://images.pixieset.com/313429611/8a9d652a1bb8940ae8e5049ac8d25839-xxlarge.png'] },
  { author: 'Afreen Pargaonkar', type: 'Family Photography, Tomball', quote: 'Jagdeesh is a fantastic photographer. He truly loves the process of photography and capturing your precious moments the way you want him to along with adding his own cinematic style to it. He is so patient and understanding especially when it comes to photography with kids. He has photographed us for many of our special moments and we will ask him to do so for many many more of our special occasions and moments.', photos: ['https://images.pixieset.com/219766511/19c1cac06de01fc82354b56891a07845-xxlarge.jpg', 'https://images.pixieset.com/419486511/dba6d0fc8ba46339ae310fb9717944e4-xxlarge.jpg', 'https://images.pixieset.com/219766511/2fef2173b1f25e95cdae85ce379cc72c-xxlarge.jpg'] },
  { author: 'Shari Block', type: 'Portrait Photography, Spring', quote: 'Love the photos!!! Jag was very nice and I felt comfortable meeting him and during the shoot. And he even had a small tent where I could change and this was an outdoor shoot. I\'ve already recommended him in a Facebook post.', photos: ['https://images.pixieset.com/247559611/176fecbf05b0fdab1a78d3fe5d9fb700-xxlarge.jpg', 'https://images.pixieset.com/247559611/01167a47b9030ee81b672f8682fa6457-xxlarge.jpg', 'https://images.pixieset.com/247559611/5c59608a1157e0a7a98c7f05cdb506be-xxlarge.jpg', 'https://images.pixieset.com/247559611/ebe3e90a51a04141a7d58d522f2423b2-xxlarge.jpg'] },
  { author: 'Rashmi SA', type: 'Family Photography, Tomball', quote: 'A truly dedicated photographer who captures every moment perfectly. What impressed me the most was the passion, patience, and commitment shown throughout the entire shoot. No detail was overlooked, and every frame reflected genuine effort and creativity. Their ability to make everyone feel comfortable while tirelessly working to get the perfect shot. Thank you for your hard work, professionalism, and dedication to creating memories that will be cherished forever. Highly recommended!', photos: ['https://images.pixieset.com/219766511/b000715b64b61dc0c175322fd19ecd94-xxlarge.jpg', 'https://images.pixieset.com/219766511/589e17588ccd776b70d2af1adeca79c2-xxlarge.jpg', 'https://images.pixieset.com/219766511/1c1589e3f10b04fdc6c1bcecb3938af2-xxlarge.jpg'] },
  { author: 'Creshelle Smith', type: 'Family Photography, Pearland', quote: 'Absolutely loved our photos. Jag was professional and so accommodating; he worked great with our busy toddlers. We received our pictures faster than I\'ve ever experienced. Will absolutely use Joyful & Graceful Moments for our future sessions.', photos: ['https://images.pixieset.com/892857611/4e3e54d5ffb9e4f4dbf692ad6c664d47-xxlarge.jpg', 'https://images.pixieset.com/892857611/2108e54d66e8c3d49a59b2b002c12523-xxlarge.jpg', 'https://images.pixieset.com/892857611/8fa330bf6f9f45c2fca1b3b56a19d549-xxlarge.jpg', 'https://images.pixieset.com/892857611/518210f4b7fefdc6a645985f433a4e9b-xxlarge.jpg'] },
  { author: 'Krishna Lanka', type: 'Family & Cultural Events Photography, Tomball', quote: 'We had multiple photo shoots done with them and every single photo came out really really good. The service provided is outstanding. They really put a lot of thought and effort to understand what you need and make suggestions to make your perfect moments memorable. And they do this with a smile on their face. I would very strongly recommend them for your events!', photos: ['https://images.pixieset.com/733586511/70620034f02f64ed915000d8802a9335-xxlarge.jpg', 'https://images.pixieset.com/733586511/a63b0897467890416090d371340bbf56-xxlarge.jpg', 'https://images.pixieset.com/219766511/ef76f8d7e39c28d99cfdc5ed57c2b98d-xxlarge.jpg'] },
  { author: 'Neelima', type: 'Portrait Photography, Chicago', quote: 'We had a wonderful experience! Jagadesh made us feel very comfortable throughout the photoshoot, which made everything feel natural and easy. The pictures turned out beautifully, especially the night shots—they were absolutely stunning and captured the moment perfectly. We\'re really happy with the results and truly appreciate the effort and talent. Highly recommend!', photos: ['https://images.pixieset.com/995091711/3f6cce80ea57dc49c039dc49076c6db0-xxlarge.jpg', 'https://images.pixieset.com/995091711/38b395695f3ac438de04a4de7d30faee-xxlarge.jpg', 'https://images.pixieset.com/995091711/d4702af7f6a76a56f550daa2ca778234-xxlarge.jpg', 'https://images.pixieset.com/995091711/826b8b46d11b9f80df34d1ab06696d3d-xxlarge.jpg'] },
  { author: 'Northpoint Shockwaves', type: 'Swim Team Photography, Tomball', quote: 'Thank you for all the awesome pictures you\'ve taken this season, Jag. We have so many fun memories to look back on and share with our Shockwaves family. We truly appreciate all the time and effort you put into capturing these special moments!', photos: ['https://images.pixieset.com/482966511/4daf9eb1f074dfb1546317806311e460-xxlarge.jpg', 'https://images.pixieset.com/482966511/a40a5e5be664a4f815698d0a4698b0d1-xxlarge.jpg', 'https://images.pixieset.com/482966511/33cb8b859fd373b62c66894121a28d1e-xxlarge.jpg', 'https://images.pixieset.com/482966511/302dd4c2aec6af911ee978a5bfba2dda-xxlarge.jpg'] },
  { author: 'Alishba Hamid', type: 'Cake Smash & Birthday Photography, Houston', quote: 'Such a great experience working with JG moments. The photographer was super nice and got me exactly what I asked for and the pictures turned out perfect! I definitely recommend! Thank you! ❤️', photos: ['https://images.pixieset.com/962486611/524949cf8e0aa024297b4378827ed72d-xxlarge.jpg', 'https://images.pixieset.com/962486611/71fbcb51b2f65564fae0e21bfd889313-xxlarge.jpg', 'https://images.pixieset.com/962486611/95d26b0c6331e5838fb1c8f8a2e8abda-xxlarge.jpg', 'https://images.pixieset.com/962486611/c0408b300e006d4e5801ffd6a8b3ec0d-xxlarge.jpg'] },
  { author: 'Hamdi Gomma', type: 'Nikkah Ceremony Photography, Katy', quote: 'Great experience! Wonderful photographer. Jag captured the best moments of our small, private ceremony beautifully. We highly recommend him to anyone looking for someone who goes beyond the ordinary and delivers a stunning, memorable collection of photographs.', photos: ['https://images.pixieset.com/334693511/a71e1eac27e41f7cdc0923c928c6afa9-xxlarge.jpg', 'https://images.pixieset.com/334693511/bd8b2adb317a0e562aa3ff116a576d66-xxlarge.jpg', 'https://images.pixieset.com/334693511/48020eb9a9ae9d17b69822b2a1a662ae-xxlarge.jpg', 'https://images.pixieset.com/334693511/7958f297c1c252e6c58774c5551dee19-xxlarge.jpg'] },
  { author: 'Lorain Pinto', type: 'Family Photography, Tomball', quote: 'Absolutely stunning photography — every shot captured the emotion perfectly. The attention to detail and lighting was incredible. Professional, creative, and easy to work with. Every photo tells a story. Thank you for capturing such genuine smiles and emotions. Pure magic behind the camera💫', photos: ['https://images.pixieset.com/219766511/dc197ef1746ce335175833fb943225a0-xxlarge.jpg', 'https://images.pixieset.com/219766511/e25c699e165a3fff4902aae382b2d4f1-xxlarge.jpg', 'https://images.pixieset.com/219766511/c775c6950076ebd40862a3f99bded2da-xxlarge.jpg'] },
  { author: 'Venkatesh M', type: 'Family & Cultural Events Photography, Tomball', quote: 'Awesome photography. Pictures are crisp and clear. Excellent capture of those beautiful smiles and moments to recall memories over period of time. Keep it up buddy. Highly recommended for his photography for any events.' },
  { author: 'Meenakshi Anurag', type: 'Candid Photography', quote: 'Jagdeesh has a remarkable eye for light and composition. His candid shots are especially outstanding—he has a true fly-on-the-wall ability to capture genuine moments as they naturally unfold. What sets him apart is his patience and calm presence, which puts people at ease. Ultimately, his work speaks for itself.' },
  { author: 'Michael Repking', type: 'Proposal Photography, Kingwood', quote: 'Awesome thank you so much, they look amazing!', photos: ['https://images.pixieset.com/721365511/ec5bedf0ff43b4778c5036f70b03ff33-xxlarge.jpg', 'https://images.pixieset.com/721365511/62b6ffb34a26684bac15dc87196e1507-xxlarge.jpg', 'https://images.pixieset.com/721365511/34286236c20e8819779971f1022907ca-xxlarge.jpg'] },
  { author: 'Shelbie', type: 'Audition Photography', quote: 'He was so nice and did such a great job! Not only did he make the experience fun, he made it comfortable. He did exactly what I needed and more — everything came out perfect and exactly how I wanted it. I\'m so glad I worked with him and I will again, no doubt!', photos: ['https://images.pixieset.com/498708511/f2cf6d5019776fa9e47918799a869dab-xxlarge.jpg', 'https://images.pixieset.com/498708511/25f9d05a33e7469c99fa140452edb177-xxlarge.jpg', 'https://images.pixieset.com/498708511/7c57b220f59b0d58fa072a1705282236-xxlarge.jpg'] },
  { author: 'Sudhir', type: 'Family Photography, Cypress', quote: 'Amazing photographs.. he knows what he is doing and captures those moments beautifully. Highly recommend.' },
  { author: 'Amber Smith', type: 'Family Photography', quote: 'Jag was wonderful! He helped with the poses and was very quick in getting the photos back to us. We loved the different lighting and edits in the photos so they don\'t all look the same! Thank you Jag!!', photos: ['https://images.pixieset.com/937963611/53b4d95881c59b0bc7ea583bf5a9a198-xxlarge.jpg', 'https://images.pixieset.com/937963611/7d2f341069810bfc46665bf704dc2f75-xxlarge.jpg', 'https://images.pixieset.com/937963611/f04bb6fd03630d82bf94636d61f70c9d-xxlarge.jpg', 'https://images.pixieset.com/937963611/7648d2908d8c432d7d15d9324d727d4d-xxlarge.jpg'] },
  { author: 'Ayman Resheidat', type: 'Portrait Photography, Houston', quote: 'Had a session and I love the pictures. Jag is a nice man, knows his stuff, was there on time, was patient and took his time!', photos: ['https://images.pixieset.com/209477611/0879d4ff2a38db6df728adb90926cb6d-xxlarge.jpg', 'https://images.pixieset.com/209477611/abbc249d43a539b432f772a41abd5e03-xxlarge.jpg', 'https://images.pixieset.com/209477611/0f8dc8418252f53d84615b5884e8eb14-xxlarge.jpg'] },
  { author: 'Anita Kundaje', type: 'Swim Meet Photography', quote: 'Jag photographed my daughter\'s swim meet and I was honestly blown away. Every shot tells a story and captures emotions so beautifully. He caught moments I didn\'t even know were happening — the focus, the effort, the pure joy on the kids\' faces. The photos don\'t just look great, they feel alive. He has such a natural talent for freezing those moments you\'ll treasure forever. Absolutely recommend!' },
  { author: 'Venkat Reddy', type: 'Kids Ceremony Photography', quote: 'We had a wonderful experience during our kids ceremony. Jagadeesh was punctual, professional, patient, and very supportive throughout the event. He suggested great poses and took the time to capture every moment perfectly. His work was excellent, and the edited photos were delivered within just a few days. He is versatile and has very good skills at multiple types of photography. Highly recommended for anyone looking for quality photography and exceptional service!', photos: ['https://images.pixieset.com/219766511/26a09123383f6045db7332d944410b58-xxlarge.jpg', 'https://images.pixieset.com/219766511/57ab32fdd272324d8c4e459c5c9f1941-xxlarge.jpg'] },
  { author: 'Mamatha R', type: 'Family & Cultural Events Photography, Tomball', quote: 'I\'ve had the pleasure of knowing him as a friend, and I can honestly say his talent behind the camera is incredible. He has a unique ability to capture genuine emotions and turn ordinary moments into beautiful memories. His professionalism, creativity, and attention to detail make every photo special. Not only is he an amazing photographer, but he\'s also wonderful to work with. I highly recommend him to anyone looking for stunning, high-quality photography.' },
  { author: 'James Maxwell', type: 'Soccer Photography', quote: 'Pictures came out great and received them shortly after the shoot.' },
  { author: 'Extra Time Soccer Training', type: 'Soccer Photography, Missouri City', quote: 'They came out great thank you!!' },
  { author: 'Kam Edwards', type: 'Surprise Proposal, Buffalo Bayou Park', quote: 'They\'re Amazing!' },
  { author: 'Shobhit Shah', type: 'Family Photography', quote: 'Amazing Photography as family had lots of photos taken at many different functions and all were exceptional.' },
  { author: 'Stavrula Carataidis', type: 'Graduation Party', quote: 'They were lovely thank you', photos: ['https://images.pixieset.com/379006511/aa211092a15bc5758114083a50783eb2-xxlarge.jpg', 'https://images.pixieset.com/379006511/941fcfb44b2f1a2111820428847e4cca-xxlarge.jpg', 'https://images.pixieset.com/379006511/15bf1647c1856ec68eed156941ec38a4-xxlarge.jpg'] },
  { author: 'Mayur Shah', type: 'Family Event Photography', quote: 'Jagdish is very professional photographer and always positive. We had our family photos for the couple event and it was awesome. He always pours excellent ideas.' },
  { author: 'Priyank Chouksey', type: 'Family Photography, Cypress', quote: 'We had an amazing experience working with Jagdeesh from the very beginning, the communication was professional, friendly and responsive. He took time to understand exactly what we were looking for and made the entire process feel comfortable and enjoyable. The quality of pictures exceeded my expectations. Every image was beautifully captured, with great attentions to detail and a natural authentic style. The final gallery was delivered professionally and perfectly organized. What impressed me most was his ability to make everyone feel relaxed in front of the camera while still capturing genuine emotions and candid moments. You can tell he is passionate about craft and genuinely care about clients. I highly recommend him to anyone looking for a talented, reliable, and creative photographer. I will definitely be using his services again in the future.' },
  { author: 'Damone Johnson', type: 'Kids Graduation Photography, Pearland', quote: 'Really good photo quality. Works really well with children. Super nice and professional. Turn around time on receiving finished photos was within a few days. Highly recommend, and we\'ll use his service again.', photos: ['https://images.pixieset.com/272684711/a1af6dba3fc0dbafb078d5f3d75ff8b9-xxlarge.jpg', 'https://images.pixieset.com/272684711/990b3169bdcc43f22eeeeebee0c09970-xxlarge.jpg', 'https://images.pixieset.com/272684711/e76f74818a5f9133e19d18fba535f4a3-xxlarge.jpg', 'https://images.pixieset.com/272684711/76dea6cf093eaf949a0f9e2b03e0c8f8-xxlarge.jpg'] },
  { author: 'Mahesh Kumar', type: 'Family Photography', quote: 'An exceptional photographer with years of experience in capturing life\'s most beautiful moments. His passion for photography truly reflects in every picture he takes. Each captured moment speaks a million words and becomes a priceless memory to cherish forever. I would never hesitate to seek his help whenever we want to preserve special memories in the most meaningful way!', photos: ['https://images.pixieset.com/419486511/d86daafe5a2228cbdca9e6fe936be9f9-xxlarge.jpg'] },
  { author: 'Danielle Combs', type: '16th Birthday Photography, Houston', quote: 'Joyful & Graceful Moments is amazing! The owner was very professional, incredibly talented, and made the entire process easy from start to finish. We absolutely love my daughter\'s sweet 16 photos and highly recommend him to anyone', photos: ['https://images.pixieset.com/096735711/a7bffd1a6ecd2b61c89feaf4a7a3f8bc-xxlarge.jpg', 'https://images.pixieset.com/096735711/f7808e2acaa351c1b5c0b3b27fd1ce32-xxlarge.jpg', 'https://images.pixieset.com/096735711/10ec27475668242fe19267f2db5f2e00-xxlarge.jpg', 'https://images.pixieset.com/096735711/e3c104b96a5a7d33da1c11cbe4d35e69-xxlarge.jpg'] },
  { author: 'Maudie Byrd', type: 'Birthday Party Photography, Galveston', quote: 'Pictures took place at my home for very special birthday party. Photographer was nice, professional and did a wonderful job catching the party spirit. I would highly recommend for any important event.', photos: ['https://images.pixieset.com/114307711/88d20c3430f25f099d713053aa23cf0f-xxlarge.jpg', 'https://images.pixieset.com/114307711/2f42d6816e6b931ed4ded2179a58dd91-xxlarge.jpg', 'https://images.pixieset.com/114307711/4fe240356977a4cdabb98a6cab668f48-xxlarge.jpg', 'https://images.pixieset.com/114307711/df1f0db1d10a92f40494b02d0666d65a-xxlarge.jpg'] },
  { author: 'Nicole Thomas', type: 'Family Photography, Galveston Island', quote: 'On vacation in galveston, my family and I had professional photos done on the beach. Our photographer Jag. (Joyful and grateful moments) was absolutely amazing. Considering we were a group of 19 people. 10 of them kids (2 under 2 and 1 autistic). Jack Was extremely patient and made sure he captured everyone laughing. He allowed us to play around with some direction while he shot us. Absolutely, 10 out of 10 experience. And the photos were amazing!! THANK YOU!!!!', photos: ['https://images.pixieset.com/941437711/ea0b6c210620a0a4a8da5d3360bb7e05-xxlarge.jpg', 'https://images.pixieset.com/941437711/5dc206e189def86743ef5098b2d0b3c3-xxlarge.jpg', 'https://images.pixieset.com/941437711/22f8176bd8352a1c6e9ca7794d951054-xxlarge.jpg', 'https://images.pixieset.com/941437711/80c374ec2a4c7a62aa062675406579d5-xxlarge.jpg'] }
];

let carouselPos = 0;
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let autoScrollInterval;

console.log('Carousel track found:', !!track);
console.log('Testimonials count:', testimonials.length);

function renderCarousel() {
  console.log('renderCarousel called');
  if (!track) {
    console.error('Track element not found!');
    return;
  }
  track.innerHTML = '';
  console.log('Rendering', testimonials.length, 'testimonials');
  testimonials.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    let photosHTML = '';
    if (t.photos && t.photos.length > 0) {
      const photoClass = t.photos.length === 2 ? 'three-photos' : '';
      photosHTML = `<div class="photo-strip ${photoClass}">`;
      t.photos.forEach(photo => {
        photosHTML += `<div class="photo-thumb"><img src="${photo}" alt="${t.author} session" loading="lazy"/></div>`;
      });
      photosHTML += `</div>`;
    }
    card.innerHTML = `
      <div class="testimonial-header">
        <div>
          <p class="testimonial-author">${t.author}</p>
          <p class="testimonial-type">${t.type}</p>
        </div>
      </div>
      <div class="stars"><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span></div>
      <p class="testimonial-quote">"${t.quote}"</p>
      ${photosHTML}
    `;
    track.appendChild(card);
  });
  console.log('Rendered', track.children.length, 'cards');
}

function updateCarouselPosition() {
  if (!track) return;
  const itemsToShow = window.innerWidth <= 800 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
  const itemWidth = 100 / itemsToShow;
  const offset = -(carouselPos * itemWidth);
  track.style.transform = `translateX(${offset}%)`;
}

function scrollCarousel(direction) {
  const itemsToShow = window.innerWidth <= 800 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
  const maxPos = Math.max(0, testimonials.length - itemsToShow);
  carouselPos += direction * itemsToShow;  // Advance by itemsToShow positions
  if (carouselPos > maxPos) carouselPos = 0;
  if (carouselPos < 0) carouselPos = maxPos;
  updateCarouselPosition();
  resetAutoScroll();
}

function autoScroll() {
  scrollCarousel(1);
}

function startAutoScroll() {
  autoScrollInterval = setInterval(autoScroll, 5000);
}

function resetAutoScroll() {
  clearInterval(autoScrollInterval);
  startAutoScroll();
}

if (track) {
  renderCarousel();
  updateCarouselPosition();
  startAutoScroll();

  if (prevBtn) prevBtn.addEventListener('click', () => scrollCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollCarousel(1));

  track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
  track.addEventListener('mouseleave', startAutoScroll);

  let touchStart = 0;
  track.addEventListener('touchstart', e => touchStart = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) scrollCarousel(1);
    if (touchEnd - touchStart > 50) scrollCarousel(-1);
  });

  window.addEventListener('resize', updateCarouselPosition);
}
