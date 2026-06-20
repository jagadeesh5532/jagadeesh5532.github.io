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
  { author: 'Jessica Smith', type: 'Engagement Photography, Humble', quote: 'We could not be happier with our engagement photo experience! From the moment he arrived, we knew we were in great hands. He came prepared with a wagon stocked with bottled water, a fan, and even a pop-up changing tent, which made outfit changes so much easier and more comfortable in the Texas heat. He was incredibly kind, professional, and accommodating throughout the entire session. He happily incorporated specific poses and shots that I had requested, and even rolled with additional props and ideas we came up with on the spot. Nothing felt rushed, and he truly wanted to make sure we got the photos we envisioned. What impressed us even more was the turnaround time, our photos were beautifully edited and delivered in just three days! Not only did we receive them quickly, but there was also a wonderful variety of images, each one capturing genuine moments and emotions. The photos are absolutely beautiful and perfectly reflect the love, joy, and connection between us. These are memories we will cherish for the rest of our lives, and we are so grateful for the care and talent he brought to our engagement session. We highly recommend him to anyone looking for a photographer who is talented, thoughtful, prepared, and truly passionate about what he does.' },
  { author: 'Dominque Joshua', type: 'Wedding Photography, Spring', quote: 'After receiving our initial wedding photos back, we realized I didn\'t get 1 photo by myself in my wedding gown nor too many of us by ourselves.. so we scheduled a photoshoot! The photographer came to our home & was amazing! This was so fun & intimate! It was wild having to get back into these wedding clothes 3 weeks later because so many emotions from that day came back, but it was so worth it! Thank you to @jg_moments for making this happen for us! We appreciate you!' },
  { author: 'Afreen Pargaonkar', type: 'Family Photography, Tomball', quote: 'Jagdeesh is a fantastic photographer. He truly loves the process of photography and capturing your precious moments the way you want him to along with adding his own cinematic style to it. He is so patient and understanding especially when it comes to photography with kids. He has photographed us for many of our special moments and we will ask him to do so for many many more of our special occasions and moments.' },
  { author: 'Shari Block', type: 'Portrait Photography, Spring', quote: 'Love the photos!!! Jag was very nice and I felt comfortable meeting him and during the shoot. And he even had a small tent where I could change and this was an outdoor shoot. I\'ve already recommended him in a Facebook post.' },
  { author: 'Rashmi SA', type: 'Family Photography, Tomball', quote: 'A truly dedicated photographer who captures every moment perfectly. What impressed me the most was the passion, patience, and commitment shown throughout the entire shoot. No detail was overlooked, and every frame reflected genuine effort and creativity. Their ability to make everyone feel comfortable while tirelessly working to get the perfect shot. Thank you for your hard work, professionalism, and dedication to creating memories that will be cherished forever. Highly recommended!' },
  { author: 'Creshelle Smith', type: 'Family Photography, Pearland', quote: 'Absolutely loved our photos. Jag was professional and so accommodating; he worked great with our busy toddlers. We received our pictures faster than I\'ve ever experienced. Will absolutely use Joyful & Graceful Moments for our future sessions.' },
  { author: 'Krishna Lanka', type: 'Family & Cultural Events Photography, Tomball', quote: 'We had multiple photo shoots done with them and every single photo came out really really good. The service provided is outstanding. They really put a lot of thought and effort to understand what you need and make suggestions to make your perfect moments memorable. And they do this with a smile on their face. I would very strongly recommend them for your events!' },
  { author: 'Neelima', type: 'Portrait Photography, Chicago', quote: 'We had a wonderful experience! Jagadesh made us feel very comfortable throughout the photoshoot, which made everything feel natural and easy. The pictures turned out beautifully, especially the night shots—they were absolutely stunning and captured the moment perfectly. We\'re really happy with the results and truly appreciate the effort and talent. Highly recommend!' },
  { author: 'Northpoint Shockwaves', type: 'Swim Team Photography, Tomball', quote: 'Thank you for all the awesome pictures you\'ve taken this season, Jag. We have so many fun memories to look back on and share with our Shockwaves family. We truly appreciate all the time and effort you put into capturing these special moments!' },
  { author: 'Alishba Hamid', type: 'Cake Smash & Birthday Photography, Houston', quote: 'Such a great experience working with JG moments. The photographer was super nice and got me exactly what I asked for and the pictures turned out perfect! I definitely recommend! Thank you! ❤️' },
  { author: 'Hamdi Gomma', type: 'Nikkah Ceremony Photography, Katy', quote: 'Great experience! Wonderful photographer. Jag captured the best moments of our small, private ceremony beautifully. We highly recommend him to anyone looking for someone who goes beyond the ordinary and delivers a stunning, memorable collection of photographs.' },
  { author: 'Lorain Pinto', type: 'Family Photography, Tomball', quote: 'Absolutely stunning photography — every shot captured the emotion perfectly. The attention to detail and lighting was incredible. Professional, creative, and easy to work with. Every photo tells a story. Thank you for capturing such genuine smiles and emotions. Pure magic behind the camera💫' },
  { author: 'Venkatesh M', type: 'Family & Cultural Events Photography, Tomball', quote: 'Awesome photography. Pictures are crisp and clear. Excellent capture of those beautiful smiles and moments to recall memories over period of time. Keep it up buddy. Highly recommended for his photography for any events.' },
  { author: 'Meenakshi Anurag', type: 'Candid Photography', quote: 'Jagdeesh has a remarkable eye for light and composition. His candid shots are especially outstanding—he has a true fly-on-the-wall ability to capture genuine moments as they naturally unfold. What sets him apart is his patience and calm presence, which puts people at ease. Ultimately, his work speaks for itself.' },
  { author: 'Michael Repking', type: 'Proposal Photography, Kingwood', quote: 'Awesome thank you so much, they look amazing!' },
  { author: 'Shelbie', type: 'Audition Photography', quote: 'He was so nice and did such a great job! Not only did he make the experience fun, he made it comfortable. He did exactly what I needed and more — everything came out perfect and exactly how I wanted it. I\'m so glad I worked with him and I will again, no doubt!' },
  { author: 'Sudhir', type: 'Family Photography, Cypress', quote: 'Amazing photographs.. he knows what he is doing and captures those moments beautifully. Highly recommend.' },
  { author: 'Amber Smith', type: 'Family Photography', quote: 'Jag was wonderful! He helped with the poses and was very quick in getting the photos back to us. We loved the different lighting and edits in the photos so they don\'t all look the same! Thank you Jag!!' },
  { author: 'Ayman Resheidat', type: 'Portrait Photography, Houston', quote: 'Had a session and I love the pictures. Jag is a nice man, knows his stuff, was there on time, was patient and took his time!' },
  { author: 'Sarah & Raj', type: 'Wedding & Candid Photography', quote: 'Jag has an amazing eye for candid moments. He made everyone feel so comfortable — the photos look natural and genuine. Truly gifted!' },
  { author: 'Jenny', type: 'Swim Event Photography', quote: 'The swim meet photos were incredible! He captured every splash, every turn, every moment of triumph. Our daughter was absolutely thrilled!' },
  { author: 'Anita Kundaje', type: 'Swim Meet Photography', quote: 'Jag photographed my daughter\'s swim meet and I was honestly blown away. Every shot tells a story and captures emotions so beautifully. He caught moments I didn\'t even know were happening — the focus, the effort, the pure joy on the kids\' faces. The photos don\'t just look great, they feel alive. He has such a natural talent for freezing those moments you\'ll treasure forever. Absolutely recommend!' },
  { author: 'Venkat Reddy', type: 'Kids Ceremony Photography', quote: 'We had a wonderful experience during our kids ceremony. Jagadeesh was punctual, professional, patient, and very supportive throughout the event. He suggested great poses and took the time to capture every moment perfectly. His work was excellent, and the edited photos were delivered within just a few days. He is versatile and has very good skills at multiple types of photography. Highly recommended for anyone looking for quality photography and exceptional service!' },
  { author: 'Mamatha R', type: 'Family & Cultural Events Photography, Tomball', quote: 'I\'ve had the pleasure of knowing him as a friend, and I can honestly say his talent behind the camera is incredible. He has a unique ability to capture genuine emotions and turn ordinary moments into beautiful memories. His professionalism, creativity, and attention to detail make every photo special. Not only is he an amazing photographer, but he\'s also wonderful to work with. I highly recommend him to anyone looking for stunning, high-quality photography.' },
  { author: 'Samantha', type: 'Portrait Session', quote: 'Jag captured our family portraits beautifully — every shot felt authentic and full of warmth. We absolutely love how they turned out!' },
  { author: 'Manisha', type: 'Festival Photography', quote: 'Our Holi event photos are absolutely stunning — the colors, the joy, the energy. Jag captured the essence of the festival perfectly!' },
  { author: 'Priya', type: 'Celebration Photography', quote: 'Our Diwali celebration was captured so colorfully and vibrantly. Every diya, every smile perfectly preserved. Highly recommend Jag!' },
  { author: 'James Maxwell', type: 'Soccer Photography', quote: 'Pictures came out great and received them shortly after the shoot.' },
  { author: 'Extra Time Soccer Training', type: 'Soccer Photography, Missouri City', quote: 'They came out great thank you!!' },
  { author: 'Kam Edwards', type: 'Surprise Proposal, Buffalo Bayou Park', quote: 'They\'re Amazing!' },
  { author: 'Shobhit Shah', type: 'Family Photography', quote: 'Amazing Photography as family had lots of photos taken at many different functions and all were exceptional.' },
  { author: 'Stavrula Carataidis', type: 'Graduation Party', quote: 'They were lovely thank you' },
  { author: 'Mayur Shah', type: 'Family Event Photography', quote: 'Jagdish is very professional photographer and always positive. We had our family photos for the couple event and it was awesome. He always pours excellent ideas.' },
  { author: 'Priyank Chouksey', type: 'Family Photography, Cypress', quote: 'We had an amazing experience working with Jagdeesh from the very beginning, the communication was professional, friendly and responsive. He took time to understand exactly what we were looking for and made the entire process feel comfortable and enjoyable. The quality of pictures exceeded my expectations. Every image was beautifully captured, with great attentions to detail and a natural authentic style. The final gallery was delivered professionally and perfectly organized. What impressed me most was his ability to make everyone feel relaxed in front of the camera while still capturing genuine emotions and candid moments. You can tell he is passionate about craft and genuinely care about clients. I highly recommend him to anyone looking for a talented, reliable, and creative photographer. I will definitely be using his services again in the future.' }
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
    card.innerHTML = `
      <div class="testimonial-header">
        <div>
          <p class="testimonial-author">${t.author}</p>
          <p class="testimonial-type">${t.type}</p>
        </div>
      </div>
      <div class="stars"><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span></div>
      <p class="testimonial-quote">"${t.quote}"</p>
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
  carouselPos += direction;
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
