(function() {
  'use strict';

  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // =========================================================================
    // 1. SPLIT TEXT REVEAL - Hero headline words animate in on load
    // =========================================================================
    function initSplitTextReveal() {
      var headline = document.querySelector('.hero__headline');
      if (!headline) return;

      var splitChars = headline.querySelectorAll('.split-char');
      if (splitChars.length === 0) {
        // Wrap each word in a span if not already done
        var text = headline.textContent;
        var words = text.trim().split(/\s+/);
        headline.innerHTML = '';
        words.forEach(function(word) {
          var span = document.createElement('span');
          span.className = 'split-char';
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          var inner = document.createElement('span');
          inner.style.display = 'inline-block';
          inner.textContent = word;
          span.appendChild(inner);
          headline.appendChild(span);
          headline.appendChild(document.createTextNode(' '));
        });
        splitChars = headline.querySelectorAll('.split-char > span');
      }

      var targets = headline.querySelectorAll('.split-char > span');
      if (targets.length === 0) targets = splitChars;

      gsap.set(targets, { yPercent: 100, opacity: 0 });

      window.__heroTextReveal = function() {
        gsap.to(targets, {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.08
        });
      };
    }

    // =========================================================================
    // 2. PARALLAX DEPTH - Image placeholders move at different scroll speeds
    // =========================================================================
    function initParallaxDepth() {
      var parallaxElements = document.querySelectorAll(
        '.hostel__image-placeholder, .villa__image-placeholder, .about__image-placeholder, .about__visual'
      );

      parallaxElements.forEach(function(el, index) {
        var speed = (index % 3 === 0) ? -30 : (index % 3 === 1) ? -50 : -20;
        gsap.to(el, {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      });
    }

    // =========================================================================
    // 3. SCALE-IN CARDS - Property cards animate on scroll
    // =========================================================================
    function initScaleCards() {
      var cards = document.querySelectorAll('.property-card');
      if (cards.length === 0) return;

      gsap.fromTo(cards,
        { scale: 0.85, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.properties__grid',
            start: 'top 80%',
            end: 'center 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // =========================================================================
    // 4. PINNED ABOUT SECTION - Pin while internal elements reveal
    // =========================================================================
    function initPinnedAbout() {
      var aboutSection = document.querySelector('.about-section');
      if (!aboutSection) return;

      var quote = aboutSection.querySelector('.about__quote');
      var text = aboutSection.querySelector('.about__text');
      var visual = aboutSection.querySelector('.about__visual');

      var elements = [quote, text, visual].filter(function(el) { return el !== null; });
      if (elements.length === 0) return;

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          pinSpacing: true
        }
      });

      if (quote) {
        tl.fromTo(quote,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1 }
        );
      }
      if (text) {
        tl.fromTo(text,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.5'
        );
      }
      if (visual) {
        tl.fromTo(visual,
          { opacity: 0, scale: 0.9, clipPath: 'inset(15%)' },
          { opacity: 1, scale: 1, clipPath: 'inset(0%)', duration: 1.5 },
          '-=0.5'
        );
      }
    }

    // =========================================================================
    // 5. BACKGROUND COLOR TRANSITIONS - Color morphs between sections
    // =========================================================================
    function initColorTransitions() {
      var villaSection = document.querySelector('.villa-section');
      if (!villaSection) return;

      var wrapper = document.querySelector('.site-wrapper') || document.body;

      ScrollTrigger.create({
        trigger: villaSection,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: function() {
          gsap.to(wrapper, { backgroundColor: '#1a1a1a', color: '#f5f0eb', duration: 1.2, ease: 'power2.inOut' });
        },
        onLeave: function() {
          gsap.to(wrapper, { backgroundColor: '#f5f0eb', color: '#1a1a1a', duration: 1.2, ease: 'power2.inOut' });
        },
        onEnterBack: function() {
          gsap.to(wrapper, { backgroundColor: '#1a1a1a', color: '#f5f0eb', duration: 1.2, ease: 'power2.inOut' });
        },
        onLeaveBack: function() {
          gsap.to(wrapper, { backgroundColor: '#f5f0eb', color: '#1a1a1a', duration: 1.2, ease: 'power2.inOut' });
        }
      });
    }

    // =========================================================================
    // 6. FADE-UP REVEALS - .reveal elements animate on scroll entry
    // =========================================================================
    function initFadeUpReveals() {
      var revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(function(el) {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }

    // =========================================================================
    // 7. TEXT SCRAMBLE EFFECT - Section labels scramble then resolve
    // =========================================================================
    function initTextScramble() {
      var labels = document.querySelectorAll('.section-label');
      if (labels.length === 0) return;

      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

      labels.forEach(function(label) {
        var originalText = label.textContent;
        var scrambled = false;

        ScrollTrigger.create({
          trigger: label,
          start: 'top 85%',
          onEnter: function() {
            if (scrambled) return;
            scrambled = true;
            var frame = 0;
            var totalFrames = 20;
            var interval = setInterval(function() {
              frame++;
              var progress = frame / totalFrames;
              var result = '';
              for (var i = 0; i < originalText.length; i++) {
                if (originalText[i] === ' ') {
                  result += ' ';
                } else if (progress > (i / originalText.length)) {
                  result += originalText[i];
                } else {
                  result += chars[Math.floor(Math.random() * chars.length)];
                }
              }
              label.textContent = result;
              if (frame >= totalFrames) {
                clearInterval(interval);
                label.textContent = originalText;
              }
            }, 40);
          }
        });
      });
    }

    // =========================================================================
    // 8. PARALLAX ZOOM ON IMAGES - Scale from 1.1 to 1.0 on scroll
    // =========================================================================
    function initParallaxZoom() {
      var imageElements = document.querySelectorAll(
        '.hostel__image-placeholder, .villa__image-placeholder, .gallery__item-placeholder'
      );

      imageElements.forEach(function(el) {
        gsap.fromTo(el,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
      });
    }

    // =========================================================================
    // 9. CLIP-PATH REVEALS - Image wrappers reveal with clip-path
    // =========================================================================
    function initClipPathReveals() {
      var wrappers = document.querySelectorAll(
        '.hostel__image-wrapper, .villa__image-wrapper, .about__visual'
      );

      wrappers.forEach(function(wrapper) {
        gsap.fromTo(wrapper,
          { clipPath: 'inset(10%)' },
          {
            clipPath: 'inset(0%)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 75%',
              end: 'center 50%',
              scrub: 1
            }
          }
        );
      });
    }

    // =========================================================================
    // 10. NAVIGATION HIDE/SHOW - Hide on scroll down, show on scroll up
    // =========================================================================
    function initNavHideShow() {
      var nav = document.querySelector('.nav');
      if (!nav) return;

      var lastScrollY = 0;
      var ticking = false;

      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: function(self) {
          if (self.direction === 1) {
            // Scrolling down - hide nav
            gsap.to(nav, { yPercent: -100, duration: 0.4, ease: 'power2.inOut' });
          } else {
            // Scrolling up - show nav
            gsap.to(nav, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' });
          }
        }
      });
    }

    // =========================================================================
    // 11. HERO ELEMENTS STAGGER - Subheadline and CTAs fade up after loader
    // =========================================================================
    function initHeroStagger() {
      var subheadline = document.querySelector('.hero__subheadline');
      var ctas = document.querySelectorAll('.hero__ctas .btn');
      var heroElements = [];

      if (subheadline) heroElements.push(subheadline);
      ctas.forEach(function(cta) { heroElements.push(cta); });

      if (heroElements.length === 0) return;

      gsap.set(heroElements, { opacity: 0, y: 40 });

      window.__heroElementsReveal = function() {
        gsap.to(heroElements, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3
        });
      };
    }

    // =========================================================================
    // 12. FOOTER STAGGER - Footer columns animate in on scroll
    // =========================================================================
    function initFooterStagger() {
      var footerCols = document.querySelectorAll('.footer__col, .footer__column, .footer__block');
      if (footerCols.length === 0) return;

      gsap.fromTo(footerCols,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerCols[0].parentElement,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // =========================================================================
    // 13. GALLERY TITLE PARALLAX - Title moves slower than scroll
    // =========================================================================
    function initGalleryTitleParallax() {
      var galleryTitle = document.querySelector('.gallery__title, .gallery-section .section-title');
      if (!galleryTitle) return;

      gsap.to(galleryTitle, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryTitle,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    // =========================================================================
    // Initialize all animation modules
    // =========================================================================
    initSplitTextReveal();
    initParallaxDepth();
    initScaleCards();
    initPinnedAbout();
    initColorTransitions();
    initFadeUpReveals();
    initTextScramble();
    initParallaxZoom();
    initClipPathReveals();
    initNavHideShow();
    initHeroStagger();
    initFooterStagger();
    initGalleryTitleParallax();
  }

  // Export init function globally for main.js to call after loader
  window.__initAnimations = initAnimations;

  // Also auto-init if loaded standalone
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Delay to let main.js orchestrate if present
      setTimeout(function() {
        if (!window.__animationsInitialized) {
          initAnimations();
        }
      }, 3500);
    });
  }
})();
