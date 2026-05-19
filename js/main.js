/* =====================================================
  SHOWTECH SOLUTIONS — main.js
  Funcionalidades: navbar, scroll, animaciones, contador
   ===================================================== */

(function () {
  'use strict';

  /* ---------- Navbar scroll + hamburger ---------- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  const mobileClose = document.querySelector('.navbar__mobile-close');

  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Mobile menu
  function openMenu() {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileClose?.addEventListener('click', closeMenu);

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal--left, .reveal--right');

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Counter animation ---------- */
  function animateCounter(el, target, duration = 2000, suffix = '') {
    let start = 0;
    const step = target / (duration / 16);
    const update = () => {
      start += step;
      if (start < target) {
        el.textContent = Math.floor(start) + suffix;
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };
    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('[data-counter]');
  if (statEls.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, 2000, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach(el => counterObserver.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Testimonials slider (mobile) ---------- */
  const testimonialGrid = document.querySelector('.testimonials-grid');
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  if (testimonialGrid && window.innerWidth < 768) {
    testimonialGrid.style.display = 'flex';
    testimonialGrid.style.overflowX = 'auto';
    testimonialGrid.style.scrollSnapType = 'x mandatory';
    testimonialGrid.style.scrollbarWidth = 'none';
    testimonialGrid.querySelectorAll('.testimonial').forEach(t => {
      t.style.minWidth = '85vw';
      t.style.scrollSnapAlign = 'center';
    });

    testimonialGrid.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - testimonialGrid.offsetLeft;
      scrollStart = testimonialGrid.scrollLeft;
    });

    testimonialGrid.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - testimonialGrid.offsetLeft;
      testimonialGrid.scrollLeft = scrollStart - (x - startX);
    });

    ['mouseup', 'mouseleave'].forEach(evt => {
      testimonialGrid.addEventListener(evt, () => { isDragging = false; });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Hero parallax (sutil) ---------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

/* ---------- Toggle claro/oscuro ---------- */
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Cargar preferencia guardada
const savedTheme = localStorage.getItem('showtech-theme');
if (savedTheme) html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('showtech-theme', next);

  // Cambiar ícono
  const icon = themeToggle.querySelector('i');
  icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

})();
