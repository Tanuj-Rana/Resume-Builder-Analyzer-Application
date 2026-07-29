document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const sidebar = document.getElementById('app-sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const mobileOverlay = document.getElementById('mobile-sidebar-overlay');
    
    const themeBtn = document.getElementById('toggle-theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    const gridViewBtn = document.getElementById('btn-grid-view');
    const listViewBtn = document.getElementById('btn-list-view');
    const gridContainer = document.getElementById('recents-grid-view');
    const listContainer = document.getElementById('recents-list-view');

    // ==========================================
    // 1. SIDEBAR MANAGEMENT
    // ==========================================
    if (toggleSidebarBtn && sidebar && mobileOverlay) {
        toggleSidebarBtn.addEventListener('click', () => {
            // Check if window is mobile size (Tailwind's md breakpoint is 768px)
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
                
                // Toggle Mobile Overlay visibility
                if (sidebar.classList.contains('mobile-open')) {
                    mobileOverlay.classList.remove('hidden');
                    // Slight delay to allow display block before fading in opacity
                    setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
                } else {
                    closeMobileSidebar();
                }
            } else {
                // Desktop: Toggle collapsed state (Icon-only sidebar)
                sidebar.classList.toggle('collapsed');
            }
        });

        // Close sidebar when clicking overlay on mobile
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.add('opacity-0');
        setTimeout(() => mobileOverlay.classList.add('hidden'), 300); // Wait for transition
    }

    // ==========================================
    // 2. DARK MODE TOGGLE (Tailwind Native)
    // ==========================================
    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            // Toggle the 'dark' class on the HTML root element
            document.documentElement.classList.toggle('dark');
            
            // Update icon & Save to LocalStorage
            if (document.documentElement.classList.contains('dark')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==========================================
    // 3. RECENTS: GRID / LIST VIEW TOGGLE
    // ==========================================
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            // Update Active Button styling
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            // Show Grid, Hide List
            gridContainer.classList.remove('hidden');
            gridContainer.classList.add('grid');
            listContainer.classList.add('hidden');
            listContainer.classList.remove('flex');
        });

        listViewBtn.addEventListener('click', () => {
            // Update Active Button styling
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            
            // Show List, Hide Grid
            listContainer.classList.remove('hidden');
            listContainer.classList.add('flex');
            gridContainer.classList.add('hidden');
            gridContainer.classList.remove('grid');
        });
    }
});