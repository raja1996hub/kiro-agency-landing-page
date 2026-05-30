/**
 * Smooth Scroll - Lenis initialization and GSAP ScrollTrigger integration
 */
function initSmoothScroll() {
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(function(time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenisInstance = lenis;
  return lenis;
}
