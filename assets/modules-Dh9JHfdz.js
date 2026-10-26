import{i as e,s as t,t as n}from"./jsx-runtime-CMWfPWhZ.js";import{i as r}from"./ContactForm-DvQPpIZq.js";var i=t(e(),1),a=n(),o={bgColor:`#010b24`,colorA:`#0a2a7a`,colorB:`#1a4ac0`,colorC:`#2e6bff`,colorD:`#d8e6ff`,speed:.33,tilt:2.36,lean:.045,horizon:.28,breathe:.055,spread:1.35,curve:1.6,warp:.12,scale:.5,drift:.075,roughness:.4,lacunarity:2.05,contrast:1.35,midpoint:.5,sink:.14,glow:.45,grain:0,grainAnim:0,dither:1.4,vignette:.72,steer:.16,raise:.22,pourRadius:.55,pour:.42,smear:.6,infuse:.16,cursor:1,parallax:.002,maxDpr:1},s=`#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;
uniform vec2  iLead;
uniform float uPourRadius, uPour, uSmear, uInfuse;

uniform vec3  uBg, uColorA, uColorB, uColorC, uColorD;
uniform float uSpeed, uTilt, uLean, uHorizon, uBreathe, uSpread;
uniform float uCurve, uWarp, uScale, uDrift, uRoughness, uLacunarity;
uniform float uContrast, uMidpoint, uSink, uGlow, uGrain, uDither;
uniform float uVignette, uSteer, uRaise, uParallax;

#define OCTAVES 3

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += amp * snoise(p);
    p *= uLacunarity;
    amp *= uRoughness;
  }
  return v;
}

vec3 ramp4(float t) {
  vec3 c = mix(uColorA, uColorB, smoothstep(0.00, 0.36, t));
  c = mix(c, uColorC, smoothstep(0.32, 0.70, t));
  c = mix(c, uColorD, smoothstep(0.66, 1.00, t));
  return c;
}

float triDither(vec2 fc) {
  float a = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float b = fract(sin(dot(fc + 17.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (a + b - 1.0) / 255.0;
}

vec2 rot(vec2 p, float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c) * p; }

uniform float uGrainAnim;
float houseGrain(vec2 fc) {
  uvec2 q = uvec2(fc) * uvec2(1597334677u, 3812015801u)
          + uint(floor(iTime * 24.0 * uGrainAnim)) * 2654435769u;
  uint n = q.x ^ q.y; n = n * 1664525u + 1013904223u; n ^= n >> 16u; n *= 2246822519u; n ^= n >> 13u;
  float a = float(n & 0xffffu) / 65535.0;
  n *= 3266489917u; n ^= n >> 16u;
  float b = float(n & 0xffffu) / 65535.0;
  return a + b - 1.0;
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
  float t = iTime * uSpeed;

  vec2 tfD = uv - iMouse;
  vec2 tfStroke = iLead - iMouse;
  float tfR2 = max(1e-4, uPourRadius * uPourRadius);
  float tfWell = exp(-dot(tfD, tfD) / tfR2);
  float tfWide = exp(-dot(tfD, tfD) / (tfR2 * 3.0));
  vec2 tfPour = -tfD * tfWell * uPour + tfStroke * tfWide * uSmear;
  float tfInfuse = tfWide * uInfuse * (0.55 + 0.45 * smoothstep(0.0, 0.12, length(tfStroke)));
  vec2 p = uv + tfPour - iMouse * uParallax;

  float a = uTilt + sin(t * 0.11) * uLean + iMouse.x * uSteer;
  float axis = dot(p, vec2(cos(a), sin(a)));
  float horizon = uHorizon + sin(t * 0.08 + 1.9) * uBreathe - iMouse.y * uRaise;

  float air = fbm(p * uScale + vec2(t * uDrift, -t * uDrift * 0.6));
  float h = clamp(0.5 + (axis - horizon) * uSpread + air * uWarp + tfInfuse, 0.0, 1.0);

  float f = pow(h, max(0.05, uCurve));
  f = clamp((f - uMidpoint) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = ramp4(f);
  col += uColorD * uGlow * pow(f, 4.0);
  col = mix(uBg, col, smoothstep(0.0, max(0.01, uSink), f) * 0.90 + 0.10);

  col *= 1.0 - uVignette * dot(uv, uv);
  { float hgL = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
    col += houseGrain(gl_FragCoord.xy) * uGrain * mix(1.0, 4.0 * hgL * (1.0 - hgL), 0.6); }
  col += triDither(gl_FragCoord.xy) * uDither;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;function l(e){let t=parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function u({still:e=!1,followPointer:t=!0,onReady:n}){let r=(0,i.useRef)();return(0,i.useEffect)(()=>{let i=r.current,a=i.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!a){i.hidden=!0,n?.();return}let u=(e,t)=>{let n=a.createShader(e);if(a.shaderSource(n,t),a.compileShader(n),!a.getShaderParameter(n,a.COMPILE_STATUS))throw Error(a.getShaderInfoLog(n));return n},d;try{if(d=a.createProgram(),a.attachShader(d,u(a.VERTEX_SHADER,s)),a.attachShader(d,u(a.FRAGMENT_SHADER,c)),a.linkProgram(d),!a.getProgramParameter(d,a.LINK_STATUS))throw Error(a.getProgramInfoLog(d))}catch{i.hidden=!0,n?.();return}a.useProgram(d),a.bindVertexArray(a.createVertexArray());let f={},p=e=>e in f?f[e]:f[e]=a.getUniformLocation(d,e),m=(e,t)=>a.uniform1f(p(e),t),h=(e,t,n)=>a.uniform2f(p(e),t,n),g=(e,t)=>{let n=l(t);a.uniform3f(p(e),n[0],n[1],n[2])},_=()=>{let e=Math.min(window.devicePixelRatio||1,o.maxDpr),t=Math.max(1,Math.round(i.clientWidth*e)),n=Math.max(1,Math.round(i.clientHeight*e));(i.width!==t||i.height!==n)&&(i.width=t,i.height=n),a.viewport(0,0,t,n),h(`iResolution`,t,n)};g(`uBg`,o.bgColor),g(`uColorA`,o.colorA),g(`uColorB`,o.colorB),g(`uColorC`,o.colorC),g(`uColorD`,o.colorD);for(let[e,t]of[[`uSpeed`,`speed`],[`uTilt`,`tilt`],[`uLean`,`lean`],[`uHorizon`,`horizon`],[`uBreathe`,`breathe`],[`uSpread`,`spread`],[`uCurve`,`curve`],[`uWarp`,`warp`],[`uScale`,`scale`],[`uDrift`,`drift`],[`uRoughness`,`roughness`],[`uLacunarity`,`lacunarity`],[`uContrast`,`contrast`],[`uMidpoint`,`midpoint`],[`uSink`,`sink`],[`uGlow`,`glow`],[`uGrain`,`grain`],[`uGrainAnim`,`grainAnim`],[`uDither`,`dither`],[`uVignette`,`vignette`],[`uSteer`,`steer`],[`uRaise`,`raise`],[`uParallax`,`parallax`],[`uPourRadius`,`pourRadius`],[`uPour`,`pour`],[`uSmear`,`smear`],[`uInfuse`,`infuse`]])m(e,o[t]);_();let v={x:0,y:0,ax:0,ay:0,tx:0,ty:0},y=e=>{let t=i.clientWidth/i.clientHeight;v.tx=(e.clientX/i.clientWidth-.5)*t,v.ty=.5-e.clientY/i.clientHeight};t&&o.cursor&&!e&&window.addEventListener(`pointermove`,y,{passive:!0});let b=!1,x=()=>{b||(b=!0,requestAnimationFrame(()=>{b=!1,_(),e&&S(0)}))};window.addEventListener(`resize`,x,{passive:!0});let S=e=>{m(`iTime`,e),h(`iMouse`,v.x,v.y),h(`iLead`,v.ax,v.ay),a.drawArrays(a.TRIANGLES,0,3)},C=!0,w=new IntersectionObserver(e=>C=e[0].isIntersecting,{threshold:0});w.observe(i);let T,E=performance.now(),D=12,O=e=>{T=requestAnimationFrame(O);let t=e-E;if(E=e,!C||document.hidden)return;let n=t>50?50:t<4.167?4.167:t,r=n>36.7?2.2:n*.06;D+=n*.001;let i=.105*r,a=.043*r;v.ax+=(v.tx-v.ax)*i,v.ay+=(v.ty-v.ay)*i,v.x+=(v.ax-v.x)*a,v.y+=(v.ay-v.y)*a,S(D)};return S(D),n?.(),e||(T=requestAnimationFrame(O)),()=>{cancelAnimationFrame(T),w.disconnect(),window.removeEventListener(`resize`,x),window.removeEventListener(`pointermove`,y),a.deleteProgram(d)}},[]),(0,a.jsx)(`canvas`,{ref:r,className:`firmament`,"aria-hidden":`true`})}var d={web:`M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01M7 13h6M7 16h4`,ads:`M4 10v4h3l6 4V6L7 10H4zM16.5 9.5a3.5 3.5 0 010 5M19 7a7 7 0 010 10`,agent:`M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM5 11a7 7 0 0014 0M12 18v3M8.5 21h7`,funnel:`M3 4h18l-7 8v6l-4 2v-8L3 4z`,video:`M3 6h13v12H3zM16 10l5-3v10l-5-3M7 3v3M12 3v3`,flow:`M4 6h5v4H4zM15 14h5v4h-5zM9 8h3a2 2 0 012 2v4a2 2 0 002 2M15 6h5v4h-5zM12 8h3`,chart:`M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6M20 16v-9`,crm:`M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M16 4.5a3 3 0 010 5.8M18 14a6 6 0 013 6`};function f({name:e}){return(0,a.jsx)(`svg`,{className:`icon`,viewBox:`0 0 24 24`,"aria-hidden":`true`,focusable:`false`,children:(0,a.jsx)(`path`,{d:d[e],fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})})}var p={websites:{short:`AI Websites`,icon:`web`,benefits:[`Visitors get answers at any hour`,`Every enquiry arrives in one place`,`A site that looks as capable as your business`]},advertising:{short:`Advertising`,icon:`ads`,benefits:[`Ads aimed at people likely to need you`,`Every response gets a timely follow-up`,`Past contacts hear from you again`]},agents:{short:`Voice & Chat Agents`,icon:`agent`,benefits:[`Calls and messages answered after hours`,`Prospects qualified before your team steps in`,`People handle the conversations that need a person`]},funnels:{short:`Sales Funnels`,icon:`funnel`,benefits:[`Visitors always know the next step`,`Interest turns into booked appointments`,`Offers you can test and improve`]},video:{short:`Video & Clipping`,icon:`video`,benefits:[`A steady presence on social platforms`,`More value from recordings you already have`,`Less editing time for your team`]},automations:{short:`Automations`,icon:`flow`,benefits:[`Fewer repetitive, manual tasks`,`Reminders and follow-ups that never slip`,`Your tools share information automatically`]},analytics:{short:`Analytics`,icon:`chart`,benefits:[`See which channels bring customers`,`Spot where prospects drop off`,`Decide with your own numbers in view`]},crm:{short:`CRM & Sales`,icon:`crm`,benefits:[`Every lead and deal in one pipeline`,`Missed calls get a text back`,`Your team always knows the next step`]}},m=r.map(e=>({...e,...p[e.id]}));export{f as n,u as r,m as t};