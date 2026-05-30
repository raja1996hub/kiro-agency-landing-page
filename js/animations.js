// GSAP ScrollTrigger animations
(function() {
  'use strict';

  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations for elements with .reveal class
    var revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(function(el) {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
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

    // Hero headline split-char animation
    var splitChars = document.querySelectorAll('.hero__headline .split-char');
    splitChars.forEach(function(char, index) {
      gsap.fromTo(char,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5 + (index * 0.1),
          ease: 'power4.out'
        }
      );
    });

    // Property cards stagger
    var cards = document.querySelectorAll('.property-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.properties__grid',
          start: 'top 80%'
        }
      }
    );

    // Navigation scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: '.nav' }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
