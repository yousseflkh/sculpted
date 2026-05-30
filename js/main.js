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

  // Skip animation when arriving via a hash link (e.g. #shop from another page)
  if (window.location.hash) {
    screen.remove();
    return;
  }

  // SCULPTED rises in over 0.65s, fades out at 0.9s → gone by 1.5s total
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 600);
  }, 900);
})();

/* ===== HERO SCROLL FADE ===== */
(function () {
  const hero = document.querySelector('.hero');
  const fade = document.querySelector('.hero-scroll-fade');
  if (!hero || !fade) return;

  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / (hero.offsetHeight * 0.75), 1);
    fade.style.opacity = progress;
  }, { passive: true });
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

  setInterval(() => go(current + 1), 7000);
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

/* ===== CONTACT FORM ===== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ---- Phone auto-format: (902) 210-6502 ---- */
  const phoneInput = form.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
      let formatted = '';
      if (digits.length === 0) {
        formatted = '';
      } else if (digits.length < 4) {
        formatted = '(' + digits;
      } else if (digits.length < 7) {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
      } else {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
      }
      e.target.value = formatted;
    });

    /* allow paste of formatted/unformatted */
    phoneInput.addEventListener('blur', (e) => {
      const digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 0 && digits.length !== 10) {
        e.target.setCustomValidity('Please enter a valid 10-digit phone number');
      } else {
        e.target.setCustomValidity('');
      }
    });
  }

  /* ---- Helpers ---- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, message) {
    field.style.borderColor = '#C84F4F';
    field.setCustomValidity(message || ' ');
  }
  function clearFieldError(field) {
    field.style.borderColor = '';
    field.setCustomValidity('');
  }

  /* clear error styling on input */
  form.querySelectorAll('input, select, textarea').forEach((f) => {
    f.addEventListener('input', () => clearFieldError(f));
    f.addEventListener('change', () => clearFieldError(f));
  });

  /* ---- Submit handler ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const originalText = btn.textContent;

    /* Validate */
    let firstInvalid = null;

    const first = form.querySelector('#firstName');
    const last  = form.querySelector('#lastName');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const service = form.querySelector('#service');

    if (!first.value.trim()) { setFieldError(first, 'Required'); firstInvalid = firstInvalid || first; }
    if (!last.value.trim())  { setFieldError(last, 'Required');  firstInvalid = firstInvalid || last; }

    if (!emailRegex.test(email.value.trim())) {
      setFieldError(email, 'Enter a valid email address');
      firstInvalid = firstInvalid || email;
    }

    if (phone.value.trim()) {
      const digits = phone.value.replace(/\D/g, '');
      if (digits.length !== 10) {
        setFieldError(phone, 'Enter a 10-digit phone number');
        firstInvalid = firstInvalid || phone;
      }
    }

    if (!service.value) {
      setFieldError(service, 'Select a service');
      firstInvalid = firstInvalid || service;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    /* Submit — wired to Web3Forms */
    const ACCESS_KEY = '3880038f-6927-4d6f-a83e-10d39780782d';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* Honeypot — bots check this, humans don't */
    const botcheck = form.querySelector('[name="botcheck"]');
    if (botcheck && botcheck.checked) {
      /* silent fail — pretend success to the bot */
      btn.textContent = 'Message Sent!';
      setTimeout(() => { form.reset(); btn.textContent = originalText; btn.disabled = false; }, 2000);
      return;
    }

    /* Build the polished email body */
    const fullName = `${first.value.trim()} ${last.value.trim()}`;
    const messageText = (form.querySelector('#message').value || '').trim() || '(No message provided)';
    const phoneDisplay = phone.value.trim() || '(Not provided)';
    const serviceText = service.options[service.selectedIndex].text;

    const now = new Date();
    const dateOpts = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Halifax' };
    const timeOpts = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Halifax', timeZoneName: 'short' };
    const dateStr = now.toLocaleDateString('en-CA', dateOpts);
    const timeStr = now.toLocaleTimeString('en-US', timeOpts);

    const emailBody = [
      '◆ ─────────────────────────── ◆',
      '       NEW CLIENT INQUIRY',
      '◆ ─────────────────────────── ◆',
      '',
      '',
      `  ${fullName.toUpperCase()}`,
      '',
      `  ${email.value.trim()}`,
      `  ${phoneDisplay}`,
      '',
      `  Received  ·  ${dateStr}  ·  ${timeStr}`,
      '',
      '',
      '  ◇  SERVICE OF INTEREST',
      '',
      `      ${serviceText}`,
      '',
      '',
      '  ◇  MESSAGE',
      '',
      ...messageText.split('\n').map((l) => `      ${l}`),
      '',
      '',
      '  ─────────────────────────────────',
      '',
      '  Reply directly to this email to',
      `  respond to ${first.value.trim()}.`,
      '',
      '  sculptedmedicalaesthetics.com',
      '',
      '  ─────────────────────────────────'
    ].join('\n');

    /* Smart subject: New Inquiry · Service · Name */
    const subject = `New Inquiry  ·  ${serviceText}  ·  ${fullName}`;

    try {
      const payload = new FormData();
      payload.append('access_key', ACCESS_KEY);
      payload.append('subject', subject);
      payload.append('from_name', 'Sculpted Medical Aesthetics');
      payload.append('replyto', email.value.trim());
      payload.append('Message', emailBody);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed');

      btn.textContent = 'Message Sent!';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--gold)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    } catch (err) {
      console.error(err);
      btn.textContent = 'Try Again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  });
})();
