// VISIONATE Website JavaScript

class VisionateWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupAnimations();
    this.setupForms();
    this.setupSmoothScroll();
    this.setupActiveNavigation();
  }

  // Mobile Menu Functionality
  setupMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        this.toggleBodyScroll(mobileMenu.classList.contains('active'));
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
          mobileMenu.classList.remove('active');
          this.toggleBodyScroll(false);
        }
      });

      // Close menu when clicking on a link
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav__link')) {
          mobileMenu.classList.remove('active');
          this.toggleBodyScroll(false);
        }
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          this.toggleBodyScroll(false);
        }
      });
    }
  }

  toggleBodyScroll(disable) {
    if (disable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Scroll Effects
  setupScrollEffects() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Add/remove scrolled class
      if (currentScrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Hide/show header on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header?.style.setProperty('transform', 'translateY(-100%)');
      } else {
        header?.style.setProperty('transform', 'translateY(0)');
      }

      lastScrollY = currentScrollY;
    });
  }

  // Animation on Scroll
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll('.card, .service-card, .program-card, .testimonial');
    animateElements.forEach(el => {
      observer.observe(el);
    });

    // Stagger animations for grids
    const grids = document.querySelectorAll('.card-grid, .services-preview, .programs-featured');
    grids.forEach(grid => {
      const items = grid.children;
      Array.from(items).forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
      });
    });
  }

  // Form Handling
  setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    });
  }

  async handleFormSubmit(e, form) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
    submitBtn.disabled = true;

    try {
      // Validate form
      if (!this.validateForm(form)) {
        throw new Error('Por favor, completa todos los campos requeridos.');
      }

      // Simulate API call (replace with actual endpoint)
      await this.simulateFormSubmission(formData);
      
      // Show success message
      this.showFormMessage(form, 'success', '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
      
      // Reset form
      form.reset();
      
    } catch (error) {
      // Show error message
      this.showFormMessage(form, 'error', error.message || 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });

    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
      if (field.value && !this.isValidEmail(field.value)) {
        field.classList.add('error');
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async simulateFormSubmission(formData) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Error de conexión. Inténtalo de nuevo.'));
        }
      }, 2000);
    });
  }

  showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.innerHTML = `
      <span class="form-message__icon">${type === 'success' ? '✅' : '❌'}</span>
      ${message}
    `;

    // Insert after form
    form.appendChild(messageEl);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  // Smooth Scroll
  setupSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // Active Navigation
  setupActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (href === 'index.html' && currentPage === '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Utility Functions
class Utils {
  static debounce(func, wait) {
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

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        element.style.opacity = progress;
        requestAnimationFrame(animate);
      } else {
        element.style.opacity = 1;
      }
    }
    
    requestAnimationFrame(animate);
  }

  static fadeOut(element, duration = 300) {
    const start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        element.style.opacity = initialOpacity * (1 - progress);
        requestAnimationFrame(animate);
      } else {
        element.style.opacity = 0;
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  }
}

// Page-specific functionality
class PageSpecific {
  static initHomePage() {
    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-card__number');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  static initContactPage() {
    // Initialize map if needed
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      // Add map implementation here
      console.log('Map container found - implement map integration');
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 10) {
          value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        e.target.value = value;
      });
    });
  }

  static initProgramsPage() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards
        programCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            Utils.fadeIn(card);
          } else {
            Utils.fadeOut(card);
          }
        });
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main website functionality
  window.visionateWebsite = new VisionateWebsite();
  
  // Initialize page-specific functionality based on current page
  const currentPage = window.location.pathname.split('/').pop();
  
  switch(currentPage) {
    case 'index.html':
    case '':
      PageSpecific.initHomePage();
      break;
    case 'contacto.html':
      PageSpecific.initContactPage();
      break;
    case 'programas.html':
      PageSpecific.initProgramsPage();
      break;
  }
  
  // Add loading complete class
  document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations or videos when tab is not visible
    console.log('Page hidden - pausing animations');
  } else {
    // Resume animations when tab becomes visible
    console.log('Page visible - resuming animations');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('Connection restored');
  // Show connection restored message
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  // Show offline message
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VisionateWebsite, Utils, PageSpecific };
}