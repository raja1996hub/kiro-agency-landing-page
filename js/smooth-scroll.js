// Smooth scroll initialization using Lenis
(function() {
  'use strict';

  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: function(t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.__lenis = lenis;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
  } else {
    initSmoothScroll();
  }
})();
