'use strict';

/* ================================================
   BLADE & CO — script.js
   ================================================ */

// ── DOM refs ──────────────────────────────────────
const header       = document.getElementById('header');
const heroParallax = document.getElementById('heroParallax');
const bookingForm  = document.getElementById('bookingForm');
const modal        = document.getElementById('modal');
const modalClose   = document.getElementById('modalClose');

// ── Утилита: throttle ─────────────────────────────
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn.apply(this, args); }
  };
}

/* ================================================
   1. STICKY HEADER — добавляем класс при скролле
   ================================================ */
function onScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', throttle(onScroll, 50));

/* ================================================
   2. PARALLAX HERO
   ================================================ */
function parallaxHero() {
  if (!heroParallax) return;
  const offset = window.scrollY;
  heroParallax.style.transform = `translateY(${offset * 0.35}px)`;
}
window.addEventListener('scroll', throttle(parallaxHero, 16));

/* ================================================
   3. REVEAL ON SCROLL (IntersectionObserver)
   ================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ================================================
   4. SCROLL-TO-TOP BUTTON
   ================================================ */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Наверх');
scrollTopBtn.innerHTML = '↑';
document.body.appendChild(scrollTopBtn);

function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}
window.addEventListener('scroll', throttle(toggleScrollTop, 100));
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================================================
   5. BOOKING FORM — submit + modal
   ================================================ */
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openModal();
    bookingForm.reset();
  });
}

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ================================================
   6. HAMBURGER / MOBILE NAV
   ================================================ */
// Создаём гамбургер и мобильное меню динамически
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'Меню');
hamburger.innerHTML = '<span></span><span></span><span></span>';

const mobileNav = document.createElement('nav');
mobileNav.className = 'nav--mobile';

// Копируем ссылки из десктопного nav
const desktopNavLinks = document.querySelectorAll('.nav a');
desktopNavLinks.forEach((link) => {
  const clone = link.cloneNode(true);
  mobileNav.appendChild(clone);
});

// Добавляем кнопку «Записаться» в мобильный nav
const mobileBookBtn = document.createElement('a');
mobileBookBtn.href = '#booking';
mobileBookBtn.textContent = '✂ Записаться';
mobileBookBtn.style.color = 'var(--gold)';
mobileNav.appendChild(mobileBookBtn);

const headerInner = document.querySelector('.header__inner');
headerInner.appendChild(hamburger);
document.body.appendChild(mobileNav);

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Закрываем мобильное меню при клике на ссылку
mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ================================================
   7. STATS COUNTER ANIMATION
   ================================================ */

// Добавляем секцию со статистикой после hero динамически
const statsSection = document.createElement('section');
statsSection.className = 'stats';
statsSection.innerHTML = `
  <div class="container">
    <div class="stats__grid">
      <div class="stat-item reveal">
        <span class="stat-item__num" data-target="3000">0</span>
        <span class="stat-item__label">Довольных клиентов</span>
      </div>
      <div class="stat-item reveal">
        <span class="stat-item__num" data-target="9">0</span>
        <span class="stat-item__label">Лет опыта</span>
      </div>
      <div class="stat-item reveal">
        <span class="stat-item__num" data-target="3">0</span>
        <span class="stat-item__label">Мастера</span>
      </div>
      <div class="stat-item reveal">
        <span class="stat-item__num" data-target="15">0</span>
        <span class="stat-item__label">Услуг в меню</span>
      </div>
    </div>
  </div>
`;

// Вставляем после hero секции
const heroSection = document.getElementById('hero');
heroSection.insertAdjacentElement('afterend', statsSection);

// Наблюдатель для запуска счётчиков
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const steps    = 60;
  const increment = target / steps;
  let current = 0;
  let step    = 0;

  // Добавляем + или слова после числа
  const suffix = target >= 1000 ? '+' : (target === 9 ? ' лет' : '+');

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current >= 1000
      ? (current / 1000).toFixed(1) + 'K' + suffix.replace('+','')
      : current + (step >= steps ? suffix : '');

    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-item__num');
        nums.forEach((num) => animateCounter(num));
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

counterObserver.observe(statsSection);

// Регистрируем новые .reveal элементы из stats
statsSection.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ================================================
   8. ЖИВЫЕ ЧАСЫ В HEADER
   ================================================ */
const timeWidget = document.createElement('div');
timeWidget.className = 'header__time';
timeWidget.innerHTML = '<span class="dot"></span><span class="clock-time"></span>';
headerInner.insertBefore(timeWidget, headerInner.querySelector('.btn'));

const clockEl = timeWidget.querySelector('.clock-time');

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');
  const open = now.getHours() >= 10 && now.getHours() < 22;
  clockEl.textContent = `${h}:${m}:${s} · ${open ? 'Открыто' : 'Закрыто'}`;
  clockEl.style.color = open ? 'var(--white)' : '#e05050';
  timeWidget.querySelector('.dot').style.background = open ? '#4caf50' : '#e05050';
  timeWidget.querySelector('.dot').style.boxShadow  =
    open ? '0 0 6px #4caf50' : '0 0 6px #e05050';
}

updateClock();
setInterval(updateClock, 1000);

/* ================================================
   9. SMOOTH SCROLL для якорей
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ================================================
   10. GALLERY — лёгкий лайтбокс
   ================================================ */
function createLightbox() {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position:fixed; inset:0; z-index:3000;
    background:rgba(0,0,0,0.95);
    display:flex; align-items:center; justify-content:center;
    opacity:0; pointer-events:none;
    transition:opacity 0.3s ease;
    cursor:zoom-out;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    max-width:700px; width:90%; padding:40px;
    background: var(--black-3);
    border:1px solid rgba(201,168,76,0.3);
    border-radius:4px;
    text-align:center;
    transform:scale(0.85);
    transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor:default;
    position:relative;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position:absolute; top:14px; right:18px;
    background:none; border:none;
    color:var(--gold); font-size:1.4rem;
    cursor:pointer; line-height:1;
  `;

  const preview = document.createElement('div');
  preview.style.cssText = `
    width:100%; height:320px;
    border-radius:4px;
    margin-bottom:20px;
    border:1px solid rgba(201,168,76,0.15);
  `;

  const caption = document.createElement('p');
  caption.style.cssText = `
    font-family:'Georgia',serif;
    font-size:1rem; letter-spacing:0.1em;
    text-transform:uppercase; color:var(--gold);
  `;

  inner.appendChild(closeBtn);
  inner.appendChild(preview);
  inner.appendChild(caption);
  lb.appendChild(inner);
  document.body.appendChild(lb);

  // Открыть
  function openLightbox(bgStyle, label) {
    preview.style.background = bgStyle;
    caption.textContent = label;
    lb.style.opacity        = '1';
    lb.style.pointerEvents  = 'all';
    inner.style.transform   = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  // Закрыть
  function closeLightbox() {
    lb.style.opacity       = '0';
    lb.style.pointerEvents = 'none';
    inner.style.transform  = 'scale(0.85)';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  lb.addEventListener('click', closeLightbox);
  inner.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Привязываем к галерее
  document.querySelectorAll('.gallery__item').forEach((item) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img    = item.querySelector('.gallery__img');
      const label  = item.querySelector('.gallery__overlay span')?.textContent || '';
      const bg     = window.getComputedStyle(img).background;
      openLightbox(bg, label);
    });
  });
}

createLightbox();

/* ================================================
   11. АКТИВНАЯ ССЫЛКА В NAV при скролле
   ================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav a');

function setActiveNav() {
  let current = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - header.offsetHeight - 60;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach((link) => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--gold)';
    }
  });
}
window.addEventListener('scroll', throttle(setActiveNav, 80));

/* ================================================
   12. ИНИЦИАЛИЗАЦИЯ при загрузке
   ================================================ */
window.addEventListener('DOMContentLoaded', () => {
  onScroll();
  toggleScrollTop();
  setActiveNav();

  // Устанавливаем минимальную дату брони — сегодня
  const dateInput = bookingForm?.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min   = today;
    dateInput.value = today;
  }
});