 // ===========================
// PRELOADER
// ===========================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('loaded'), 500);
});

// ===========================
// HEADER SCROLL STATE
// ===========================
const header = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  });
}

// ===========================
// CREATE ACCOUNT MODAL
// ===========================
const openCreateAccount = document.getElementById('openCreateAccount');
const createModal = document.getElementById('createAccountModal');
const closeCreateAccount = document.getElementById('closeCreateAccount');
const cancelCreate = document.getElementById('cancelCreate');
const createForm = document.getElementById('createAccountForm');
const createName = document.getElementById('createName');
const createEmail = document.getElementById('createEmail');
const createPassword = document.getElementById('createPassword');
const createConfirm = document.getElementById('createPasswordConfirm');
const createToggle = document.getElementById('createTogglePassword');
const createToggleConfirm = document.getElementById('createToggleConfirm');
const createNameError = document.getElementById('createNameError');
const createEmailError = document.getElementById('createEmailError');

function openModal() {
  if (!createModal) return;
  createModal.classList.add('open');
  createModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (createName) createName.focus();
}

function closeModal() {
  if (!createModal) return;
  createModal.classList.remove('open');
  createModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (openCreateAccount && createModal) {
  openCreateAccount.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
}

if (closeCreateAccount) closeCreateAccount.addEventListener('click', closeModal);
if (cancelCreate) cancelCreate.addEventListener('click', closeModal);

if (createModal) {
  createModal.addEventListener('click', (e) => {
    if (e.target === createModal) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && createModal && createModal.classList.contains('open')) {
    closeModal();
  }
});

if (createToggle && createPassword) {
  createToggle.addEventListener('click', () => {
    const isHidden = createPassword.type === 'password';
    createPassword.type = isHidden ? 'text' : 'password';
    createToggle.textContent = isHidden ? 'HIDE' : 'SHOW';
  });
}

if (createToggleConfirm && createConfirm) {
  createToggleConfirm.addEventListener('click', () => {
    const isHidden = createConfirm.type === 'password';
    createConfirm.type = isHidden ? 'text' : 'password';
    createToggleConfirm.textContent = isHidden ? 'HIDE' : 'SHOW';
  });
}

// Clear inline errors while typing
if (createName && createNameError) {
  createName.addEventListener('input', () => { createNameError.textContent = ''; });
}
if (createEmail && createEmailError) {
  createEmail.addEventListener('input', () => { createEmailError.textContent = ''; });
}

if (createForm) {
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous inline errors
    if (createNameError) createNameError.textContent = '';
    if (createEmailError) createEmailError.textContent = '';

    // Validate name (letters, spaces, hyphen, apostrophe)
    const nameVal = createName ? createName.value.trim() : '';
    const nameRe = /^[A-Za-z\s'\-]{2,60}$/;
    if (!nameVal || !nameRe.test(nameVal)) {
      if (createNameError) createNameError.textContent = "Please enter a valid name (letters, spaces, - or ').";
      if (createName) createName.focus();
      return;
    }

    // Validate email
    const emailVal = createEmail ? createEmail.value.trim() : '';
    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !simpleEmailRe.test(emailVal)) {
      if (createEmailError) createEmailError.textContent = 'Please enter a valid work email.';
      if (createEmail) createEmail.focus();
      return;
    }

    const pw = createPassword ? createPassword.value : '';
    const pwc = createConfirm ? createConfirm.value : '';
    if (pw.length < 8) {
      if (createPassword) {
        createPassword.setCustomValidity('Password must be at least 8 characters.');
        createPassword.reportValidity();
        createPassword.setCustomValidity('');
      }
      return;
    }

    if (pw !== pwc) {
      if (createConfirm) {
        createConfirm.setCustomValidity('Passwords do not match.');
        createConfirm.reportValidity();
        createConfirm.setCustomValidity('');
      }
      return;
    }

    // Demo success — in a real app, send to server
    if (createForm) createForm.reset();
    closeModal();
    alert('Access request submitted. We will review and contact you.');
  });
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===========================
// MOBILE NAV
// ===========================
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });
}

// ===========================
// ACTIVE NAV ON SCROLL
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const currentPath = window.location.pathname.split('/').pop().toLowerCase();
  const currentSection = sections.length ? Array.from(sections).find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 120 && rect.bottom >= 120;
  }) : null;

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefPath = href.split('#')[0].split('?')[0].toLowerCase();
    const isSectionMatch = currentSection && href === '#' + currentSection.id;
    const isPageMatch = hrefPath === currentPath || (hrefPath === '' && currentPath === 'index.html');
    link.classList.toggle('active', isSectionMatch || isPageMatch);
  });
}

if (header) {
  updateActiveNav();
}

// ===========================
// SCROLL REVEAL ANIMATIONS
// ===========================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ===========================
// COUNTER ANIMATION
// ===========================
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

// ===========================
// ACCORDION
// ===========================
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
  const head = item.querySelector('.accordion-head');
  head.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    accordionItems.forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ===========================
// TESTIMONIAL SLIDER
// ===========================
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const slides = track ? track.children.length : 0;
let currentSlide = 0;
let sliderInterval;

if (track) {
  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides;
    goToSlide(currentSlide);
  }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
  }
  startSlider();

  track.parentElement.addEventListener('mouseenter', () => clearInterval(sliderInterval));
  track.parentElement.addEventListener('mouseleave', startSlider);
}

// ===========================
// CONTACT FORM (demo only) — validate name + email
// ===========================
const ctaForm = document.getElementById('ctaForm');
const formSuccess = document.getElementById('formSuccess');
const contactName = document.getElementById('contactName');
const contactEmail = document.getElementById('contactEmail');
const contactNameError = document.getElementById('contactNameError');
const contactEmailError = document.getElementById('contactEmailError');

if (contactName && contactNameError) {
  contactName.addEventListener('input', () => { contactNameError.textContent = ''; });
}
if (contactEmail && contactEmailError) {
  contactEmail.addEventListener('input', () => { contactEmailError.textContent = ''; });
}

if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (contactNameError) contactNameError.textContent = '';
    if (contactEmailError) contactEmailError.textContent = '';

    const nameVal = contactName ? contactName.value.trim() : '';
    const nameRe = /^[A-Za-z\s'\-]{2,60}$/;
    if (!nameVal || !nameRe.test(nameVal)) {
      if (contactNameError) contactNameError.textContent = "Please enter a valid name (letters, spaces, - or ').";
      if (contactName) contactName.focus();
      return;
    }

    const emailVal = contactEmail ? contactEmail.value.trim() : '';
    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !simpleEmailRe.test(emailVal)) {
      if (contactEmailError) contactEmailError.textContent = 'Please enter a valid work email.';
      if (contactEmail) contactEmail.focus();
      return;
    }

    // Demo success
    if (formSuccess) formSuccess.classList.add('show');
    ctaForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });
}

// ===========================
// MATRIX / CYBER RAIN CANVAS BACKGROUND
// ===========================
const canvas = document.getElementById('matrixCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;
  const chars = '01アイウエオカキクケコサシスセソ$#@%&'.split('');
  const fontSize = 14;

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function draw() {
    ctx.fillStyle = 'rgba(6,8,13,0.08)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00ff9d';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  let animFrame;
  function loop() {
    draw();
    animFrame = requestAnimationFrame(loop);
  }
  loop();

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(animFrame);
  }
}

// ===========================
// FOOTER LIVE CLOCK
// ===========================
const footerClock = document.getElementById('footerClock');
if (footerClock) {
  function updateClock() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    footerClock.textContent = `${hh}:${mm}:${ss} UTC`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ===========================
// NEWSLETTER FORM (demo only) — validate email
// ===========================
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterEmailError = document.getElementById('newsletterEmailError');

if (newsletterEmail && newsletterEmailError) {
  newsletterEmail.addEventListener('input', () => { newsletterEmailError.textContent = ''; });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (newsletterEmailError) newsletterEmailError.textContent = '';
    const emailVal = newsletterEmail ? newsletterEmail.value.trim() : '';
    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !simpleEmailRe.test(emailVal)) {
      if (newsletterEmailError) newsletterEmailError.textContent = 'Please enter a valid email to subscribe.';
      if (newsletterEmail) newsletterEmail.focus();
      return;
    }

    const btn = newsletterForm.querySelector('button');
    const label = btn.querySelector('span');
    const originalText = label.textContent;
    label.textContent = 'Submitted ✓';
    newsletterForm.reset();
    setTimeout(() => { label.textContent = originalText; }, 2500);
  });
}

// ===========================
// HERO: ROTATING TYPEWRITER WORD
// ===========================
const typewriterEl = document.getElementById('typewriterWord');
if (typewriterEl) {
  const words = ['Ransomware', 'Phishing', 'Zero-Day Exploits', 'DDoS Attacks', 'Insider Threats', 'Malware'];
  let wIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = words[wIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  typeLoop();
}

// ===========================
// HERO: MINI TERMINAL TYPING LINES
// ===========================
const heroTerminalLine = document.getElementById('heroTerminalLine');
if (heroTerminalLine) {
  const lines = [
    'scanning ports 1-65535...',
    'no vulnerabilities found',
    'checking SSL certificates...',
    'firewall rules: 248 active',
    'threat database updated'
  ];
  let lIndex = 0;

  function typeTerminalLine() {
    const line = lines[lIndex];
    let i = 0;
    heroTerminalLine.textContent = '';
    const typeInt = setInterval(() => {
      heroTerminalLine.textContent += line[i];
      i++;
      if (i === line.length) {
        clearInterval(typeInt);
        setTimeout(() => {
          lIndex = (lIndex + 1) % lines.length;
          typeTerminalLine();
        }, 1800);
      }
    }, 35);
  }
  typeTerminalLine();
}

// ===========================
// HERO: LIVE "THREATS BLOCKED" TICKER
// ===========================
const threatsLiveEl = document.getElementById('threatsBlockedLive');
if (threatsLiveEl) {
  let liveCount = 18230;
  threatsLiveEl.textContent = liveCount.toLocaleString();
  setInterval(() => {
    liveCount += Math.floor(Math.random() * 4) + 1;
    threatsLiveEl.textContent = liveCount.toLocaleString();
  }, 2200);
}

// ===========================
// HERO: MOUSE PARALLAX TILT
// ===========================
const heroVisual = document.getElementById('heroVisual');
if (heroVisual && window.matchMedia('(min-width: 901px)').matches) {
  const depthEls = heroVisual.querySelectorAll('[data-depth]');
  const frame = heroVisual.querySelector('.hero-image-frame');

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (frame) {
      frame.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    }
    depthEls.forEach(el => {
      const depth = parseFloat(el.getAttribute('data-depth')) || 20;
      el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    if (frame) frame.style.transform = 'rotateY(0) rotateX(0)';
    depthEls.forEach(el => { el.style.transform = 'translate(0,0)'; });
  });
}

// Initial nav state
updateActiveNav();

// ===========================
// LOGIN: email validation + password toggle
// ===========================
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const authStatusText = document.getElementById('authStatusText');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.textContent = isHidden ? 'HIDE' : 'SHOW';
    togglePassword.setAttribute('aria-pressed', String(isHidden));
  });
}

if (loginForm && emailInput) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Use browser's built-in validity first
    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    // Simple email regex as a secondary guard (optional)
    const emailVal = emailInput.value.trim();
    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simpleEmailRe.test(emailVal)) {
      emailInput.setCustomValidity('Please enter a valid work email.');
      emailInput.reportValidity();
      emailInput.setCustomValidity('');
      return;
    }

    // Show validating status briefly (demo placeholder for real auth)
    if (authStatusText) authStatusText.textContent = 'Validating credentials...';
    setTimeout(() => {
      if (authStatusText) authStatusText.textContent = 'Ready.';
    }, 900);
  });
}