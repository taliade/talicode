import { initReveal } from './reveal.js';
import { initCursor } from './cursor.js';
import { initBanner } from './banner.js';

/* ========= CONFIG ========= */

const ROUTES = {
  inicio: 'index.html',
  servicios: 'pages/servicios.html',
  contacto: 'pages/contacto.html'
};

/* ========= HELPERS ========= */

function getBasePrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function getCurrentPage() {
  const path = window.location.pathname.replace(/\\/g, '/');

  if (path.includes('/servicios.html')) return 'servicios';
  if (path.includes('/contacto.html')) return 'contacto';
  return 'inicio';
}

function waitForDOM() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/* ========= LOAD COMPONENT ========= */

async function loadComponent(id, path, retries = 1) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(path);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    el.innerHTML = html;

  } catch (err) {
    console.warn(`⚠️ Error cargando ${path}`, err);

    if (retries > 0) {
      console.log(`🔁 Reintentando ${path}...`);
      return loadComponent(id, path, retries - 1);
    }

    el.innerHTML = `<p style="color:red;">Error cargando componente</p>`;
  }
}

/* ========= NAV ========= */

function wireSharedLinks(basePrefix) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const key = link.getAttribute('data-nav');
    if (!ROUTES[key]) return;

    link.href = `${basePrefix}${ROUTES[key]}`;
  });
}

function markActiveLink() {
  const current = getCurrentPage();

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ========= INIT ========= */

async function initComponents(basePrefix) {
  const path = `${basePrefix}components`;

  await Promise.all([
    loadComponent('site-navbar', `${path}/navbar.html`),
    loadComponent('tech-banner', `${path}/tech-banner.html`),
    loadComponent('site-footer', `${path}/footer.html`)
  ]);
}

function initInteractions() {
  initReveal();
  initCursor();
  initBanner();
}

/* ========= APP ========= */

async function initApp() {
  await waitForDOM();

  const basePrefix = getBasePrefix();

  await initComponents(basePrefix);

  wireSharedLinks(basePrefix);
  markActiveLink();

  initInteractions();

  console.log('🚀 TaliCode App cargada correctamente');
}

initApp();

function initMenu() {
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  // cerrar al hacer click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}


initInteractions();
initMenu();