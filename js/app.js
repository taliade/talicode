import { initReveal } from './reveal.js';
import { initCursor } from './cursor.js';
import { initBanner } from './banner.js';

function getBasePrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function getCurrentPage() {
  const cleanPath = window.location.pathname.replace(/\\/g, '/');

  if (cleanPath.endsWith('/pages/servicios.html')) return 'servicios';
  if (cleanPath.endsWith('/pages/contacto.html')) return 'contacto';
  return 'inicio';
}

async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`No se pudo cargar ${path}:`, err);
  }
}

function wireSharedLinks(basePrefix) {
  const routeMap = {
    inicio: `${basePrefix}index.html`,
    servicios: `${basePrefix}pages/servicios.html`,
    contacto: `${basePrefix}pages/contacto.html`
  };

  document.querySelectorAll('[data-nav]').forEach((link) => {
    const key = link.getAttribute('data-nav');
    if (!key || !routeMap[key]) return;

    link.setAttribute('href', routeMap[key]);
  });
}

function markActiveLink() {
  const currentPage = getCurrentPage();

  document.querySelectorAll('.navbar-links [data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

async function initApp() {
  const basePrefix = getBasePrefix();
  const componentsPrefix = `${basePrefix}components`;

  await Promise.all([
    loadComponent('site-navbar', `${componentsPrefix}/navbar.html`),
    loadComponent('tech-banner', `${componentsPrefix}/tech-banner.html`),
    loadComponent('site-footer', `${componentsPrefix}/footer.html`)
  ]);

  wireSharedLinks(basePrefix);
  markActiveLink();
  initReveal();
  initCursor();
  initBanner();
}

initApp();
