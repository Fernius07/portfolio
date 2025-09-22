// Portfolio App JavaScript
class PortfolioApp {
    constructor() {
        this.currentLanguage = 'es';
        this.currentTheme = 'dark';
        this.isMenuOpen = false;
        this.typingText = '';
        this.typingIndex = 0;
        
        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.initTypingAnimation();
        this.initScrollReveal();
        this.initBackgroundParticles();
        this.initSmoothScrolling();
        this.hideLoading();
    }

    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        const savedLanguage = localStorage.getItem('portfolio-language') || 'es';
        
        this.setTheme(savedTheme);
        this.setLanguage(savedLanguage);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        langToggle?.addEventListener('click', () => this.toggleLanguage());

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });

        // Contact form submission
        const contactForm = document.querySelector('.contact__form');
        contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.revealOnScroll();
        });

        // Resize events
        window.addEventListener('resize', () => this.handleResize());

        // Add glitch effect to buttons
        this.addGlitchEffects();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = themeToggle?.querySelector('.sun');
        const moonIcon = themeToggle?.querySelector('.moon');

        if (theme === 'light') {
            sunIcon?.classList.add('active');
            moonIcon?.classList.remove('active');
        } else {
            sunIcon?.classList.remove('active');
            moonIcon?.classList.add('active');
        }

        localStorage.setItem('portfolio-theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add theme transition animation
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        
        // Update language toggle buttons
        const langToggle = document.getElementById('lang-toggle');
        const langOptions = langToggle?.querySelectorAll('.lang-option');
        
        langOptions?.forEach(option => {
            if (option.dataset.lang === language) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Update all translatable elements
        this.updateLanguageContent();
        
        // Update typing animation text
        this.initTypingAnimation();
        
        localStorage.setItem('portfolio-language', language);
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.setLanguage(newLanguage);
    }

    updateLanguageContent() {
        const translatableElements = document.querySelectorAll('[data-es][data-en]');
        
        translatableElements.forEach(element => {
            const text = element.dataset[this.currentLanguage];
            if (text) {
                element.textContent = text;
            }
        });

        // Update form placeholders and labels
        this.updateFormLanguage();
    }

    updateFormLanguage() {
        const formElements = {
            name: {
                es: 'Tu nombre completo',
                en: 'Your full name'
            },
            email: {
                es: 'tu@email.com',
                en: 'your@email.com'
            },
            message: {
                es: 'Cuéntame sobre tu proyecto...',
                en: 'Tell me about your project...'
            }
        };

        Object.keys(formElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.placeholder = formElements[id][this.currentLanguage];
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        this.isMenuOpen = !this.isMenuOpen;
        
        navMenu?.classList.toggle('active', this.isMenuOpen);
        navToggle?.classList.toggle('active', this.isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    initTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const texts = {
            es: 'Iñigo Fernández García',
            en: 'Iñigo Fernández García'
        };

        this.typingText = texts[this.currentLanguage];
        this.typingIndex = 0;
        
        // Clear existing content
        typingElement.textContent = '';
        
        this.typeNextCharacter(typingElement);
    }

    typeNextCharacter(element) {
        if (this.typingIndex < this.typingText.length) {
            element.textContent += this.typingText.charAt(this.typingIndex);
            this.typingIndex++;
            
            // Random typing speed for more natural feel
            const speed = Math.random() * 100 + 50;
            setTimeout(() => this.typeNextCharacter(element), speed);
        }
    }

    initScrollReveal() {
        const revealElements = document.querySelectorAll('.section, .card, .timeline__content');
        
        revealElements.forEach(element => {
            element.classList.add('reveal');
        });
    }

    revealOnScroll() {
        const revealElements = document.querySelectorAll('.reveal:not(.active)');
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    initBackgroundParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Create animated background dots
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--color-primary);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        // Add/remove header background on scroll
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    addGlitchEffects() {
        const buttons = document.querySelectorAll('.btn--primary');
        
        buttons.forEach(button => {
            let glitchTimeout;
            
            button.addEventListener('mouseenter', () => {
                // Random glitch effect
                if (Math.random() > 0.7) {
                    button.style.animation = 'glitch 0.3s ease-in-out';
                    
                    clearTimeout(glitchTimeout);
                    glitchTimeout = setTimeout(() => {
                        button.style.animation = '';
                    }, 300);
                }
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        
        if (!button) return;
        
        // Simulate form submission
        const originalText = button.textContent;
        button.disabled = true;
        
        const loadingTexts = {
            es: 'Enviando...',
            en: 'Sending...'
        };
        
        const successTexts = {
            es: '¡Mensaje enviado!',
            en: 'Message sent!'
        };
        
        button.textContent = loadingTexts[this.currentLanguage];
        
        // Simulate API call
        setTimeout(() => {
            button.textContent = successTexts[this.currentLanguage];
            button.style.background = 'var(--color-success)';
            
            // Reset form
            form.reset();
            
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }, 1500);
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.remove();
                }, 500);
            }, 1000);
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Easter egg: Konami code
    initKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        let userInput = [];
        
        document.addEventListener('keydown', (e) => {
            userInput.push(e.code);
            
            if (userInput.length > konamiCode.length) {
                userInput.shift();
            }
            
            if (userInput.join(',') === konamiCode.join(',')) {
                this.activateHackerMode();
                userInput = [];
            }
        });
    }

    activateHackerMode() {
        // Secret hacker mode with enhanced effects
        document.body.style.filter = 'hue-rotate(60deg) contrast(1.2)';
        
        const message = this.currentLanguage === 'es' 
            ? '🚀 Modo Hacker Activado! 🚀' 
            : '🚀 Hacker Mode Activated! 🚀';
            
        this.showNotification(message);
        
        // Add matrix effect
        this.addMatrixEffect();
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
    }

    addMatrixEffect() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.1;
        `;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        document.body.appendChild(canvas);
        const interval = setInterval(draw, 33);
        
        setTimeout(() => {
            clearInterval(interval);
            canvas.remove();
        }, 5000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: var(--color-background);
            padding: 1rem 2rem;
            border-radius: 8px;
            font-family: var(--font-family-mono);
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Additional CSS animations for notifications
const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Make app globally accessible for debugging
    window.portfolioApp = app;
    
    // Initialize Konami code easter egg
    app.initKonamiCode();
    
    // Console message for curious developers
    console.log(`
    ╔══════════════════════════════════════╗
    ║     🚀 Iñigo Fernández García 🚀     ║
    ║                                      ║
    ║  Desarrollador Web & Ciberseguridad  ║
    ║                                      ║
    ║  Gracias por revisar mi código! 💚   ║
    ║                                      ║
    ║  Intenta el código Konami... 😉      ║
    ╚══════════════════════════════════════╝
    `);
});

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be implemented here for production
        console.log('🔧 Service Worker ready for implementation');
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}