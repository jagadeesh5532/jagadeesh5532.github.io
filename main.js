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
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
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
if (lbPrev)  lbPrev.addEventListener('click',  () => lbNavigate(-1));
if (lbNext)  lbNext.addEventListener('click',  () => lbNavigate(1));
if (lightbox) {
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbNavigate(-1);
    if (e.key === 'ArrowRight')  lbNavigate(1);
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

// ===== FORMSPREE AJAX SUBMIT (JSON method — most reliable) =====
document.querySelectorAll('.ajax-form').forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn     = form.querySelector('[type=submit]');
    const succMsg = form.querySelector('.success-msg');
    const origTxt = btn.textContent;

    // Collect form fields into a plain object (works with all inputs, selects, textareas)
    const payload = {};
    new FormData(form).forEach((val, key) => { payload[key] = val; });

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload)
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

// ===== DYNAMIC ALBUM GALLERY (auto-loads from images/[folder]/) =====
async function loadDynamicAlbum() {
  const gallery = document.getElementById('dynamicGallery');
  if (!gallery) return;
  const folder = gallery.dataset.folder;
  if (!folder) return;
  const comingSoon = document.getElementById('albumComingSoon');

  // Probe 01.jpg through 60.jpg in parallel — checks .jpg, .jpeg, .png, .webp
  const exts = ['jpg','jpeg','png','webp'];
  const probes = [];
  for (let i = 1; i <= 60; i++) {
    const num = String(i).padStart(2, '0');
    probes.push(new Promise(resolve => {
      let tried = 0;
      function tryExt(ei) {
        if (ei >= exts.length) return resolve(null);
        const src = `images/${folder}/${num}.${exts[ei]}`;
        const img = new Image();
        img.onload  = () => resolve({ src, num });
        img.onerror = () => tryExt(ei + 1);
        img.src = src;
      }
      tryExt(0);
    }));
  }

  const results = await Promise.all(probes);
  const found = results.filter(Boolean).sort((a,b) => +a.num - +b.num);

  if (found.length === 0) {
    if (comingSoon) comingSoon.style.display = 'block';
    return;
  }
  if (comingSoon) comingSoon.style.display = 'none';

  const srcs = found.map(f => f.src);
  found.forEach(({ src }, i) => {
    const div = document.createElement('div');
    div.className = 'album-photo fade-up';
    div.innerHTML = `<img src="${src}" alt="Photo" loading="lazy"/><div class="album-photo-icon"><span>+</span></div>`;
    div.addEventListener('click', () => openLightbox(srcs, i));
    gallery.appendChild(div);
  });

  // Trigger fade-up observer on new elements
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  gallery.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}
loadDynamicAlbum();
