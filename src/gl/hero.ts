// "Living contour lines" — a single fullscreen fragment shader, no library.
import type { Tier } from '../core/env';

const FRAG_BODY = /* glsl */ `
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uIntro;
uniform float uPulse;
uniform vec2 uPulsePos;
uniform vec4 uTextRect;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for(int i=0;i<OCTAVES;i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; } return s; }

vec3 ramp(float t){
  vec3 deep=vec3(.090,.059,.588), ultra=vec3(.169,.137,.902), violet=vec3(.353,.180,.961),
       pink=vec3(1.,.302,.616), sun=vec3(1.,.847,.290);
  vec3 c = mix(deep, ultra, smoothstep(.00,.35,t));
  c = mix(c, violet, smoothstep(.35,.55,t));
  c = mix(c, pink,   smoothstep(.62,.78,t));
  return mix(c, sun, smoothstep(.84,.95,t));
}

vec4 shade(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float m = min(uRes.x, uRes.y);
  vec2 p  = (gl_FragCoord.xy - .5*uRes) / m;
  float t = uTime * .03;

  vec2 q = p * 1.6 + vec2(t, -t*.6);
  q += .35 * vec2(fbm(q + 3.1), fbm(q - 7.7));
  float h = fbm(q) * .78 + .08;

  vec2 mp = (uMouse*uRes - .5*uRes) / m;
  float d = length(p - mp);
  h += .40 * exp(-d*d*7.0);

  vec2 pp = (uPulsePos*uRes - .5*uRes) / m;
  float dp = length(p - pp);
  h += .05 * sin(38.0*(dp - uPulse*.55)) * exp(-uPulse*2.2) * smoothstep(.9, .0, dp);

  h += smoothstep(.4, 1.0, uScroll) * .35;

  float mask = 1.0 - smoothstep(.65, 1.0, length((uv - uTextRect.xy) / uTextRect.zw));
  h = mix(h, min(h, .52), mask * (1.0 - smoothstep(.3,.6,uScroll)));
  h *= uIntro;

  const float N = 14.0;
  float lv = h * N;
  vec3 col = ramp(floor(lv) / N);
  float f  = fract(lv), w = fwidth(lv);
  float line  = 1.0 - smoothstep(w*.6, w*1.6, min(f, 1.0 - f));
  float major = 1.0 - step(.5, mod(floor(lv + .5), 5.0));
  col = mix(col, vec3(.933,.945,.984), line * (.26 + .38*major));
  col += (hash(gl_FragCoord.xy + uTime) - .5) * .025;
  return vec4(col, 1.0);
}
`;

const VERT2 = `#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const VERT1 = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const frag2 = (oct: number) => `#version 300 es
precision highp float;
#define OCTAVES ${oct}
out vec4 outColor;
${FRAG_BODY}
void main(){ outColor = shade(); }`;
const frag1 = (oct: number) => `#extension GL_OES_standard_derivatives : enable
precision highp float;
#define OCTAVES ${oct}
${FRAG_BODY}
void main(){ gl_FragColor = shade(); }`;

type GL = WebGLRenderingContext | WebGL2RenderingContext;

export interface HeroGL {
  setIntro(v: number): void;
  setScroll(v: number): void;
  pulse(x: number, y: number): void;
  setTarget(x: number, y: number): void;
  destroy(): void;
}

export function startHeroGL(canvas: HTMLCanvasElement, tier: Tier, textEls: HTMLElement[]): HeroGL | null {
  let gl: GL | null = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  let isGL2 = !!gl;
  if (!gl) {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false }) as WebGLRenderingContext | null;
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return null;
    isGL2 = false;
  }
  const g = gl;

  let low = tier !== 'high';
  const touch = matchMedia('(hover: none)').matches;
  let program: WebGLProgram | null = null;
  let loc: Record<string, WebGLUniformLocation | null> = {};

  const compile = (oct: number) => {
    const sh = (type: number, src: string) => {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    const p = g.createProgram()!;
    g.attachShader(p, sh(g.VERTEX_SHADER, isGL2 ? VERT2 : VERT1));
    g.attachShader(p, sh(g.FRAGMENT_SHADER, isGL2 ? frag2(oct) : frag1(oct)));
    g.bindAttribLocation(p, 0, 'aPos');
    g.linkProgram(p);
    if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) ?? 'link');
    if (program) g.deleteProgram(program);
    program = p;
    g.useProgram(p);
    loc = {};
    for (const n of ['uRes', 'uTime', 'uMouse', 'uScroll', 'uIntro', 'uPulse', 'uPulsePos', 'uTextRect']) loc[n] = g.getUniformLocation(p, n);
  };

  const setupGeometry = () => {
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
  };

  try {
    compile(low ? 3 : 5);
    setupGeometry();
  } catch (e) {
    console.warn('[hero] WebGL init failed, keeping CSS fallback', e);
    return null;
  }

  const state = {
    mouse: [0.72, 0.34],
    target: [0.72, 0.34],
    interacted: false,
    intro: 0,
    scroll: 0,
    pulse: 99,
    pulsePos: [0.5, 0.5],
    textRect: [0.3, 0.3, 0.4, 0.3],
    t0: performance.now(),
    paused: 0, // accumulated paused time
    pausedAt: 0,
  };

  const size = () => {
    const dpr = low ? 1 : Math.min(devicePixelRatio || 1, touch ? 1.5 : 2);
    const scale = low ? 0.5 : 1;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    g.viewport(0, 0, w, h);
    // ellipse around H1 + lead, in uv (y up)
    const cr = canvas.getBoundingClientRect();
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    textEls.forEach((el) => {
      const rr = el.getBoundingClientRect();
      if (!rr.width) return;
      l = Math.min(l, rr.left); t = Math.min(t, rr.top); r = Math.max(r, rr.right); b = Math.max(b, rr.bottom);
    });
    if (l < Infinity && cr.width) {
      const cx = ((l + r) / 2 - cr.left) / cr.width;
      const cy = 1 - ((t + b) / 2 - cr.top) / cr.height;
      const rx = ((r - l) / 2 / cr.width) * 1.25 + 0.04;
      const ry = ((b - t) / 2 / cr.height) * 1.35 + 0.05;
      state.textRect = [cx, cy, rx, ry];
    }
  };
  size();

  let raf = 0;
  let visible = true;
  let frames = 0;
  let acc = 0;
  let last = performance.now();
  let stopped = false;
  let firstFrame = true;
  let skip = false;

  const draw = (now: number) => {
    const time = (now - state.t0 - state.paused) / 1000;
    if (!state.interacted) {
      state.target = [0.72 + 0.14 * Math.sin(time * 0.21), 0.34 + 0.1 * Math.cos(time * 0.17)];
    }
    state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.06;
    state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.06;
    state.pulse += 1 / 60;
    g.uniform2f(loc.uRes, canvas.width, canvas.height);
    g.uniform1f(loc.uTime, time + 12);
    g.uniform2f(loc.uMouse, state.mouse[0], state.mouse[1]);
    g.uniform1f(loc.uScroll, state.scroll);
    g.uniform1f(loc.uIntro, state.intro);
    g.uniform1f(loc.uPulse, state.pulse);
    g.uniform2f(loc.uPulsePos, state.pulsePos[0], state.pulsePos[1]);
    g.uniform4f(loc.uTextRect, state.textRect[0], state.textRect[1], state.textRect[2], state.textRect[3]);
    g.drawArrays(g.TRIANGLES, 0, 3);
    if (firstFrame) {
      firstFrame = false;
      canvas.classList.add('is-on');
    }
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (low && (skip = !skip)) return; // ~30 fps on weak devices
    const dt = now - last;
    last = now;
    draw(now);
    // watchdog: degrade if the first 60 frames are slow
    if (frames < 60) {
      if (frames > 2) acc += dt;
      frames++;
      if (frames === 60) {
        const avg = acc / 57;
        if (!low && avg > 24) {
          low = true;
          try { compile(3); } catch { /* keep current */ }
          size();
          frames = 0; acc = 0;
        } else if (low && avg > 33 * (tier === 'high' ? 1 : 2)) {
          stopped = true;
          cancelAnimationFrame(raf);
        }
      }
    }
  };

  const run = () => {
    if (stopped || raf || !visible || document.visibilityState !== 'visible') return;
    if (state.pausedAt) {
      state.paused += performance.now() - state.pausedAt;
      state.pausedAt = 0;
    }
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const pause = () => {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
    state.pausedAt = performance.now();
  };

  if (tier === 'static') {
    state.intro = 1;
    draw(state.t0);
  } else {
    run();
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) run(); else pause();
  });
  io.observe(canvas);
  const onVis = () => (document.visibilityState === 'visible' ? run() : pause());
  document.addEventListener('visibilitychange', onVis);

  let rt = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      size();
      if (tier === 'static') draw(state.t0);
    }, 150);
  });
  ro.observe(canvas);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    pause();
    canvas.classList.remove('is-on');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    try {
      compile(low ? 3 : 5);
      setupGeometry();
      firstFrame = true;
      run();
    } catch { /* stay on CSS fallback */ }
  });

  return {
    setIntro: (v) => { state.intro = v; if (tier === 'static') draw(state.t0); },
    setScroll: (v) => { state.scroll = v; },
    pulse: (x, y) => { state.pulse = 0; state.pulsePos = [x, y]; },
    setTarget: (x, y) => { state.interacted = true; state.target = [x, y]; },
    destroy: () => { pause(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); },
  };
}
