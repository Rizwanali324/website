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

    // Video Modal Logic
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const videoBtns = document.querySelectorAll('.video-btn');
    const closeVideo = document.querySelector('.close-video-modal');

    if (videoModal && videoIframe && videoBtns) {
        videoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = btn.getAttribute('href');
                videoIframe.src = videoUrl;
                videoModal.style.display = 'flex';
                setTimeout(() => {
                    videoModal.classList.add('show');
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeVideoFn = () => {
            videoModal.classList.remove('show');
            setTimeout(() => {
                videoModal.style.display = 'none';
                videoIframe.src = '';
            }, 300);
            document.body.style.overflow = 'auto';
        };

        if (closeVideo) {
            closeVideo.addEventListener('click', closeVideoFn);
        }

        window.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoFn();
            }
        });
    }

    // Update Project Filtering to handle multiple categories
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
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
                calendarIframe.src = '';
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
    }
});

/* =============================================
   PASTE THIS ENTIRE <script> block into your
   existing js/script.js file, at the bottom.
   ============================================= */

// ---- Filter ----
document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');
    var filter = this.dataset.filter;
    document.querySelectorAll('.project-card').forEach(function(card) {
      var cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- Modal ----
var overlay = document.getElementById('project-modal-overlay');
var modalClose = document.getElementById('modal-close');
var modalCloseBtn = document.getElementById('modal-close-btn');

function openModal(card) {
  document.getElementById('modal-title').textContent = card.dataset.title || '';
  document.getElementById('modal-cat').textContent = card.dataset.cat || '';
  document.getElementById('modal-fps').textContent = (card.dataset.fps || '') + ' · Live';
  document.getElementById('modal-result').innerHTML = '<strong>Business Result</strong>' + (card.dataset.result || '');
  document.getElementById('modal-upwork-btn').href = card.dataset.upwork || '#';
  
  var cardImg = card.querySelector('.project-thumb img');
  var modalImg = document.getElementById('modal-img');
  if (cardImg && modalImg) {
    modalImg.src = cardImg.getAttribute('src');
  }

  var techTags = (card.dataset.tech || '').split(',');
  var techEl = document.getElementById('modal-tech');
  techEl.innerHTML = '';
  techTags.forEach(function(t) {
    var span = document.createElement('span');
    span.className = 'modal-tech-tag';
    span.textContent = t.trim();
    techEl.appendChild(span);
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

