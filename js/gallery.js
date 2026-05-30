// Gallery horizontal scroll and interactions
(function() {
  'use strict';

  function initGallery() {
    var track = document.querySelector('.gallery__track');
    if (!track) return;

    var isDown = false;
    var startX;
    var scrollLeft;

    // Mouse drag scrolling
    track.addEventListener('mousedown', function(e) {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', function() {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', function() {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor style
    track.style.cursor = 'grab';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
