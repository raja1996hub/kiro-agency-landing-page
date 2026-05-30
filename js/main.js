/**
 * Main Orchestrator
 * Initializes all modules when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize smooth scrolling (Lenis + GSAP ScrollTrigger sync)
  if (typeof initSmoothScroll === 'function') {
    initSmoothScroll();
  }

  // Initialize Three.js interactive background
  if (typeof initThreeBackground === 'function') {
    initThreeBackground();
  }

  // Initialize GSAP ScrollTrigger animations
  if (typeof initAnimations === 'function') {
    initAnimations();
  }

  // Initialize mobile menu
  initMobileMenu();

  // Remove loading state and reveal content
  document.body.classList.add('loaded');
});

// Fallback: if GSAP fails to load or animations don't run,
// ensure content becomes visible after 3 seconds
setTimeout(function() {
  if (!document.body.classList.contains('loaded')) {
    document.body.classList.add('loaded');
  }
  document.body.classList.add('content-visible');
}, 3000);

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  var hamburger = document.querySelector('.nav-hamburger');
  var overlay = document.querySelector('.mobile-menu-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', function() {
    var isActive = hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    overlay.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  // Close menu when a link is clicked
  var links = overlay.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
    });
  }
}
