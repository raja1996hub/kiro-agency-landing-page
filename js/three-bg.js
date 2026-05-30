(function() {
  'use strict';

  function initThreeBackground() {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('three-container');
    if (!container) return;

    // Scene setup with OrthographicCamera for full-screen shader plane
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Custom GLSL shaders for ocean/water caustics
    var vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n');

    var fragmentShader = [
      'precision highp float;',
      '',
      'uniform float uTime;',
      'uniform vec2 uMouse;',
      'uniform vec2 uResolution;',
      'uniform float uScroll;',
      '',
      'varying vec2 vUv;',
      '',
      '// Simplex-like noise function',
      'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }',
      '',
      'float snoise(vec2 v) {',
      '  const vec4 C = vec4(0.211324865405187, 0.366025403784439,',
      '                      -0.577350269189626, 0.024390243902439);',
      '  vec2 i = floor(v + dot(v, C.yy));',
      '  vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1;',
      '  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
      '  vec4 x12 = x0.xyxy + C.xxzz;',
      '  x12.xy -= i1;',
      '  i = mod289v2(i);',
      '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
      '  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);',
      '  m = m * m;',
      '  m = m * m;',
      '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
      '  vec3 h = abs(x) - 0.5;',
      '  vec3 ox = floor(x + 0.5);',
      '  vec3 a0 = x - ox;',
      '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
      '  vec3 g;',
      '  g.x = a0.x * x0.x + h.x * x0.y;',
      '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
      '  return 130.0 * dot(m, g);',
      '}',
      '',
      'void main() {',
      '  vec2 uv = vUv;',
      '  float aspect = uResolution.x / uResolution.y;',
      '  vec2 scaledUv = vec2(uv.x * aspect, uv.y);',
      '',
      '  // Time-based animation',
      '  float t = uTime * 0.15;',
      '',
      '  // Mouse influence - subtle ripple near cursor',
      '  vec2 mousePos = uMouse;',
      '  float mouseDist = distance(uv, mousePos);',
      '  float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.15;',
      '',
      '  // Layered noise for water caustics',
      '  float n1 = snoise(scaledUv * 3.0 + vec2(t, t * 0.7));',
      '  float n2 = snoise(scaledUv * 5.0 - vec2(t * 0.5, t * 0.3));',
      '  float n3 = snoise(scaledUv * 8.0 + vec2(t * 0.3, -t * 0.6));',
      '',
      '  // Combine noise layers with mouse distortion',
      '  float caustic = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;',
      '  caustic += mouseInfluence * sin(mouseDist * 30.0 - uTime * 3.0);',
      '',
      '  // Scroll-based color shift',
      '  float scrollFactor = uScroll;',
      '',
      '  // Coastal color palette',
      '  vec3 deepTeal = vec3(0.051, 0.31, 0.31);',
      '  vec3 warmSand = vec3(0.91, 0.863, 0.784);',
      '  vec3 sunsetCoral = vec3(0.78, 0.357, 0.224);',
      '  vec3 darkOcean = vec3(0.027, 0.2, 0.2);',
      '',
      '  // Gradient from teal to sand with caustic highlights',
      '  vec3 baseColor = mix(deepTeal, darkOcean, scrollFactor * 0.5);',
      '  vec3 highlight = mix(warmSand, sunsetCoral, caustic * 0.5 + 0.5);',
      '',
      '  // Blend based on noise pattern',
      '  float blend = smoothstep(-0.3, 0.6, caustic);',
      '  vec3 color = mix(baseColor, highlight, blend * 0.2);',
      '',
      '  // Subtle wave pattern overlay',
      '  float wave = sin(uv.x * 20.0 + uTime * 0.5 + caustic * 3.0) * 0.02;',
      '  wave += sin(uv.y * 15.0 - uTime * 0.3) * 0.015;',
      '  color += vec3(wave);',
      '',
      '  // Vignette',
      '  float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.5);',
      '  color *= vignette;',
      '',
      '  // Overall opacity - keep it subtle',
      '  float alpha = 0.35 + caustic * 0.08;',
      '',
      '  gl_FragColor = vec4(color, alpha);',
      '}'
    ].join('\n');

    // Uniforms
    var uniforms = {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uScroll: { value: 0.0 }
    };

    // Full-screen quad with shader material
    var geometry = new THREE.PlaneGeometry(2, 2);
    var material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      transparent: true,
      depthWrite: false
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    var targetMouse = { x: 0.5, y: 0.5 };
    var currentMouse = { x: 0.5, y: 0.5 };

    document.addEventListener('mousemove', function(e) {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    });

    // Scroll tracking
    window.addEventListener('scroll', function() {
      var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      uniforms.uScroll.value = scrollProgress;
    });

    // Animation loop
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      uniforms.uTime.value = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', function() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeBackground);
  } else {
    initThreeBackground();
  }
})();
