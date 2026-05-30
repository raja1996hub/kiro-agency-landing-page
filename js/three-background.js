/**
 * Three.js Interactive Background
 * Fullscreen shader-based organic visuals reacting to cursor movement
 */
function initThreeBackground() {
  var canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  var mouse = { x: 0.5, y: 0.5 };
  var targetMouse = { x: 0.5, y: 0.5 };

  // Renderer
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Camera (orthographic for 2D shader effect)
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Scene
  var scene = new THREE.Scene();

  // Shader Material
  var vertexShader = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position, 1.0);',
    '}'
  ].join('\n');

  var fragmentShader = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform vec2 uMouse;',
    'uniform vec2 uResolution;',
    'varying vec2 vUv;',
    '',
    '// Simplex-like noise functions',
    'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
    'vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
    'vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }',
    'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
    '',
    'float snoise(vec3 v) {',
    '  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);',
    '  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);',
    '  vec3 i = floor(v + dot(v, C.yyy));',
    '  vec3 x0 = v - i + dot(i, C.xxx);',
    '  vec3 g = step(x0.yzx, x0.xyz);',
    '  vec3 l = 1.0 - g;',
    '  vec3 i1 = min(g.xyz, l.zxy);',
    '  vec3 i2 = max(g.xyz, l.zxy);',
    '  vec3 x1 = x0 - i1 + C.xxx;',
    '  vec3 x2 = x0 - i2 + C.yyy;',
    '  vec3 x3 = x0 - D.yyy;',
    '  i = mod289(i);',
    '  vec4 p = permute(permute(permute(',
    '    i.z + vec4(0.0, i1.z, i2.z, 1.0))',
    '    + i.y + vec4(0.0, i1.y, i2.y, 1.0))',
    '    + i.x + vec4(0.0, i1.x, i2.x, 1.0));',
    '  float n_ = 0.142857142857;',
    '  vec3 ns = n_ * D.wyz - D.xzx;',
    '  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);',
    '  vec4 x_ = floor(j * ns.z);',
    '  vec4 y_ = floor(j - 7.0 * x_);',
    '  vec4 x = x_ * ns.x + ns.yyyy;',
    '  vec4 y = y_ * ns.x + ns.yyyy;',
    '  vec4 h = 1.0 - abs(x) - abs(y);',
    '  vec4 b0 = vec4(x.xy, y.xy);',
    '  vec4 b1 = vec4(x.zw, y.zw);',
    '  vec4 s0 = floor(b0) * 2.0 + 1.0;',
    '  vec4 s1 = floor(b1) * 2.0 + 1.0;',
    '  vec4 sh = -step(h, vec4(0.0));',
    '  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;',
    '  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;',
    '  vec3 p0 = vec3(a0.xy, h.x);',
    '  vec3 p1 = vec3(a0.zw, h.y);',
    '  vec3 p2 = vec3(a1.xy, h.z);',
    '  vec3 p3 = vec3(a1.zw, h.w);',
    '  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));',
    '  p0 *= norm.x;',
    '  p1 *= norm.y;',
    '  p2 *= norm.z;',
    '  p3 *= norm.w;',
    '  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
    '  m = m * m;',
    '  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));',
    '}',
    '',
    'void main() {',
    '  vec2 uv = vUv;',
    '  float t = uTime * 0.15;',
    '',
    '  // Mouse influence',
    '  vec2 mouseDelta = uv - uMouse;',
    '  float mouseDist = length(mouseDelta);',
    '  float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;',
    '',
    '  // Multiple noise octaves for organic flow',
    '  float n1 = snoise(vec3(uv * 2.0 + t * 0.5, t * 0.3)) * 0.5 + 0.5;',
    '  float n2 = snoise(vec3(uv * 3.0 - t * 0.3, t * 0.2 + 10.0)) * 0.5 + 0.5;',
    '  float n3 = snoise(vec3(uv * 1.5 + t * 0.2 + mouseInfluence * 2.0, t * 0.4 + 5.0)) * 0.5 + 0.5;',
    '',
    '  // Color palette - deep purples, blues, subtle golds',
    '  vec3 deepPurple = vec3(0.102, 0.020, 0.200);',
    '  vec3 darkBlue = vec3(0.039, 0.086, 0.157);',
    '  vec3 midPurple = vec3(0.176, 0.106, 0.412);',
    '  vec3 subtleGold = vec3(0.831, 0.659, 0.325);',
    '',
    '  // Blend colors using noise',
    '  vec3 color = mix(deepPurple, darkBlue, n1);',
    '  color = mix(color, midPurple, n2 * 0.6);',
    '  color = mix(color, subtleGold, pow(n3, 4.0) * 0.15 * (1.0 + mouseInfluence));',
    '',
    '  // Add subtle radial gradient',
    '  float vignette = 1.0 - smoothstep(0.2, 0.9, length(uv - 0.5));',
    '  color *= 0.7 + vignette * 0.3;',
    '',
    '  // Overall intensity',
    '  color *= 0.85;',
    '',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n');

  var uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
  });

  // Fullscreen quad
  var geometry = new THREE.PlaneGeometry(2, 2);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Mouse tracking
  document.addEventListener('mousemove', function(e) {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
  });

  // Window resize
  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // Animation loop
  var startTime = Date.now();

  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    uniforms.uTime.value = (Date.now() - startTime) * 0.001;
    uniforms.uMouse.value.set(mouse.x, mouse.y);

    renderer.render(scene, camera);
  }

  animate();
}
