const JOIN = {
  whatsapp: 'https://chat.whatsapp.com/GJlyic3xpArDcgKuA1RMoP',
  sheet: 'https://script.google.com/macros/s/AKfycbwkTwVBEt9hz6itOOIo3vhbefQ5145mxdWFZ9O2t5P4SxWCI0d7pupwDDXGDXBv1KP4EQ/exec',
};

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const burgerIcon = burger.querySelector('use');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  burgerIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') setMenu(false);
});

const galleryItems = document.querySelectorAll('.g-item');
if (galleryItems.length) {
  galleryItems.forEach((el, i) => {
    el.style.setProperty('--d', `${(i % 6) * 0.07}s`);
  });
  const show = (el) => el.classList.add('in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    galleryItems.forEach((el) => io.observe(el));
  } else {
    galleryItems.forEach(show);
  }
}

function kzPhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);
  return digits.length === 11 ? `+${digits}` : '';
}

const phoneInput = document.getElementById('join-phone');
phoneInput?.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length >= 10) digits = `7${digits.slice(1)}`;
  phoneInput.value = digits.slice(0, 11);
});

function saveJoin(payload) {
  if (!JOIN.sheet) return;
  fetch(JOIN.sheet, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    body: new URLSearchParams(payload),
  }).catch(() => {});
}

const joinForm = document.getElementById('join-form');
joinForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(joinForm));
  const payload = {
    date: new Date().toLocaleString('ru-KZ', { timeZone: 'Asia/Almaty' }),
    name: String(data.name || '').trim(),
    phone: kzPhone(data.phone),
    group: String(data.group || '').trim(),
    course: String(data.course || '').trim(),
    role: String(data.role || 'member'),
  };
  if (!payload.name || !payload.phone || !payload.group || !payload.course) return;

  const sendBtn = document.getElementById('join-send');
  if (sendBtn) sendBtn.disabled = true;

  saveJoin(payload);
  window.location.href = JOIN.whatsapp;
});
