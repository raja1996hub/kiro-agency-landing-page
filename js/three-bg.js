// Three.js ocean background shader
(function() {
  'use strict';

  function initThreeBackground() {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('three-container');
    if (!container) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ocean plane geometry
    var geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0x0d4f4f,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5;
    mesh.position.y = -2;
    scene.add(mesh);

    camera.position.z = 5;
    camera.position.y = 2;

    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      var time = clock.getElapsedTime();
      var positions = geometry.attributes.position;

      for (var i = 0; i < positions.count; i++) {
        var x = positions.getX(i);
        var y = positions.getY(i);
        var wave = Math.sin(x * 0.5 + time * 0.8) * 0.3 +
                   Math.cos(y * 0.3 + time * 0.6) * 0.2;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeBackground);
  } else {
    initThreeBackground();
  }
})();
