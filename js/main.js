/* ============================================================
   SCULPTED MEDICAL AESTHETICS — main.js
   ============================================================ */

/* ===== HEADER: SCROLL HIDE / SHOW ===== */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > 80) {
        header.classList.add('scrolled');
        if (y > lastY + 4) {
          header.classList.add('hidden');
        } else if (y < lastY - 4) {
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('scrolled', 'hidden');
      }
      lastY = y;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ===== LOADING SCREEN — FADE + RISE ===== */
(function () {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  // SCULPTED rises in over 0.65s, fades out at 0.9s → gone by 1.5s total
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 600);
  }, 900);
})();

/* ===== BACK TO TOP ===== */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== MOBILE NAV ===== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn  = document.getElementById('mobileNavClose');
  if (!hamburger || !mobileNav) return;

  function openNav () {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav () {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? closeNav() : openNav());

  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
})();

/* ===== SCROLL-IN ANIMATIONS ===== */
(function () {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.14 });

  els.forEach(el => io.observe(el));
})();

/* ===== SERVICES CAROUSEL ===== */
(function () {
  const track    = document.getElementById('servicesTrack');
  const carousel = document.getElementById('servicesCarousel');
  const prevBtn  = document.getElementById('servicePrev');
  const nextBtn  = document.getElementById('serviceNext');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards        = track.querySelectorAll('.service-card');
  const visibleCount = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const totalSlides  = Math.ceil(cards.length / visibleCount);
  let current        = 0;

  /* build dots */
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  }

  function go(idx) {
    current = Math.max(0, Math.min(idx, totalSlides - 1));
    const pageW = carousel.offsetWidth + 24;
    track.style.transform = `translateX(-${current * pageW}px)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
})();

/* ===== TESTIMONIALS CAROUSEL ===== */
(function () {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;

  function go(idx) {
    current = ((idx % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));

  setInterval(() => go(current + 1), 5500);
})();

/* ===== STAT COUNTER ANIMATION ===== */
(function () {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function animateStat(el) {
    const original = el.textContent.trim();
    const num = parseInt(original.replace(/\D/g, ''), 10);
    const suffix = original.replace(/[0-9]/g, '');
    if (isNaN(num)) return;

    let startTime = null;
    const duration = 1600;

    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateStat(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(el => io.observe(el));
})();

/* ===== FOOTER FADE IN / OUT ===== */
(function () {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        footer.classList.add('footer-visible');
      } else {
        footer.classList.remove('footer-visible');
      }
    });
  }, { threshold: 0.05 });

  io.observe(footer);
})();

/* ===== ACTIVE NAV LINK ===== */
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkFile = (link.getAttribute('href') || '').split('/').pop();
    if (linkFile === current) link.classList.add('active');
  });
})();

/* ===== CONTACT FORM (prevent default, stub) ===== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Message Sent!';
    btn.style.background = 'transparent';
    btn.style.color = 'var(--gold)';
    setTimeout(() => {
      btn.textContent = 'SEND MESSAGE';
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3500);
  });
})();
