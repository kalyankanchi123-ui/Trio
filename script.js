/* ===========================
   MOBILITY INSTITUTION OF INDIA
   script.js
   =========================== */

(function () {
  'use strict';

  /* ---------- NAV SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is tapped
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealTargets = [
    '.problem-card',
    '.pipeline-step',
    '.curriculum-card',
    '.model-item',
    '.roadmap-phase',
    '.compare-col',
    '.pipeline-loop',
    '.vision-output',
    '.section-title',
    '.section-eyebrow',
    '.hero-eyebrow',
    '.hero-headline',
    '.hero-sub',
    '.hero-actions',
    '.hero-spectrum',
    '.form-intro',
    '#form-wrap',
  ];

  const allReveal = document.querySelectorAll(revealTargets.join(','));
  allReveal.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  allReveal.forEach(el => observer.observe(el));

  /* ---------- ACTIVE NAV HIGHLIGHTING ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.style.color = 'var(--white)';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );
  sections.forEach(s => navObserver.observe(s));

  /* ---------- FORM VALIDATION & SUBMISSION ---------- */
  const submitBtn = document.getElementById('submit-btn');
  const formWrap = document.getElementById('form-wrap');
  const formSuccess = document.getElementById('form-success');

  const fields = {
    fname: { id: 'fname', errId: 'err-fname', label: 'First name', required: true },
    lname: { id: 'lname', errId: 'err-lname', label: 'Last name', required: true },
    email: { id: 'email', errId: 'err-email', label: 'Email', required: true, type: 'email' },
    category: { id: 'category', errId: 'err-category', label: 'Category', required: true },
    message: { id: 'message', errId: 'err-message', label: 'Message', required: true },
    consent: { id: 'consent', errId: 'err-consent', label: 'Consent', required: true, type: 'checkbox' },
  };

  function showError(fieldKey, message) {
    const f = fields[fieldKey];
    const el = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if (el) el.classList.add('error');
    if (errEl) errEl.textContent = message;
  }

  function clearError(fieldKey) {
    const f = fields[fieldKey];
    const el = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if (el) el.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    let valid = true;

    Object.keys(fields).forEach(key => clearError(key));

    // First name
    const fname = document.getElementById('fname').value.trim();
    if (!fname) { showError('fname', 'Please enter your first name.'); valid = false; }

    // Last name
    const lname = document.getElementById('lname').value.trim();
    if (!lname) { showError('lname', 'Please enter your last name.'); valid = false; }

    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) { showError('email', 'Please enter your email address.'); valid = false; }
    else if (!validateEmail(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }

    // Category
    const category = document.getElementById('category').value;
    if (!category) { showError('category', 'Please select your category.'); valid = false; }

    // Message
    const message = document.getElementById('message').value.trim();
    if (!message) { showError('message', 'Please tell us a bit about yourself.'); valid = false; }
    else if (message.length < 20) { showError('message', 'Please write at least 20 characters.'); valid = false; }

    // Consent
    const consent = document.getElementById('consent').checked;
    if (!consent) { showError('consent', 'Please agree to be contacted.'); valid = false; }

    return valid;
  }

  // Live clear on input
  Object.keys(fields).forEach(key => {
    const el = document.getElementById(fields[key].id);
    if (!el) return;
    const evt = fields[key].type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, () => clearError(key));
  });

  submitBtn.addEventListener('click', () => {
    if (!validate()) return;

    // Collect data
    const data = {
      firstName: document.getElementById('fname').value.trim(),
      lastName: document.getElementById('lname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      category: document.getElementById('category').value,
      interest: document.getElementById('interest').value,
      message: document.getElementById('message').value.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Simulate submission (replace with real endpoint)
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    setTimeout(() => {
      console.log('Enquiry submitted:', data);
      // Hide form, show success
      formWrap.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1000);
  });

  /* ---------- SPECTRUM HOVER GLOW ---------- */
  const spectrumItems = document.querySelectorAll('.spectrum-track span');
  spectrumItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      spectrumItems.forEach(i => i.style.opacity = '0.4');
      item.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      spectrumItems.forEach(i => { i.style.opacity = ''; });
    });
  });

  /* ---------- SMOOTH SCROLL OFFSET FOR FIXED NAV ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
