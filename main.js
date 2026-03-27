/* Main JavaScript — Smile Line Dental Clinic (Enhanced) */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // 2. Reveal animations using IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // 3. Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => mobileNav.classList.remove('open'));
        });
    }

    // 4. Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
            }
        });
    });

    // 5. Before/After Slider
    const slider = document.getElementById('comparisonSlider');
    const imageAfter = document.getElementById('imageAfter');
    const handle = document.getElementById('sliderHandle');

    if (slider && imageAfter && handle) {
        let isDragging = false;

        const setPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let pos = (clientX - rect.left) / rect.width;
            pos = Math.max(0.05, Math.min(0.95, pos));
            imageAfter.style.width = `${pos * 100}%`;
            handle.style.left = `${pos * 100}%`;
        };

        slider.addEventListener('mousedown', (e) => { isDragging = true; setPosition(e.clientX); });
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });

        slider.addEventListener('touchstart', (e) => { isDragging = true; }, { passive: true });
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches[0]) setPosition(e.touches[0].clientX);
        }, { passive: true });
    }

    // 6. FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 7. Appointment form submission
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = '✅ Request Submitted!';
            btn.style.background = '#27ae60';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '📅 Submit Appointment Request';
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 4000);
        });
    }

    // 8. Counter animation for stats banner
    const animateCount = (el, target, suffix = '') => {
        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const statsSection = document.querySelector('.stats-banner');
    let statsAnimated = false;
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                const nums = statsSection.querySelectorAll('.stat-num');
                const data = [10, 5000, 15, 4.8];
                const suffixes = ['+', '+', '+', '★'];
                nums.forEach((el, i) => {
                    if (i === 3) {
                        let s = 0; const dur = 1500;
                        const start = performance.now();
                        const ani = (now) => {
                            const p = Math.min((now - start) / dur, 1);
                            el.textContent = (p * 4.8).toFixed(1) + '★';
                            if (p < 1) requestAnimationFrame(ani);
                        };
                        requestAnimationFrame(ani);
                    } else {
                        animateCount(el, data[i], suffixes[i]);
                    }
                });
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

});
