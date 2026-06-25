/* ===========================
   script.js — MEI Website
   =========================== */

// ── NAV: scroll shadow + hamburger ──────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.background = 'rgba(10,10,15,0.96)';
  } else {
    navbar.style.background = 'rgba(10,10,15,0.82)';
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── ACTIVE NAV LINK (scroll spy) ────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
// Add .reveal class to elements that should animate in
const revealTargets = [
  '.section-header',
  '.problem-card',
  '.compare-row',
  '.curr-card',
  '.model-card',
  '.roadmap-item',
  '.own-item',
  '.spectrum-item',
  '.stat-item',
  '.pipeline-flywheel',
  '.outro-mono',
  '.outro-big',
  '.outro-caption',
  '.outro-section .btn-primary',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

// Stagger children in grids/lists
function staggerReveal(parentSelector, childSelector) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}

staggerReveal('.problem-grid', '.problem-card');
staggerReveal('.model-grid',   '.model-card');
staggerReveal('.roadmap-track','.roadmap-item');
staggerReveal('.spectrum-items','.spectrum-item');
staggerReveal('.curr-grid',    '.curr-card');
staggerReveal('.ownership-timeline', '.own-item');

// IntersectionObserver for reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── PIPELINE STEPS (slide-in from left) ─────────────────────────────────────
const pipelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.querySelectorAll('.pipeline-step');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 180);
      });
      pipelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pipeline-track').forEach(el => pipelineObserver.observe(el));

// ── SPECTRUM BAR FILL (on vision section visible) ───────────────────────────
const spectrumFill = document.querySelector('.spectrum-fill');

const spectrumObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        if (spectrumFill) spectrumFill.style.width = '100%';
      }, 300);
      spectrumObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const visionSection = document.getElementById('vision');
if (visionSection) spectrumObserver.observe(visionSection);

// ── COUNTER ANIMATION (stat strip) ──────────────────────────────────────────
function animateCount(el, target, suffix) {
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value    = Math.floor(eased * target);
    el.textContent = formatNumber(value) + (suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (!isNaN(target) && target > 0) {
      animateCount(el, target, el.dataset.suffix || '');
    }
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (!isNaN(target) && target > 0) {
    statObserver.observe(el);
  }
});

// ── SMOOTH SCROLL OFFSET (accounts for fixed nav) ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id   = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // nav height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── CURSOR GLOW (desktop only) ───────────────────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,77,0,0.055) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.18s ease, top 0.18s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  }, { passive: true });
}

// ── ACTIVE NAV STYLE INJECTION ───────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: #FF4D00 !important;
  }
`;
document.head.appendChild(style);
