(function() {
  'use strict';

  function initMain() {
    // =========================================================================
    // LOADING SCREEN ANIMATION SEQUENCE
    // =========================================================================
    function initLoadingSequence() {
      var loader = document.querySelector('.loader');
      var loaderBrand = document.querySelector('.loader__brand');
      var body = document.body;

      if (!loader) {
        // No loader - just init everything
        body.classList.add('loaded');
        startModules();
        return;
      }

      if (typeof gsap === 'undefined') {
        // Fallback without GSAP
        setTimeout(function() {
          loader.classList.add('loaded');
          body.classList.add('loaded');
          startModules();
        }, 2500);
        return;
      }

      // GSAP-powered loading timeline
      var loaderTl = gsap.timeline({
        onComplete: function() {
          body.classList.add('loaded');
          loader.style.pointerEvents = 'none';
          startModules();
          triggerHeroAnimations();
        }
      });

      // Phase 1: Wait for page to settle (0.5s)
      loaderTl.to({}, { duration: 0.5 });

      // Phase 2: Brand text reveals with clip-path
      if (loaderBrand) {
        loaderTl.fromTo(loaderBrand,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut' }
        );
      }

      // Phase 3: Hold for 1s to let brand register
      loaderTl.to({}, { duration: 1 });

      // Phase 4: Loader slides up and fades out
      loaderTl.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut'
      });

      // Phase 5: Resume Lenis scrolling
      loaderTl.add(function() {
        if (window.__lenis) {
          window.__lenis.start();
        }
      });
    }

    // =========================================================================
    // TRIGGER HERO ENTRANCE ANIMATIONS
    // =========================================================================
    function triggerHeroAnimations() {
      // Trigger split text reveal from animations.js
      if (typeof window.__heroTextReveal === 'function') {
        window.__heroTextReveal();
      }

      // Trigger hero elements stagger from animations.js
      setTimeout(function() {
        if (typeof window.__heroElementsReveal === 'function') {
          window.__heroElementsReveal();
        }
      }, 400);
    }

    // =========================================================================
    // MODULE INITIALIZATION - Correct order
    // =========================================================================
    function startModules() {
      // 1. Initialize GSAP animations (after loader completes)
      if (typeof window.__initAnimations === 'function') {
        window.__animationsInitialized = true;
        window.__initAnimations();
      }

      // 2. Initialize gallery (needs ScrollTrigger ready)
      setTimeout(function() {
        if (typeof window.__initGallery === 'function') {
          window.__galleryInitialized = true;
          window.__initGallery();
        }
      }, 100);
    }

    // =========================================================================
    // MOBILE NAVIGATION TOGGLE
    // =========================================================================
    function initMobileNav() {
      var hamburger = document.querySelector('.nav__hamburger');
      var navLinks = document.querySelector('.nav__links');

      if (!hamburger || !navLinks) return;

      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.classList.toggle('nav-open');
      });

      // Close mobile menu on link click
      var links = navLinks.querySelectorAll('.nav__link');
      links.forEach(function(link) {
        link.addEventListener('click', function() {
          hamburger.classList.remove('active');
          navLinks.classList.remove('open');
          document.body.classList.remove('nav-open');
        });
      });
    }

    // =========================================================================
    // CONTACT FORM HANDLER
    // =========================================================================
    function initContactForm() {
      var form = document.querySelector('.contact__form');
      if (!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();

        var btn = form.querySelector('.contact__submit');
        if (btn) {
          var originalText = btn.textContent;
          btn.textContent = 'Message Sent!';
          btn.style.background = 'var(--color-accent)';
          btn.style.color = '#fff';

          if (typeof gsap !== 'undefined') {
            gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
          }

          setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            form.reset();
          }, 3000);
        }
      });
    }

    // =========================================================================
    // INITIALIZATION ORDER
    // =========================================================================

    // Smooth scroll initializes first (handled by its own file loading before this)
    // Three.js background initializes on its own (purely visual, no dependencies)

    // Init mobile nav and form immediately
    initMobileNav();
    initContactForm();

    // Start loading sequence (orchestrates everything else)
    initLoadingSequence();
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
  } else {
    initMain();
  }
})();
