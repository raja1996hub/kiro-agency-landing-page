/**
 * GSAP ScrollTrigger Animations
 * Cinematic reveals, parallax, staggered animations, and color transitions
 */
function initAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Hero section - on-load timeline
  initHeroAnimation();

  // Chapter section animations
  initChapterAnimations();

  // Services cards stagger
  initServicesAnimation();

  // CTA section
  initCTAAnimation();

  // Navigation hide/show on scroll
  initNavBehavior();
}

/**
 * Hero section - elements animate in on page load
 */
function initHeroAnimation() {
  var tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero .hero-title .hero-title-line', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out'
  })
  .to('.hero .hero-subtitle', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.6')
  .to('.hero .scroll-indicator', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4');
}

/**
 * Chapter sections - scroll-triggered reveals
 */
function initChapterAnimations() {
  var chapters = document.querySelectorAll('.chapter');

  chapters.forEach(function(chapter) {
    var number = chapter.querySelector('.chapter-number');
    var title = chapter.querySelector('.chapter-title');
    var bodies = chapter.querySelectorAll('.chapter-body');

    // Chapter number animation
    if (number) {
      gsap.fromTo(number, {
        scale: 1.5,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: chapter,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1
        }
      });
    }

    // Title reveal
    if (title) {
      gsap.fromTo(title, {
        y: 60,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chapter,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Body paragraphs staggered reveal
    if (bodies.length > 0) {
      gsap.fromTo(bodies, {
        y: 60,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chapter,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Parallax - heading moves at different rate than body
    if (title && bodies.length > 0) {
      gsap.to(title, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: chapter,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  });
}

/**
 * Services cards - batch stagger reveal on viewport entry
 */
function initServicesAnimation() {
  var cards = document.querySelectorAll('.service-card');

  if (cards.length > 0) {
    gsap.fromTo(cards, {
      y: 40,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Section title and subtitle
  var sectionTitle = document.querySelector('.services .section-title');
  var sectionSubtitle = document.querySelector('.services .section-subtitle');

  if (sectionTitle) {
    gsap.fromTo(sectionTitle, {
      y: 40,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (sectionSubtitle) {
    gsap.fromTo(sectionSubtitle, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

/**
 * CTA section - scale up and fade in
 */
function initCTAAnimation() {
  var ctaTitle = document.querySelector('.cta-title');
  var ctaSubtitle = document.querySelector('.cta-subtitle');
  var ctaButton = document.querySelector('.cta-button');

  if (ctaTitle) {
    gsap.fromTo(ctaTitle, {
      y: 50,
      opacity: 0,
      scale: 0.95
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (ctaSubtitle) {
    gsap.fromTo(ctaSubtitle, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (ctaButton) {
    gsap.fromTo(ctaButton, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 55%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

/**
 * Navigation - auto-hide on scroll down, show on scroll up
 */
function initNavBehavior() {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var lastScrollY = 0;
  var scrollThreshold = 100;

  ScrollTrigger.create({
    start: 'top -' + scrollThreshold,
    end: 99999,
    onUpdate: function(self) {
      var currentScrollY = self.scroll();
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastScrollY = currentScrollY;
    }
  });
}
