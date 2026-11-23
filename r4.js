// Shared runtime for round 4 (V7-V9). Classic script (works over file://). Needs global THREE (three@0.149.0 UMD build).
// - One renderer, one fixed canvas. Pixel ratio capped at 1.5 (1.25 on small screens), adaptive downscale.
// - Single post pass: film grain + chromatic aberration + vignette (+ optional tint).
// - Scroll progress (smoothed), section progress helper, loop paused when the tab is hidden.
// - prefers-reduced-motion: no smoothing, no idle motion; renders on scroll only.
// - References layer (press R or the switch), secrets list (?secrets), toast, typed words.
(function(){

const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 760px)').matches;

function createStage(canvas, { tint = [1, 1, 1], ca = 1.0, grain = 0.08, vignette = 1.0, clear = 0x000000 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
  renderer.setClearColor(clear, 1);
  // linear output, no tone mapping: colours are art-directed directly (r149 UMD)
  let maxDpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2), dpr = maxDpr;
  const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 });
  const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const post = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: rt.texture }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uCA: { value: ca }, uGrain: { value: grain }, uVig: { value: vignette }, uTint: { value: new THREE.Vector3(...tint) }, uFlash: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: `precision highp float; varying vec2 vUv; uniform sampler2D tDiffuse; uniform float uTime,uCA,uGrain,uVig,uFlash; uniform vec2 uRes; uniform vec3 uTint;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){ vec2 c=vUv-.5; float d=dot(c,c); vec2 off=c*d*.018*uCA;
        vec3 col=vec3(texture2D(tDiffuse,vUv+off).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv-off).b);
        col*=uTint; col+=uFlash;
        float g=h(vUv*uRes+fract(uTime*7.13)*100.)-.5; col+=g*uGrain;
        col*=mix(1., smoothstep(.85,.15,d*1.6), uVig);
        gl_FragColor=vec4(col,1.); }`,
    depthTest: false, depthWrite: false
  });
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
  const stage = { renderer, rt, post, dpr: () => dpr, size: new THREE.Vector2() };
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    rt.setSize(Math.floor(w * dpr), Math.floor(h * dpr)); post.uniforms.uRes.value.set(w * dpr, h * dpr);
    stage.size.set(w, h); stage.onResize && stage.onResize(w, h);
  }
  stage.resize = resize; addEventListener('resize', resize); resize();
  stage.render = (scene, camera, t) => {
    post.uniforms.uTime.value = t;
    renderer.setRenderTarget(rt); renderer.render(scene, camera);
    renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  };
  // adaptive resolution
  // adaptive resolution, driven by the real frame interval (smoothed): below ~48 fps steps the resolution down, a steady 57+ fps steps it back up
  let avg = 16.7, n = 0, fast = 0; const floor = small ? 0.75 : Math.min(1, maxDpr); // never below native resolution on a desktop screen
  stage.budget = ms => {
    avg += (ms - avg) * 0.06; if (++n < 40) return;
    if (avg > 21 && dpr > floor) { dpr = Math.max(floor, dpr - 0.25); n = 0; avg = 16.7; fast = 0; resize(); }
    else if (avg < 17.4) { if (++fast > 300 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.25); n = 0; fast = 0; resize(); } }
    else fast = 0;
  };
  return stage;
}

/* scroll progress */
const scroll = { p: 0, s: 0, v: 0 };
let scrollH = 0; const measureScroll = () => { scrollH = document.documentElement.scrollHeight - innerHeight; }; // measured on load and resize only: reading it on every scroll event forced a layout
function readScroll() { scroll.p = scrollH > 0 ? Math.min(1, Math.max(0, scrollY / scrollH)) : 0; }
addEventListener('scroll', readScroll, { passive: true }); addEventListener('resize', measureScroll); addEventListener('load', measureScroll); measureScroll(); readScroll();
// progress of an element through the viewport: 0 when its top hits the bottom, 1 when its bottom leaves the top
function inView(el) { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height))); }
const clamp01 = x => Math.min(1, Math.max(0, x));
const seg = (x, a, b) => clamp01((x - a) / (b - a));
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/* render loop: paused when the tab is hidden; reduced motion renders on scroll/resize only */
function loop(stage, frame) {
  let last = performance.now(), raf = 0, t = 0;
  function tick(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    scroll.s += (scroll.p - scroll.s) * (rm ? 1 : Math.min(1, dt * 4.5)); scroll.v = scroll.p - scroll.s;
    frame(t, dt); stage.budget(dt * 1000);
    if (!rm && !document.hidden) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  if (rm) { addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick); }
  kick(); return kick;
}

/* references layer */
function refs() {
  const btn = document.getElementById('refsBtn');
  const set = on => { document.body.classList.toggle('refs', on); btn && btn.setAttribute('aria-pressed', on); };
  btn && btn.addEventListener('click', () => set(!document.body.classList.contains('refs')));
  addEventListener('keydown', e => { const t = e.target; if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key === 'r' || e.key === 'R') set(!document.body.classList.contains('refs')); });
}

/* toast + secrets */
let tt = 0; const got = new Set(); let list = [];
function toast(msg) { const el = document.getElementById('toast'); if (!el) return; el.textContent = msg; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 4200); }
function secrets(l) { list = l; render(); if (/[?&]secrets/.test(location.search)) document.getElementById('secrets')?.classList.add('open'); document.getElementById('secretsClose')?.addEventListener('click', () => document.getElementById('secrets').classList.remove('open')); }
function render() { const ol = document.getElementById('slist'); if (!ol) return; ol.innerHTML = list.map(([id, how, what]) => `<li class="${got.has(id) ? 'got' : ''}"><b>${how}</b><span>${what}</span></li>`).join(''); }
function found(id, msg) { const first = !got.has(id); got.add(id); render(); toast(msg + (first ? `   ${got.size}/${list.length}` : '')); }
function typed(word, fn) {
  let buf = ''; const w = word.toLowerCase();
  addEventListener('keydown', e => { const t = e.target; if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key.length !== 1) return; buf = (buf + e.key.toLowerCase()).slice(-w.length); if (buf === w) { buf = ''; fn(); } });
}

/* text reveal on scroll (Vengeance UI scroll-reveal behaviour): words fade from blur as they enter */
function reveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (rm || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  els.forEach(e => io.observe(e));
}

/* GLSL: Ashima 3D simplex noise */
const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
`;
window.R4={rm,small,createStage,scroll,inView,clamp01,seg,ease,loop,refs,toast,secrets,found,typed,reveal,NOISE};
})();
