/* ============================================
   TALIDECODE - Script Principal
   ============================================ */

// ========== MENÚ HAMBURGUESA ==========
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburger');
    if (menu && btn) {
        menu.classList.toggle('active');
        btn.classList.toggle('active');
    }
}

// ========== SUBMENÚ SERVICIOS ==========
function toggleSubmenu(e) {
    if (e.target.classList.contains('submenu-main-link')) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    
    const submenu = document.getElementById('submenu');
    const arrow = document.getElementById('arrow');
    
    if (submenu && arrow) {
        submenu.classList.toggle('open');
        arrow.classList.toggle('rotate');
    }
}

// ========== DARK / LIGHT MODE ==========
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('talidecode-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('talidecode-theme', next);
            updateIcon(next);
        });
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Cerrar menú al clickear links
    document.querySelectorAll('.mobile-menu > a').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            const btn = document.getElementById('hamburger');
            if (menu) menu.classList.remove('active');
            if (btn) btn.classList.remove('active');
        });
    });

    document.querySelectorAll('.submenu a').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            const btn = document.getElementById('hamburger');
            const submenu = document.getElementById('submenu');
            const arrow = document.getElementById('arrow');
            if (menu) menu.classList.remove('active');
            if (btn) btn.classList.remove('active');
            if (submenu) submenu.classList.remove('open');
            if (arrow) arrow.classList.remove('rotate');
        });
    });
});