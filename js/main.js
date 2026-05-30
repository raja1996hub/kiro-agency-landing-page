// Main initialization and orchestration
(function() {
  'use strict';

  function initMain() {
    // Remove loader after page load
    var loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(function() {
        loader.classList.add('loaded');
      }, 2500);
    }

    // Mobile navigation toggle
    var hamburger = document.querySelector('.nav__hamburger');
    var navLinks = document.querySelector('.nav__links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      // Close mobile menu on link click
      var links = navLinks.querySelectorAll('.nav__link');
      links.forEach(function(link) {
        link.addEventListener('click', function() {
          hamburger.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    }

    // Smooth scroll for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Contact form handling
    var form = document.querySelector('.contact__form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Form submission placeholder
        var btn = form.querySelector('.contact__submit');
        if (btn) {
          btn.textContent = 'Message Sent!';
          btn.style.background = 'var(--color-accent)';
          setTimeout(function() {
            btn.textContent = 'Send Message';
            btn.style.background = '';
            form.reset();
          }, 3000);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
  } else {
    initMain();
  }
})();
