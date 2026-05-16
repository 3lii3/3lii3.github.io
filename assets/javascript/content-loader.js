(function() {
    if (typeof window.menuOpen === 'undefined') {
        window.menuOpen = false;
    }

    async function loadSkeletonAndContent() {
        const pageTitle = document.title;
        const pageContent = document.body.innerHTML;
        
        const pageStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                                .map(link => link.outerHTML)
                                .join('\n');

        try {
            const response = await fetch('/assets/layouts/main.html');
            let skeleton = await response.text();

            skeleton = skeleton.replace('{TITLE}', pageTitle);
            skeleton = skeleton.replace('{ARTICLE}', pageContent);
            
            skeleton = skeleton.replace('</head>', pageStyles + '</head>');

            document.open();
            document.write(skeleton);
            document.close();
        } catch (err) {
            console.error("Layout merge failed:", err);
        }
    }

    // UI/UX logic
    function updateElements() {
        const ratio = window.innerWidth / window.innerHeight;
        const pagesBar = document.getElementById('pages-bar');
        const menuButton = document.getElementById('page-menu-button');
        const menuContainer = document.getElementById('page-menu-container');

        if (pagesBar && menuButton) {
            // checks for window ratio, for mobile/portrait screens.
            if (ratio < 0.93) {
                pagesBar.style.display = 'none';
                menuButton.style.display = '';
            } else {
                pagesBar.style.display = '';
                menuButton.style.display = 'none';
            }
        }

        if (menuContainer) {
            menuContainer.style.display = window.menuOpen ? '' : 'none';
        }
    }

    function addFadeInAnimation() {
        const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
            }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    }
    
    function setup() {
        updateElements();
        
        const menuButton = document.getElementById('page-menu-button');
        const menuContainer = document.getElementById('page-menu-container');

        if (menuButton) {
            menuButton.onclick = (e) => {
                e.stopPropagation();
                window.menuOpen = !window.menuOpen;
                updateElements();
            };
        }

        if (menuContainer) {
            menuContainer.onclick = () => {
                window.menuOpen = false;
                updateElements();
            };
        }
    }

    var isReady = document.getElementById('container') !== null;

    if (!isReady) {
        loadSkeletonAndContent();
    } else {
        window.addEventListener('resize', updateElements);
        window.addEventListener('orientationchange', updateElements);
        window.addEventListener('DOMContentLoaded', addFadeInAnimation), 
        setup();
    }
})();