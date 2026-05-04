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
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 100);
}

// FADE UP ON SCROLL
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => obs.observe(el));
}

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let lbImages = [];
let lbIndex = 0;

function openLightbox(imgs, idx) {
  lbImages = imgs;
  lbIndex = idx;
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
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
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
  photos.forEach((photo, i) => {
    photo.addEventListener('click', () => openLightbox(imgs, i));
  });
}
initAlbumGallery();

// MOSAIC LIGHTBOX (homepage)
function initMosaic() {
  const items = document.querySelectorAll('.mosaic-item');
  if (!items.length) return;
  const imgs = Array.from(items).map(m => m.querySelector('img').src);
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(imgs, i));
  });
}
initMosaic();

// PORTFOLIO FILTER (portfolio page)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.album-card-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
      });
    });
  });
}

// STAR RATING
const starPickers = document.querySelectorAll('.star-picker');
starPickers.forEach(picker => {
  const inputs = picker.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      const hidden = picker.closest('form').querySelector('input[name="rating"]');
      if (hidden) hidden.value = input.value;
    });
  });
});

// FORMSPREE AJAX SUBMIT
const ajaxForms = document.querySelectorAll('.ajax-form');
ajaxForms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const msg = form.querySelector('.success-msg');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        if (msg) { msg.style.display = 'block'; }
        btn.textContent = 'Sent!';
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
      } else {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    } catch(err) {
      btn.textContent = 'Error — try again';
      btn.disabled = false;
    }
  });
});
