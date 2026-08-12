// --- SPLASH SCREEN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-site');
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    if (enterBtn && splashScreen && mainContent) {
        enterBtn.addEventListener('click', () => {
            splashScreen.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 1200);
        });
    }
});

// --- SCROLL REVEAL (Intersection Observer) ---
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

// On touch devices, reveal an event image when its card is tapped.
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('pointerup', () => {
        if (window.matchMedia('(hover: none)').matches) {
            card.classList.toggle('is-revealed');
        }
    });
});

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Only animate once
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// --- RSVP FORM HANDLING (Static Mockup) ---
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');

if(rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents page reload since there is no backend
        rsvpForm.style.display = 'none';
        rsvpSuccess.classList.remove('hidden');
    });
}

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize Swiper slider (single instance)
        var swiper = new Swiper(".mySwiper", {
            effect: "slide",
            grabCursor: true, // Changes mouse to a hand for swiping
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            spaceBetween: 20, // Space between images
            speed: 800, // How smooth the transition is
            autoplay: {
                delay: 3000, // 3 seconds per slide
                disableOnInteraction: false, // Keeps autoplaying after user clicks
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                480: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                },
            },
        });

        // --- COUNTDOWN TIMER (ISO-aware) ---
        // HTML expects: #countdown container and children #countdown-days, -hours, -minutes, -seconds
        // Optionally set an ISO target on the container: <div id="countdown" data-target="2026-08-13T17:00:00+05:30"></div>
        let countdownContainer = document.getElementById('countdown');
        let daysEl = document.getElementById('countdown-days');
        let hoursEl = document.getElementById('countdown-hours');
        let minutesEl = document.getElementById('countdown-minutes');
        let secondsEl = document.getElementById('countdown-seconds');

        // If the #countdown element doesn't exist, try to inject a Tailwind-friendly
        // 4-column grid (grid-cols-4 on all sizes) into an existing .countdown-container.
        if (!countdownContainer) {
            const host = document.querySelector('.countdown-container') || document.body;
            // Avoid creating the markup twice
            if (!host.querySelector('#countdown')) {
                const wrapper = document.createElement('div');
                wrapper.id = 'countdown';
                wrapper.setAttribute('aria-live', 'polite');
                wrapper.className = 'w-full max-w-4xl mx-auto p-4';
                // Use both the project's CSS fallback class (countdown-grid) and Tailwind utilities
                wrapper.innerHTML = `
                    <div class="countdown-grid force-4cols grid grid-cols-4 gap-6" role="list">
                        <div class="countdown-card flex flex-col items-center p-6 rounded-2xl bg-white/90 shadow-lg" role="listitem">
                            <span id="countdown-days">0</span>
                            <span class="text-xs uppercase tracking-widest mt-2">Days</span>
                        </div>
                        <div class="countdown-card flex flex-col items-center p-6 rounded-2xl bg-white/90 shadow-lg" role="listitem">
                            <span id="countdown-hours">00</span>
                            <span class="text-xs uppercase tracking-widest mt-2">Hours</span>
                        </div>
                        <div class="countdown-card flex flex-col items-center p-6 rounded-2xl bg-white/90 shadow-lg" role="listitem">
                            <span id="countdown-minutes">00</span>
                            <span class="text-xs uppercase tracking-widest mt-2">Minutes</span>
                        </div>
                        <div class="countdown-card flex flex-col items-center p-6 rounded-2xl bg-white/90 shadow-lg" role="listitem">
                            <span id="countdown-seconds">00</span>
                            <span class="text-xs uppercase tracking-widest mt-2">Seconds</span>
                        </div>
                    </div>
                `;
                host.appendChild(wrapper);
            }
            countdownContainer = document.getElementById('countdown');
            // Query within the container to avoid accidental nulls or duplicates
            daysEl = countdownContainer.querySelector('#countdown-days');
            hoursEl = countdownContainer.querySelector('#countdown-hours');
            minutesEl = countdownContainer.querySelector('#countdown-minutes');
            secondsEl = countdownContainer.querySelector('#countdown-seconds');
        }

        // Default ISO target for wedding: 13 September 2026, 7:00 PM IST
        // ISO with timezone offset for IST (+05:30)
        const defaultIso = '2026-09-13T19:00:00+05:30';

        // Parse ISO target from data-target attribute if present, otherwise use default
        let isoString = countdownContainer?.dataset?.target || defaultIso;
        let parsedTarget = new Date(isoString);

        // Fallback: if parsing failed and isoString looks like a date without timezone, try appending 'Z' (treat as UTC)
        if (isNaN(parsedTarget) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+$/.test(isoString)) {
            parsedTarget = new Date(isoString + 'Z');
        }

        // If still invalid, fallback to default
        if (isNaN(parsedTarget)) parsedTarget = new Date(defaultIso);

        const targetDate = parsedTarget;

        // Debug: expose the parsed target to console to verify correctness
        try { console.debug && console.debug('Countdown target parsed:', targetDate.toString(), 'from ISO:', isoString); } catch (e) {}

        const navToggle = document.getElementById('mobile-nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('open');
                navToggle.setAttribute('aria-expanded', String(isOpen));
            });

            document.addEventListener('click', (event) => {
                if (!navLinks.classList.contains('open')) return;
                if (!event.target.closest('.navbar')) {
                    navLinks.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }

        function updateCountdown() {
            if (!countdownContainer) return;

            // Re-query elements in case DOM changed
            daysEl = daysEl || countdownContainer.querySelector('#countdown-days');
            hoursEl = hoursEl || countdownContainer.querySelector('#countdown-hours');
            minutesEl = minutesEl || countdownContainer.querySelector('#countdown-minutes');
            secondsEl = secondsEl || countdownContainer.querySelector('#countdown-seconds');

            if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
                // If elements are missing, don't attempt update; log to console for debugging
                try { console.warn('Countdown elements missing:', {daysEl, hoursEl, minutesEl, secondsEl}); } catch (e) {}
                return;
            }

            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                // When the date arrives or passes: set to zeros and show celebratory note (without removing structure)
                daysEl.textContent = '0';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';

                if (!document.getElementById('wedding-here')) {
                    const msg = document.createElement('div');
                    msg.id = 'wedding-here';
                    msg.className = 'mt-4 text-center text-2xl font-semibold text-gold-700';
                    msg.textContent = 'The wedding day is here! 389';
                    countdownContainer.appendChild(msg);
                }
                return true; // signal that countdown finished
            }

            const totalSeconds = Math.floor(diff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            daysEl.textContent = String(days);
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');

            return false;
        }

        // initial render + interval
        updateCountdown();
        const countdownInterval = setInterval(() => {
            const finished = updateCountdown();
            if (finished) clearInterval(countdownInterval);
        }, 1000);
    });

// ============================================================
// DECORATIVE SCROLL LAYER
// Sequence:
//   Entry  -> side flowers appear, gold particles fade in
//   Scroll -> petals fall, leaves sway, gold particles float
// ============================================================
(function () {
    const decorLayer = document.querySelector('.decor-layer');
    if (!decorLayer) return;

    const petalField = decorLayer.querySelector('.petal-field');
    const goldField = decorLayer.querySelector('.gold-field');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const PETAL_EMOJI = ['🌸', '🌿'];
    const GOLD_COUNT = 14;

    // --- Build gold particles once ---
    for (let i = 0; i < GOLD_COUNT; i++) {
        const p = document.createElement('span');
        p.className = 'gold-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = (Math.random() * 2.5) + 's';
        p.style.animationDuration = (5 + Math.random() * 4) + 's';
        goldField.appendChild(p);
    }

    // --- Entry: flowers + gold fade in ---
    // Small delay so the splash/hero settles first
    setTimeout(() => {
        decorLayer.classList.add('entry-active');
    }, 600);

    // --- Scroll: petals + sway + gold float ---
    let scrollActive = false;
    let lastSpawn = 0;

    function spawnPetal() {
        if (reduceMotion) return;
        const now = performance.now();
        if (now - lastSpawn < 600) return; // keep a gentle, continuous flow
        lastSpawn = now;

        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.textContent = PETAL_EMOJI[Math.floor(Math.random() * PETAL_EMOJI.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (0.8 + Math.random() * 0.75) + 'rem';
        petal.style.animationDuration = (7 + Math.random() * 3) + 's';
        petal.style.animationDelay = '0s';
        petal.style.transform = `translateX(${(Math.random() - 0.5) * 14}px)`;
        petalField.appendChild(petal);

        // Clean up after the fall completes
        petal.addEventListener('animationend', () => petal.remove());
    }

    function onScroll() {
        if (!scrollActive) {
            scrollActive = true;
            decorLayer.classList.add('scroll-active');
            // Keep the movement flowing instead of waiting for another scroll event.
            window.setInterval(spawnPetal, 1400);
        }
        // Start one immediately when the guest begins scrolling.
        spawnPetal();
    }

    // Throttle scroll handler with rAF and add burst on faster scrolling
    let ticking = false;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const delta = Math.abs(currentY - lastScrollY);
        lastScrollY = currentY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Also trigger a few petals on entry for a gentle start
    setTimeout(() => {
        if (!reduceMotion) {
            setTimeout(spawnPetal, 250);
            setTimeout(spawnPetal, 900);
        }
    }, 1400);
})();
