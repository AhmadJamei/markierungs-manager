let isLocked = localStorage.getItem('sidebarLocked') === 'true';

function expandSidebar() {
    document.getElementById('sidebar').classList.add('expanded');
    document.getElementById('main-content').classList.add('shifted');
}

function collapseSidebar() {
    if (!isLocked) {
        document.getElementById('sidebar').classList.remove('expanded');
        document.getElementById('main-content').classList.remove('shifted');
    }
}

function toggleLock() {
    isLocked = !isLocked;
    localStorage.setItem('sidebarLocked', isLocked);
    if (isLocked) {
        document.getElementById('sidebar').classList.add('locked');
        document.getElementById('sidebar').classList.add('expanded');
        document.getElementById('main-content').classList.add('shifted');
    } else {
        document.getElementById('sidebar').classList.remove('locked');
        document.getElementById('sidebar').classList.remove('expanded');
        document.getElementById('main-content').classList.remove('shifted');
    }
}

// اعمال حالت قفل از localStorage
if (isLocked) {
    document.getElementById('sidebar').classList.add('locked');
    document.getElementById('sidebar').classList.add('expanded');
    document.getElementById('main-content').classList.add('shifted');
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    submenu.classList.toggle('open');
}