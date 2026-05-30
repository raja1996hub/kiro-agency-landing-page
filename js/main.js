/**
 * Main Orchestrator
 * Initializes all modules when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize smooth scrolling (Lenis + GSAP ScrollTrigger sync)
  initSmoothScroll();

  // Initialize Three.js interactive background
  initThreeBackground();

  // Initialize GSAP ScrollTrigger animations
  initAnimations();

  // Remove loading state and reveal content
  document.body.classList.add('loaded');
});
