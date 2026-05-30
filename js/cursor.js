(function() {
  'use strict';

  function initCursor() {
    var dot = document.querySelector('.cursor-dot');
    var circle = document.querySelector('.cursor-circle');

    if (!dot || !circle) return;

    // Check for touch device - hide custom cursor
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      dot.style.display = 'none';
      circle.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    // State
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var dotX = mouseX;
    var dotY = mouseY;
    var circleX = mouseX;
    var circleY = mouseY;
    var isHovering = false;
    var isOnText = false;
    var isHidden = false;

    // Lerp helper
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    // Track mouse position
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (isHidden) {
        isHidden = false;
        dot.style.opacity = '1';
        circle.style.opacity = '1';
      }
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', function() {
      isHidden = true;
      dot.style.opacity = '0';
      circle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function() {
      isHidden = false;
      dot.style.opacity = '1';
      circle.style.opacity = '1';
    });

    // Animation loop with lerp-based position tracking
    function animate() {
      // Dot follows closely (lerp 0.9)
      dotX = lerp(dotX, mouseX, 0.9);
      dotY = lerp(dotY, mouseY, 0.9);
      dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';

      // Circle follows with more lag (lerp 0.12)
      circleX = lerp(circleX, mouseX, 0.12);
      circleY = lerp(circleY, mouseY, 0.12);

      var circleScale = isHovering ? 2 : (isOnText ? 1.5 : 1);
      circle.style.transform = 'translate(' + circleX + 'px, ' + circleY + 'px) translate(-50%, -50%) scale(' + circleScale + ')';

      requestAnimationFrame(animate);
    }

    animate();

    // =========================================================================
    // MAGNETIC BUTTON EFFECT
    // =========================================================================
    var magneticElements = document.querySelectorAll('.magnetic, .hero__cta, .nav__link');
    var magneticDistance = 100;
    var magneticStrength = 0.3;

    magneticElements.forEach(function(el) {
      var rect;
      var centerX;
      var centerY;

      el.addEventListener('mouseenter', function() {
        isHovering = true;
        dot.classList.add('hover');
        circle.classList.add('hover');
      });

      el.addEventListener('mouseleave', function() {
        isHovering = false;
        dot.classList.remove('hover');
        circle.classList.remove('hover');

        // Spring back to original position
        if (typeof gsap !== 'undefined') {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });
        } else {
          el.style.transform = '';
        }
      });

      el.addEventListener('mousemove', function(e) {
        rect = el.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;

        var deltaX = e.clientX - centerX;
        var deltaY = e.clientY - centerY;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < magneticDistance) {
          var moveX = deltaX * magneticStrength;
          var moveY = deltaY * magneticStrength;

          if (typeof gsap !== 'undefined') {
            gsap.to(el, {
              x: moveX,
              y: moveY,
              duration: 0.3,
              ease: 'power2.out'
            });
          } else {
            el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
          }
        }
      });
    });

    // =========================================================================
    // HOVER STATES FOR DIFFERENT ELEMENTS
    // =========================================================================

    // Interactive elements - scale up circle
    var interactiveElements = document.querySelectorAll('a, button, .btn, .property-card, [data-cursor="pointer"]');
    interactiveElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        isHovering = true;
        dot.classList.add('hover');
        circle.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        isHovering = false;
        dot.classList.remove('hover');
        circle.classList.remove('hover');
      });
    });

    // Text elements - different cursor state
    var textElements = document.querySelectorAll('p, .about__text, .hostel__body, .villa__body');
    textElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        isOnText = true;
        dot.classList.add('text');
        circle.classList.add('text');
      });
      el.addEventListener('mouseleave', function() {
        isOnText = false;
        dot.classList.remove('text');
        circle.classList.remove('text');
      });
    });

    // Apply mix-blend-mode for contrast
    circle.style.mixBlendMode = 'difference';
  }

  // Export for main.js orchestration
  window.__initCursor = initCursor;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
