document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const langText = document.getElementById('current-lang-text');
    const langMenu = document.getElementById('lang-menu');
    const langTrigger = document.getElementById('lang-trigger');
    const langOptions = document.querySelectorAll('.lang-option');

    // Elementy desktopowe
    const desktopButtons = {
        'en': document.getElementById('btn-en'),
        'pl': document.getElementById('btn-pl'),
        'ru': document.getElementById('btn-ru') // Upewnij się, że masz takie ID w HTML
    };

    function setLanguage(lang) {
        // 1. Zmiana klas na body
        body.classList.remove('lang-en', 'lang-pl', 'lang-ru');
        body.classList.add('lang-' + lang);

        // 2. Aktualizacja tekstu w przycisku mobilnym (skrót)
        if (langText) langText.textContent = lang.toUpperCase();

        // 3. Aktualizacja przycisków desktopowych (klasa active)
        Object.keys(desktopButtons).forEach(key => {
            const btn = desktopButtons[key];
            if (btn) {
                if (key === lang) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        localStorage.setItem('selectedLanguage', lang);
    }

    // Obsługa kliknięć w menu mobilne
    if (langTrigger) {
        langTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });
    }

    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            langMenu.classList.remove('active');
        });
    });

    // Obsługa kliknięć w przyciski desktopowe
    Object.keys(desktopButtons).forEach(lang => {
        const btn = desktopButtons[lang];
        if (btn) {
            btn.addEventListener('click', () => setLanguage(lang));
        }
    });

    // Start
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);
});

// Gallery 15 sec slider
let currentSlide = 0;
let slideTimer;
const slides = document.querySelectorAll('.gallery-slide');
const progressBar = document.querySelector('.progress-bar');

function showSlide(index) {
    if(slides.length === 0) return; 
    
    slides.forEach(slide => slide.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    
    if(progressBar) {
        progressBar.classList.remove('active-progress');
        void progressBar.offsetWidth; 
        progressBar.classList.add('active-progress');
    }
}

function changeSlide(step) {
    showSlide(currentSlide + step);
    resetTimer();
}

function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => changeSlide(1), 15000);
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Zmiana Języka
    const btnEn = document.getElementById("btn-en");
    const btnPl = document.getElementById("btn-pl");
    const body = document.body;

    if(btnEn && btnPl) {
        btnEn.addEventListener("click", () => {
            body.className = "lang-en";
            btnEn.classList.add("active");
            btnPl.classList.remove("active");
        });

        btnPl.addEventListener("click", () => {
            body.className = "lang-pl";
            btnPl.classList.add("active");
            btnEn.classList.remove("active");
        });
    }

    // 2. Obsługa Hamburger Menu
    const hamburger = document.getElementById("hamburger-menu");
    const navContainer = document.querySelector(".nav-container"); 

    if(hamburger) {
        hamburger.addEventListener("click", () => {
            navContainer.classList.toggle("active");
            const isExpanded = navContainer.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
        });
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navContainer.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // 3. Inicjalizacja Galerii 
    if(slides.length > 0) {
        showSlide(0);
        slideTimer = setInterval(() => changeSlide(1), 15000);
    }

    // --- 4. Testimonials Slider (Tylko Kropki, Zero Swipe/Strzałek) ---
    const testiSlides = document.querySelectorAll('.testimonial-card');
    const testiDotsContainer = document.querySelector('.testi-dots'); 
    let currentTesti = 0;

    function showTestimonial(index) {
        if (testiSlides.length === 0) return;
        
        testiSlides.forEach(slide => slide.classList.remove('active'));
        currentTesti = (index + testiSlides.length) % testiSlides.length;
        testiSlides[currentTesti].classList.add('active');

        const dots = document.querySelectorAll('.testi-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentTesti]) {
            dots[currentTesti].classList.add('active');
        }
    }

    if (testiDotsContainer && testiSlides.length > 0) {
        testiDotsContainer.innerHTML = ''; // Czyścimy na wszelki wypadek
        testiSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testi-dot');
            if (index === 0) dot.classList.add('active'); 
            dot.addEventListener('click', () => showTestimonial(index));
            testiDotsContainer.appendChild(dot);
        });
    }

    // --- Timeline progress line (career page) ---
    const timeline = document.querySelector('.premium-vertical-timeline');
    let timelineItems = [];
    let itemTriggerOffsets = [];
    let maxLineHeight = 0;

    if (timeline) {
        timelineItems = Array.from(timeline.querySelectorAll('.v-timeline-item'));
        let timelineTicking = false;

        const calculateOffsets = () => {
            const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
            const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const connectorOffset = 1.2 * remToPx;
            itemTriggerOffsets = timelineItems.map(item => {
                const itemTop = item.getBoundingClientRect().top + window.scrollY;
                return itemTop - timelineTop + connectorOffset;
            });
        };

        const updateLineHeight = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top + window.scrollY;

            const referencePoint = window.scrollY + window.innerHeight * 0.7;
            let lineHeight = referencePoint - timelineTop;

            const docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            const maxAllowed = docHeight - timelineTop;
            lineHeight = Math.min(lineHeight, maxAllowed);

            // One-way grow: never shrinks when scrolling up
            lineHeight = Math.max(lineHeight, maxLineHeight);
            maxLineHeight = lineHeight;

            timeline.style.setProperty('--line-height', `${lineHeight}px`);

            // Trigger item animations when the line reaches each connector
            timelineItems.forEach((item, i) => {
                if (lineHeight >= itemTriggerOffsets[i]) {
                    item.querySelectorAll('.anim-fade-in, .anim-slide-right, .anim-slide-left').forEach(el => {
                        el.classList.add('in-view');
                    });
                }
            });
        };

        const onTimelineScroll = () => {
            if (!timelineTicking) {
                requestAnimationFrame(() => {
                    updateLineHeight();
                    timelineTicking = false;
                });
                timelineTicking = true;
            }
        };

        window.addEventListener('scroll', onTimelineScroll, { passive: true });
        window.addEventListener('resize', () => {
            calculateOffsets();
            updateLineHeight();
        });
        window.addEventListener('load', () => {
            calculateOffsets();
            updateLineHeight();
        });
        calculateOffsets();
        updateLineHeight();
    }

    // --- 5. Scroll-triggered animations ---
    const animTargets = document.querySelectorAll('.anim-fade-in, .anim-slide-right, .anim-slide-left');
    if (animTargets.length > 0 && 'IntersectionObserver' in window) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    animObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animTargets.forEach(el => {
            // Skip elements inside the timeline — they're triggered by the line position
            if (el.closest('.premium-vertical-timeline')) return;
            animObserver.observe(el);
        });
    } else {
        animTargets.forEach(el => el.classList.add('in-view'));
    }

    // --- 6. WhatsApp Code (Multi-language) ---
    const whatsappBtn = document.getElementById('whatsapp-btn');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
        // 1. Zatrzymujemy standardowe otwarcie linku z HTML
        e.preventDefault(); 

        // 2. Ustawiamy numer z Twojego HTML
        const phoneNumber = "48452895525";
        
        // 3. Słownik wiadomości
        const messages = {
            'pl': "Cześć, chciałbym zacząć trenować. Kiedy byłby najbliższy wolny termin?",
            'en': "Hi, I’d like to start training. When is your earliest available session?",
            'ru': "Здравствуйте, я хотел бы начать тренироваться. Когда ближайшее свободное время?"
        };

        // 4. Pobieramy aktualny język (z Twojego przełącznika)
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        const messageText = messages[currentLang] || messages['en'];
        
        // 5. Budujemy link (api.whatsapp.com jest pewniejsze dla wiadomości)
        const finalUrl = `https://api.whatsapp.com/send?phone=${48452895525}&text=${encodeURIComponent(messageText)}`;

        // 6. Otwieramy w nowym oknie
        window.open(finalUrl, '_blank');
        });
    }
});
