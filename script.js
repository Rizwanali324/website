// script.js - Interactive behavior for Visionary AI website

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-active');
            mobileToggle.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                mobileToggle.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                mobileToggle.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            btn.textContent = 'Sending...';
            btn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = '#10b981'; // Success green
                    contactForm.reset();
                } else {
                    return response.json().then(data => {
                        if (data.errors) {
                            btn.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            btn.textContent = 'Oops! Submission failed';
                        }
                        btn.style.background = '#ef4444';
                    });
                }
            }).catch(error => {
                btn.textContent = 'Connection Error';
                btn.style.background = '#ef4444';
            }).finally(() => {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.hero-content, .service-card, .project-item, .contact-card');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Project Filtering with smooth transitions
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.style.transition = 'all 0.4s ease-out';
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });

    // Add Back to Top button functionality
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Calendar Modal Logic
    const calendarModal = document.getElementById('calendar-modal');
    const calendarIframe = document.getElementById('calendar-iframe');
    const calendarBtns = document.querySelectorAll('.calendar-btn');
    const closeModal = document.querySelector('.close-modal');

    if (calendarModal && calendarIframe && calendarBtns) {
        calendarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const calendarUrl = btn.getAttribute('href');
                calendarIframe.src = calendarUrl;
                calendarModal.style.display = 'flex';
                setTimeout(() => {
                    calendarModal.classList.add('show');
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeCalendar = () => {
            calendarModal.classList.remove('show');
            setTimeout(() => {
                calendarModal.style.display = 'none';
                calendarIframe.src = ''; // Clear src to stop loading/video
            }, 300);
            document.body.style.overflow = 'auto';
        };

        if (closeModal) {
            closeModal.addEventListener('click', closeCalendar);
        }

        window.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                closeCalendar();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && calendarModal.classList.contains('show')) {
                closeCalendar();
            }
        });
    }
});
