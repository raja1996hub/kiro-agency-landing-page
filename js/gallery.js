(function() {
  'use strict';

  function initGallery() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var gallerySection = document.querySelector('.gallery-section, .gallery');
    var track = document.querySelector('.gallery__track');

    if (!gallerySection || !track) return;

    // Calculate total scroll distance
    var trackWidth = track.scrollWidth;
    var viewportWidth = window.innerWidth;
    var scrollDistance = trackWidth - viewportWidth;

    if (scrollDistance <= 0) return;

    // Cache item positions relative to track for performant onUpdate
    var items = track.querySelectorAll('.gallery__item');
    var itemOffsets = [];
    items.forEach(function(item) {
      itemOffsets.push({
        el: item,
        left: item.offsetLeft,
        width: item.offsetWidth
      });
    });

    // Pin the gallery section and translate track horizontally on vertical scroll
    var galleryTween = gsap.to(track, {
      x: function() { return -scrollDistance; },
      ease: 'none',
      scrollTrigger: {
        trigger: gallerySection,
        start: 'top top',
        end: function() { return '+=' + scrollDistance; },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function(self) {
          // Scale effect - items near center are slightly larger
          var progress = self.progress;
          var currentX = progress * scrollDistance;

          itemOffsets.forEach(function(cached) {
            var itemCenter = cached.left + cached.width / 2 - currentX;
            var screenCenter = viewportWidth / 2;
            var distanceFromCenter = Math.abs(itemCenter - screenCenter);
            var maxDist = viewportWidth / 2;
            var normalizedDist = Math.min(distanceFromCenter / maxDist, 1);

            // Scale: center item is 1.05, edges are 0.92
            var scale = 1.05 - (normalizedDist * 0.13);
            // Opacity: center item is 1, edges are 0.7
            var opacity = 1 - (normalizedDist * 0.3);

            cached.el.style.transform = 'scale(' + scale + ')';
            cached.el.style.opacity = opacity;
          });
        }
      }
    });

    // Recalculate on resize
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        viewportWidth = window.innerWidth;
        trackWidth = track.scrollWidth;
        scrollDistance = trackWidth - viewportWidth;
        // Refresh cached item positions
        items.forEach(function(item, index) {
          itemOffsets[index].left = item.offsetLeft;
          itemOffsets[index].width = item.offsetWidth;
        });
        ScrollTrigger.refresh();
      }, 250);
    });

    // Subtle parallax on individual gallery items
    var items = track.querySelectorAll('.gallery__item');
    items.forEach(function(item, index) {
      var placeholder = item.querySelector('.gallery__item-placeholder');
      if (placeholder) {
        gsap.fromTo(placeholder,
          { scale: 1.1 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: gallerySection,
              start: 'top top',
              end: function() { return '+=' + scrollDistance; },
              scrub: 1
            }
          }
        );
      }
    });
  }

  // Export for main.js orchestration
  window.__initGallery = initGallery;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Delay to let main.js orchestrate
      setTimeout(function() {
        if (!window.__galleryInitialized) {
          initGallery();
        }
      }, 3500);
    });
  }
})();
