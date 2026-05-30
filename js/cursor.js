// Custom cursor implementation
(function() {
  'use strict';

  function initCursor() {
    var dot = document.querySelector('.cursor-dot');
    var circle = document.querySelector('.cursor-circle');

    if (!dot || !circle) return;

    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      dot.style.display = 'none';
      circle.style.display = 'none';
      return;
    }

    var mouseX = 0;
    var mouseY = 0;
    var dotX = 0;
    var dotY = 0;
    var circleX = 0;
    var circleY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      // Dot follows instantly
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      // Circle follows with delay
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      circle.style.left = circleX + 'px';
      circle.style.top = circleY + 'px';

      requestAnimationFrame(animate);
    }

    animate();

    // Hover effects on interactive elements
    var hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic');
    hoverTargets.forEach(function(target) {
      target.addEventListener('mouseenter', function() {
        dot.classList.add('hover');
        circle.classList.add('hover');
      });
      target.addEventListener('mouseleave', function() {
        dot.classList.remove('hover');
        circle.classList.remove('hover');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
