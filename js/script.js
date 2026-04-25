

// Menú hamburguesa
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburger');
    menu.classList.toggle('active');
    btn.classList.toggle('active');
}

// Submenú Servicios
function toggleSubmenu(e) {
    e.stopPropagation();
    const submenu = document.getElementById('submenu');
    const arrow = document.getElementById('arrow');
    submenu.classList.toggle('open');
    arrow.classList.toggle('rotate');
}

// Cerrar menú al hacer click en link directo
document.querySelectorAll('.mobile-menu > a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    });
});

// DARK / LIGHT MODE
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('talidecode-theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('talidecode-theme', next);
    updateIcon(next);
});

function updateIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}
function toggleSubmenu(e) {
    // Si clickean la flecha/botón (no el link), desplegamos
    if (!e.target.classList.contains('submenu-main-link')) {
        e.preventDefault();
        e.stopPropagation();
        const submenu = document.getElementById('submenu');
        const arrow = document.getElementById('arrow');
        submenu.classList.toggle('open');
        arrow.classList.toggle('rotate');
    }
}