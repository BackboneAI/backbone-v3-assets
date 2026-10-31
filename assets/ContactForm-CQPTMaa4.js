import{a as e,c as t,t as n}from"./jsx-runtime-DVMKdlFX.js";var r=Object.freeze({absoluteGateDb:-55,initialNoiseFloorDb:-60,minimumNoiseFloorDb:-96,maximumNoiseFloorDb:-24,openMarginDb:11,closeMarginDb:8,hangoverSeconds:.2,noiseWindowSeconds:6,stableNoiseWindowSeconds:.6,stableNoiseMinimumSeconds:.3,stableNoiseDeviationDb:1.25,stableNoiseCeilingDb:-28,noiseRiseSeconds:3,stableNoiseRiseSeconds:.35,activeNoiseRiseSeconds:12,noiseFallSeconds:.12,referenceWindowSeconds:4,initialSpeechReferenceDb:-22,minimumSpeechReferenceDb:-32,maximumSpeechReferenceDb:-12,minimumSpeechRangeDb:12,louderReferenceSeconds:.65,quieterReferenceSeconds:1.4,referencePercentile:.95,outputGamma:1.6,warmupSeconds:0}),i=[`absoluteGateDb`,`initialNoiseFloorDb`,`minimumNoiseFloorDb`,`maximumNoiseFloorDb`,`stableNoiseCeilingDb`,`initialSpeechReferenceDb`,`minimumSpeechReferenceDb`,`maximumSpeechReferenceDb`],a=[`noiseWindowSeconds`,`stableNoiseWindowSeconds`,`noiseRiseSeconds`,`stableNoiseRiseSeconds`,`activeNoiseRiseSeconds`,`noiseFallSeconds`,`referenceWindowSeconds`,`minimumSpeechRangeDb`,`louderReferenceSeconds`,`quieterReferenceSeconds`,`outputGamma`],o=[`openMarginDb`,`closeMarginDb`,`hangoverSeconds`,`stableNoiseMinimumSeconds`,`stableNoiseDeviationDb`,`warmupSeconds`];function s(e,t,n){return Math.min(n,Math.max(t,e))}function c(e,t,n,r){return n>0?e+(t-e)*(1-Math.exp(-n/r)):e}function l(e,t){if(e.length===0)return NaN;let n=[...e].sort((e,t)=>e-t),r=(n.length-1)*s(t,0,1),i=Math.floor(r),a=Math.ceil(r),o=r-i;return n[i]*(1-o)+n[a]*o}function u(e){if(e.length<2)return 1/0;let t=e.reduce((e,t)=>e+t,0)/e.length,n=e.reduce((e,n)=>{let r=n-t;return e+r*r},0)/e.length;return Math.sqrt(n)}function d(e,t,n,r,i=!0){let a=e[t],o=i?a>=n:a>n;if(!Number.isFinite(a)||!o||a>r){let e=i?`between`:`greater than`,a=i?` and ${r}`:` and no more than ${r}`;throw RangeError(`${t} must be ${e} ${n}${a}.`)}}function f(e){if(!e||typeof e!=`object`||Array.isArray(e))throw TypeError(`Audio calibration options must be an object.`);for(let t of Object.keys(e))if(!Object.hasOwn(r,t))throw TypeError(`${t} is not a supported audio calibration option.`);let t={...r,...e};for(let e of i)d(t,e,-120,0);for(let e of a)d(t,e,0,120,!1);for(let e of o)d(t,e,0,120);if(d(t,`referencePercentile`,0,1),t.minimumNoiseFloorDb>t.initialNoiseFloorDb||t.initialNoiseFloorDb>t.maximumNoiseFloorDb)throw RangeError(`initialNoiseFloorDb must be between the minimum and maximum noise floor.`);if(t.minimumSpeechReferenceDb>t.initialSpeechReferenceDb||t.initialSpeechReferenceDb>t.maximumSpeechReferenceDb)throw RangeError(`initialSpeechReferenceDb must be between the minimum and maximum speech reference.`);if(t.closeMarginDb>t.openMarginDb)throw RangeError(`closeMarginDb must not exceed openMarginDb.`);if(t.stableNoiseMinimumSeconds>t.stableNoiseWindowSeconds)throw RangeError(`stableNoiseMinimumSeconds must not exceed stableNoiseWindowSeconds.`);return Object.freeze(t)}function p(e){if(!e?.length)return-120;let t=0;for(let n=0;n<e.length;n+=1)t+=e[n];t/=e.length;let n=0;for(let r=0;r<e.length;r+=1){let i=e[r]-t;n+=i*i}let r=Math.sqrt(n/e.length);return s(20*Math.log10(Math.max(r,1e-6)),-120,0)}var m=class{constructor(e={}){this.options=f(e),this.reset()}reset(){let{initialNoiseFloorDb:e,initialSpeechReferenceDb:t}=this.options;this.time=0,this.lastTimestamp=null,this.noiseFloorDb=e,this.speechReferenceDb=t,this.active=!1,this.belowGateSeconds=0,this.noiseLevels=[],this.speechLevels=[],this.last=Object.freeze({level:0,levelDb:-120,noiseFloorDb:this.noiseFloorDb,gateOpenDb:this.options.absoluteGateDb,gateCloseDb:this.options.absoluteGateDb,speechReferenceDb:this.speechReferenceDb,active:!1,stableNoise:!1,warmingUp:this.options.warmupSeconds>0})}process(e,t){return this.processDb(p(e),t)}processDb(e,t){let n=Number(t),r=Number.isFinite(n),i=1/60;r&&this.lastTimestamp!==null&&(i=s(n-this.lastTimestamp,1/240,.1)),r&&(this.lastTimestamp=n),this.time+=i;let a=Number(e),o=s(Number.isFinite(a)?a:-120,-120,0);this.noiseLevels.push({time:this.time,value:o});let d=this.time-this.options.noiseWindowSeconds;for(;this.noiseLevels[0]?.time<d;)this.noiseLevels.shift();let f=this.time-this.options.stableNoiseWindowSeconds,p=this.noiseLevels.filter(e=>e.time>=f),m=p.map(e=>e.value),h=(p.length>1?p.at(-1).time-p[0].time:0)>=this.options.stableNoiseMinimumSeconds&&o<=this.options.stableNoiseCeilingDb&&u(m)<=this.options.stableNoiseDeviationDb,g=s(l(this.noiseLevels.map(e=>e.value),.2),this.options.minimumNoiseFloorDb,this.options.maximumNoiseFloorDb),_=g<this.noiseFloorDb?this.options.noiseFallSeconds:h?this.options.stableNoiseRiseSeconds:this.active?this.options.activeNoiseRiseSeconds:this.options.noiseRiseSeconds;this.noiseFloorDb=c(this.noiseFloorDb,g,i,_);let v=Math.max(this.options.absoluteGateDb,this.noiseFloorDb+this.options.openMarginDb),y=Math.max(this.options.absoluteGateDb-3,this.noiseFloorDb+this.options.closeMarginDb);this.active?o>=y?this.belowGateSeconds=0:(this.belowGateSeconds+=i,this.belowGateSeconds>=this.options.hangoverSeconds&&(this.active=!1,this.belowGateSeconds=0)):o>=v&&(this.active=!0,this.belowGateSeconds=0),this.active&&!h&&o>=v&&this.speechLevels.push({time:this.time,value:o});let b=this.time-this.options.referenceWindowSeconds;for(;this.speechLevels[0]?.time<b;)this.speechLevels.shift();if(this.speechLevels.length>=12){let e=Math.min(this.options.maximumSpeechReferenceDb,Math.max(this.options.minimumSpeechReferenceDb,v+this.options.minimumSpeechRangeDb)),t=s(l(this.speechLevels.map(e=>e.value),this.options.referencePercentile),e,this.options.maximumSpeechReferenceDb),n=t>this.speechReferenceDb?this.options.louderReferenceSeconds:this.options.quieterReferenceSeconds;this.speechReferenceDb=c(this.speechReferenceDb,t,i,n)}let x=Math.max(this.options.minimumSpeechRangeDb,this.speechReferenceDb-v),S=s((o-v)/x,0,1),C=this.time<this.options.warmupSeconds,w=this.active&&!h&&!C?S**+this.options.outputGamma:0;return this.last=Object.freeze({level:w,levelDb:o,noiseFloorDb:this.noiseFloorDb,gateOpenDb:v,gateCloseDb:y,speechReferenceDb:this.speechReferenceDb,active:this.active,stableNoise:h,warmingUp:C}),w}},h=new WeakMap;function g(e){return typeof AnalyserNode<`u`&&e instanceof AnalyserNode}function _(e){try{if(e.crossOrigin===`anonymous`||e.crossOrigin===`use-credentials`)return!0;let t=e.currentSrc||e.src;return t?new URL(t,location.href).origin===location.origin:!1}catch{return!1}}function v(e,t,n){let r=new Float32Array(e.fftSize),i=typeof e.getFloatTimeDomainData==`function`?null:new Uint8Array(e.fftSize),a=new m(n),o=0,s=()=>{if(o=requestAnimationFrame(s),i){e.getByteTimeDomainData(i);for(let e=0;e<r.length;e+=1)r[e]=(i[e]-128)/128}else e.getFloatTimeDomainData(r);t(a.process(r,performance.now()/1e3))};return o=requestAnimationFrame(s),()=>{cancelAnimationFrame(o),t(0)}}function y(e,t,n={}){if(typeof t!=`function`)throw TypeError(`setLevel must be a function`);let{calibration:r}=n;if(g(e))return v(e,t,r);if(!(e instanceof HTMLMediaElement))throw TypeError(`Expected an HTMLMediaElement or AnalyserNode`);if(!_(e))throw Error(`Cross-origin media requires a compatible CORS response before it can drive the orb.`);let i=h.get(e);if(!i){let t=new AudioContext,n=t.createMediaElementSource(e),r=t.createBiquadFilter(),a=t.createAnalyser(),o=t.createGain();r.type=`highpass`,r.frequency.value=80,r.Q.value=.707,a.fftSize=1024,a.smoothingTimeConstant=0,o.gain.value=0,n.connect(t.destination),n.connect(r),r.connect(a),a.connect(o),o.connect(t.destination),i={analyser:a,analysisMonitor:o,context:t,highPass:r,mediaSource:n},h.set(e,i)}return i.context.resume(),v(i.analyser,t,r)}async function b(e,t={}){if(typeof e!=`function`)throw TypeError(`setLevel must be a function`);if(!navigator.mediaDevices?.getUserMedia)throw Error(`Microphone capture is unavailable in this browser.`);let n=t.constraints??{audio:{echoCancellation:{ideal:!0},noiseSuppression:{ideal:!0},autoGainControl:{ideal:!1},channelCount:{ideal:1}}},r=await navigator.mediaDevices.getUserMedia(n),i=new AudioContext,a=i.createMediaStreamSource(r),o=i.createBiquadFilter(),s=i.createAnalyser(),c=i.createGain();o.type=`highpass`,o.frequency.value=80,o.Q.value=.707,s.fftSize=1024,s.smoothingTimeConstant=0,c.gain.value=0,a.connect(o),o.connect(s),s.connect(c),c.connect(i.destination),await i.resume();let l=v(s,e,{warmupSeconds:.35,...t.calibration});return()=>{l(),a.disconnect(),o.disconnect(),s.disconnect(),c.disconnect(),r.getTracks().forEach(e=>e.stop()),i.close()}}function x(e){let t=h.get(e);t&&(h.delete(e),t.mediaSource.disconnect(),t.highPass.disconnect(),t.analyser.disconnect(),t.analysisMonitor.disconnect(),t.context.close())}function S(e){return{phase:e,audioSmooth:0,audioFast:0,spinDir:1,spinVel:0,prevA:0,flipQueued:!1,oscSign:1,spin:e*3.7,lastT:null}}function C(e,t,n,r=void 0){let i=e.lastT===null?0:Math.min(.1,Math.max(0,t-e.lastT));e.lastT=t;let a=Math.min(1,Math.max(0,n)),o=Math.min(2,Math.max(0,r?.speed??1)),s=Math.min(2,Math.max(0,r?.drift??1)),c=a>e.audioSmooth?.11:.3;e.audioSmooth+=(a-e.audioSmooth)*(i>0?1-Math.exp(-i/c):0);let l=a>e.audioFast?.04:.18;e.audioFast+=(a-e.audioFast)*(i>0?1-Math.exp(-i/l):0);let u=6.31*e.phase%1,d=s*.35*Math.sin(t*(.11+.08*(2.17*e.phase%1))+e.phase),f=Math.sin(t*(.45+.2*u)+e.phase);Math.sign(f)!==e.oscSign&&(e.oscSign=Math.sign(f),e.flipQueued=!0),e.flipQueued&&e.audioFast<.18&&(e.spinDir=-e.spinDir,e.flipQueued=!1);let p=o*(.65*(.65+.7*u)*(1+d)+e.spinDir*e.audioFast*2.2);e.spinVel+=(p-e.spinVel)*(i>0?1-Math.exp(-i/.35):0);let m=Math.max(0,e.audioFast-e.prevA);return e.prevA=e.audioFast,e.spinVel+=e.spinDir*Math.min(6*m,1.4)*i*14*o,e.spin+=e.spinVel*i,e}var w=Object.freeze({spiral:0,nebula:1,core:2,"deep-field":3}),ee=Object.freeze({enabled:!1,verticalTravel:0,scale:1,durationSeconds:0,delaySeconds:0}),T=Object.freeze({enabled:!0,verticalTravel:8,scale:1,durationSeconds:7,delaySeconds:0}),te=Object.freeze({detail:1,glow:1,intensity:1}),ne=Object.freeze({drift:1,speed:1}),E=Object.freeze({brightness:1,motion:1,pulse:1}),re=Object.freeze([0,0,0]);function D({accentColors:e,ambientMotion:t=ee,archetype:n,baseColor:r,lensStrength:i,phase:a,referenceDiameter:o=264}){return Object.freeze({accentColors:Object.freeze([...e]),ambientMotion:Object.freeze({...t}),archetype:n,baseColor:r,lensStrength:i??(o>=48?.4:0),phase:a,referenceDiameter:o})}var O=`core-teal-01`;Object.freeze([`core`,`spiral`,`nebula`,`deep-field`]);var k=Object.freeze({"core-teal-01":D({archetype:`core`,phase:4.6,baseColor:`#07262B`,accentColors:[`#00C2A8`,`#38E1FF`,`#FFC65C`],referenceDiameter:264,ambientMotion:{...T,verticalTravel:10}}),"spiral-pink-01":D({archetype:`spiral`,phase:6.05,baseColor:`#2A0F22`,accentColors:[`#FF7ECB`,`#D14FFF`,`#FFDCF2`],referenceDiameter:244,ambientMotion:{enabled:!0,verticalTravel:5,scale:1.03,durationSeconds:6.5,delaySeconds:0}}),"nebula-pink-01":D({archetype:`nebula`,phase:4.083,baseColor:`#241627`,accentColors:[`#FFC9E0`,`#E4A8FF`,`#FFE9F4`],referenceDiameter:186,ambientMotion:{enabled:!0,verticalTravel:5,scale:1.03,durationSeconds:7.8,delaySeconds:.4}}),"spiral-cyan-01":D({archetype:`spiral`,phase:1.285,baseColor:`#0A1B2E`,accentColors:[`#38BDF8`,`#0E7BD1`,`#CFF2FF`],referenceDiameter:150,ambientMotion:{enabled:!0,verticalTravel:5,scale:1.03,durationSeconds:9.1,delaySeconds:.8}}),"spiral-cyan-02":D({archetype:`spiral`,phase:2.502,baseColor:`#101B2E`,accentColors:[`#7DBED4`,`#6E8BFF`,`#A24DFF`],referenceDiameter:208,ambientMotion:{...T,verticalTravel:9}}),"nebula-violet-01":D({archetype:`nebula`,phase:1.995,baseColor:`#1C0A2B`,accentColors:[`#A24DFF`,`#FF4DD8`,`#6E8BFF`],referenceDiameter:260,ambientMotion:{...T,verticalTravel:9}}),"core-blue-01":D({archetype:`core`,phase:5.016,baseColor:`#131A2E`,accentColors:[`#2563EB`,`#FF2D87`,`#FFD086`],referenceDiameter:42,lensStrength:0}),"spiral-orange-01":D({archetype:`spiral`,phase:2.289,baseColor:`#5C4030`,accentColors:[`#D86A3D`,`#FFB873`,`#FFE3C2`],referenceDiameter:42,lensStrength:0}),"nebula-cyan-01":D({archetype:`nebula`,phase:.432,baseColor:`#2E4250`,accentColors:[`#7DBED4`,`#C5A8E8`,`#F4F4F8`],referenceDiameter:42,lensStrength:0}),"core-cyan-01":D({archetype:`core`,phase:1.573,baseColor:`#0A2438`,accentColors:[`#3DA5D9`,`#5FC9D8`,`#A6E5E5`],referenceDiameter:42,lensStrength:0}),"core-lime-01":D({archetype:`core`,phase:1.542,baseColor:`#1A3A20`,accentColors:[`#7BAE48`,`#A8B85C`,`#F4E4A8`],referenceDiameter:42,lensStrength:0}),"nebula-orange-01":D({archetype:`nebula`,phase:.108,baseColor:`#301608`,accentColors:[`#FFB25C`,`#FF7E45`,`#FFE9CE`]}),"core-blue-02":D({archetype:`core`,phase:4.401,baseColor:`#0E1A34`,accentColors:[`#5C8DFF`,`#3452D9`,`#DCE8FF`]}),"deep-field-cyan-01":D({archetype:`deep-field`,phase:5.402,baseColor:`#0F2024`,accentColors:[`#5FB7C4`,`#33808F`,`#DDF4F7`]}),"deep-field-green-01":D({archetype:`deep-field`,phase:1.89,baseColor:`#0C2414`,accentColors:[`#57D98A`,`#2FA05C`,`#DFFBE9`]}),"core-red-01":D({archetype:`core`,phase:1.577,baseColor:`#2A0A10`,accentColors:[`#FF3B4E`,`#B01C3A`,`#FF9860`]}),"core-orange-01":D({archetype:`core`,phase:.287,baseColor:`#301004`,accentColors:[`#FF7A18`,`#FFB340`,`#FF4E2A`]}),"deep-field-blue-01":D({archetype:`deep-field`,phase:2.619,baseColor:`#0E1230`,accentColors:[`#8FA8FF`,`#5B6CFF`,`#E8ECFF`]}),"nebula-blue-01":D({archetype:`nebula`,phase:.484,baseColor:`#1B1E33`,accentColors:[`#C7CFFF`,`#9FB4E8`,`#F2F4FF`]}),"spiral-violet-01":D({archetype:`spiral`,phase:5.961,baseColor:`#221434`,accentColors:[`#C084FC`,`#F0A6FF`,`#FFD1EC`]}),"deep-field-yellow-01":D({archetype:`deep-field`,phase:2.497,baseColor:`#171310`,accentColors:[`#E8C98A`,`#B08A50`,`#FFF2D8`]}),"core-yellow-01":D({archetype:`core`,phase:.224,baseColor:`#2E1E04`,accentColors:[`#FFD54A`,`#FFB300`,`#FFF3B0`]}),"core-orange-02":D({archetype:`core`,phase:4.701,baseColor:`#2E1408`,accentColors:[`#FF8A4C`,`#FFC24B`,`#FF5E62`]}),"deep-field-teal-01":D({archetype:`deep-field`,phase:1.778,baseColor:`#0A2220`,accentColors:[`#63D8C2`,`#2E9E8C`,`#DFFCF4`]}),"spiral-cyan-03":D({archetype:`spiral`,phase:3.465,baseColor:`#101632`,accentColors:[`#4CC9F0`,`#7B5CFF`,`#B8F1FF`]}),"spiral-blue-01":D({archetype:`spiral`,phase:1.258,baseColor:`#141B26`,accentColors:[`#7FA6C9`,`#4A7196`,`#DCE8F2`]}),"spiral-cyan-04":D({archetype:`spiral`,phase:.825,baseColor:`#0E2030`,accentColors:[`#4FC3F7`,`#8BE38B`,`#E1F7FF`]}),"nebula-red-01":D({archetype:`nebula`,phase:1.692,baseColor:`#2A1418`,accentColors:[`#FF9DA0`,`#FFC6A8`,`#FFE8E0`]}),"deep-field-orange-01":D({archetype:`deep-field`,phase:2.167,baseColor:`#221408`,accentColors:[`#D9A05B`,`#A0693A`,`#FFE0B8`]}),"core-lime-02":D({archetype:`core`,phase:3.431,baseColor:`#12240E`,accentColors:[`#9BE84C`,`#3ED598`,`#EAFFC9`]}),"nebula-yellow-01":D({archetype:`nebula`,phase:1.461,baseColor:`#26200C`,accentColors:[`#FFE08A`,`#F4C14F`,`#FFF8E0`]}),"spiral-orange-02":D({archetype:`spiral`,phase:1.878,baseColor:`#26160C`,accentColors:[`#E88B4E`,`#C9653A`,`#F7D9B8`]}),"nebula-orange-02":D({archetype:`nebula`,phase:.365,baseColor:`#251106`,accentColors:[`#FFAD33`,`#E86A2C`,`#FFE2A8`]}),"deep-field-blue-02":D({archetype:`deep-field`,phase:.757,baseColor:`#14161C`,accentColors:[`#9AA6B8`,`#5E6B80`,`#E6ECF5`]}),"nebula-violet-02":D({archetype:`nebula`,phase:3.978,baseColor:`#1A1430`,accentColors:[`#A78BFA`,`#F0ABFC`,`#E0E7FF`]}),"deep-field-teal-02":D({archetype:`deep-field`,phase:6.142,baseColor:`#0F1F24`,accentColors:[`#5EEAD4`,`#99F6E4`,`#E0F2FE`]})});Object.freeze(Object.keys(k).sort());function A(e){return Object.freeze([Number.parseInt(e.slice(1,3),16)/255,Number.parseInt(e.slice(3,5),16)/255,Number.parseInt(e.slice(5,7),16)/255])}function j(e=O){let t=Object.hasOwn(k,e)?e:O,n=k[t];return Object.freeze({id:t,phase:n.phase,archetype:n.archetype,archetypeIndex:w[n.archetype],interiorColor:re,baseColor:A(n.baseColor),accentColors:Object.freeze(n.accentColors.map(A)),lensStrength:n.lensStrength,appearance:te,motion:ne,audioResponse:E,ambientMotion:n.ambientMotion,referenceDiameter:n.referenceDiameter,renderProfile:n.lensStrength>0?`layered`:`compact`})}var M=Math.PI*2,ie=/^#[0-9a-f]{6}$/i,ae=/^[a-z][a-z0-9-]{0,63}$/,oe=Object.freeze({detail:1,glow:1,intensity:1}),se=Object.freeze({drift:1,speed:1}),N=Object.freeze({brightness:1,motion:1,pulse:1});Object.freeze({appearance:oe,audioResponse:N,motion:se});var P=Object.freeze([`idle`,`listening`,`thinking`,`speaking`,`success`,`error`]),F=Object.freeze({low:Object.freeze({frameRate:30,maxPixelRatio:1,maxResolution:512}),balanced:Object.freeze({frameRate:45,maxPixelRatio:1.5,maxResolution:896}),high:Object.freeze({frameRate:60,maxPixelRatio:2,maxResolution:1280})});function I(e,t){if(e===void 0)return{};if(!e||typeof e!=`object`||Array.isArray(e))throw TypeError(`${t} must be an object.`);return e}function L(e,t,n){for(let r of Object.keys(e))if(!t.includes(r))throw TypeError(`${n}.${r} is not a supported option.`)}function R(e,t,n,r,i){if(e===void 0)return t;let a=Number(e);if(!Number.isFinite(a)||a<n||a>r)throw RangeError(`${i} must be between ${n} and ${r}.`);return a}function z(e,t,n){if(e===void 0)return t;if(typeof e!=`string`||!ie.test(e))throw TypeError(`${n} must use the #RRGGBB format.`);return e.toUpperCase()}function B(e){return Object.freeze([Number.parseInt(e.slice(1,3),16)/255,Number.parseInt(e.slice(3,5),16)/255,Number.parseInt(e.slice(5,7),16)/255])}function V(e,t){if(e===void 0)return t;let n=Number(e);if(!Number.isFinite(n))throw TypeError(`seed must be a finite number.`);return(n%M+M)%M}function H(e){return Object.freeze({...e})}function ce(e={}){let t=I(e,`options`);L(t,[`appearance`,`audioResponse`,`colors`,`id`,`motion`,`preset`,`seed`],`options`);let n=t.preset??`core-teal-01`;if(typeof n!=`string`||!Object.hasOwn(k,n))throw RangeError(`preset must be one of the registered orb variant IDs.`);let r=j(n),i=I(t.colors,`colors`),a=I(t.appearance,`appearance`),o=I(t.motion,`motion`),s=I(t.audioResponse,`audioResponse`);L(i,[`accents`,`base`,`interior`],`colors`),L(a,[`detail`,`glass`,`glow`,`intensity`],`appearance`),L(o,[`drift`,`speed`],`motion`),L(s,[`brightness`,`motion`,`pulse`],`audioResponse`);let c=t.id??`${n}-custom`;if(typeof c!=`string`||!ae.test(c))throw TypeError(`id must start with a letter and contain only lowercase letters, numbers, or hyphens.`);let l=z(i.base,k[n].baseColor,`colors.base`),u=z(i.interior,`#000000`,`colors.interior`),d=k[n].accentColors;if(i.accents!==void 0){if(!Array.isArray(i.accents)||i.accents.length!==3)throw TypeError(`colors.accents must contain exactly three #RRGGBB colors.`);d=i.accents.map((e,t)=>z(e,void 0,`colors.accents[${t}]`))}let f=H({detail:R(a.detail,1,0,1,`appearance.detail`),glow:R(a.glow,1,0,2,`appearance.glow`),intensity:R(a.intensity,1,.25,2,`appearance.intensity`)}),p=H({drift:R(o.drift,1,0,2,`motion.drift`),speed:R(o.speed,1,0,2,`motion.speed`)}),m=H({brightness:R(s.brightness,1,0,2,`audioResponse.brightness`),motion:R(s.motion,1,0,2,`audioResponse.motion`),pulse:R(s.pulse,1,0,2,`audioResponse.pulse`)}),h=R(a.glass,r.lensStrength,0,1,`appearance.glass`);return Object.freeze({...r,id:c,sourceVariantId:n,phase:V(t.seed,r.phase),interiorColor:B(u),baseColor:B(l),accentColors:Object.freeze(d.map(B)),lensStrength:h,renderProfile:h>0?`layered`:`compact`,appearance:f,motion:p,audioResponse:m})}function U(e=`high`){if(typeof e!=`string`||!Object.hasOwn(F,e))throw RangeError(`quality must be low, balanced, or high.`);return F[e]}function W(e=`idle`){if(!P.includes(e))throw RangeError(`state must be one of: ${P.join(`, `)}.`);return e}var le=`
attribute vec2 aPosition;
attribute vec2 aTextureCoord;
varying vec2 vUv;

void main() {
  vUv = aTextureCoord;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,G=`
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec3 uInteriorColor;
uniform vec3 uBaseColor;
uniform vec3 uAccentPrimary;
uniform vec3 uAccentSecondary;
uniform vec3 uAccentHighlight;
uniform float uTime;
uniform float uSeed;
uniform float uAudioBrightness;
uniform float uAudioPulse;
uniform float uSpin;
uniform float uArchetype;
uniform float uGlass;
uniform float uVisualIntensity;
uniform float uDetail;
uniform float uGlow;
uniform float uState;
uniform float uStateBlend;

float scalarHash(float value) {
  return fract(sin(value * 127.1) * 43758.5453);
}

vec4 sampleSky(vec3 direction, float time) {
  float longitude = atan(direction.z, direction.x);
  float latitude = asin(clamp(direction.y, -1.0, 1.0));
  float varianceA = fract(uSeed * 7.13);
  float varianceB = fract(uSeed * 3.71);
  float varianceC = fract(uSeed * 5.37);

  float type = uArchetype >= 0.0 ? uArchetype : floor(fract(uSeed * 9.73) * 4.0);
  float nebulaType = step(0.5, type) * (1.0 - step(1.5, type));
  float coreType = step(1.5, type) * (1.0 - step(2.5, type));
  float deepType = step(2.5, type);

  float planeOffset = latitude
    + (0.15 + 0.4 * varianceA) * sin(longitude * (1.0 + floor(varianceB * 2.0)) + 1.3)
    + 0.12 * sin(longitude * 3.0 + time * 0.1);
  float band = exp(-planeOffset * planeOffset * (5.0 + 10.0 * varianceC));
  band = mix(band, max(band, 0.8), nebulaType);
  band *= 1.0 - 0.85 * deepType;

  float waveA = sin(longitude * 2.0 + sin(latitude * 3.0 + time * 0.25) * 1.6 + time * 0.15);
  float waveB = sin(longitude * 5.0 - sin(latitude * 4.0 - time * 0.2) * 1.2 - time * 0.22 + 2.4);
  float cloud = pow(0.5 + 0.5 * waveA, 2.0) * (0.45 + 0.55 * pow(0.5 + 0.5 * waveB, 2.0));
  float dustLane = pow(0.5 + 0.5 * sin(longitude * 4.0 + latitude * 7.0 + sin(longitude * 2.0) * 2.0), 3.0);
  float galaxy = clamp(band * cloud * (1.0 - dustLane * (0.55 + 0.35 * varianceB)), 0.0, 1.0);

  vec3 paletteHue = mix(
    mix(uAccentPrimary, uAccentSecondary, varianceA),
    mix(uAccentSecondary, uAccentHighlight, varianceC),
    0.5 + 0.5 * sin(longitude + latitude * 2.0 - time * 0.2)
  );
  vec3 greyHue = vec3(dot(paletteHue, vec3(0.299, 0.587, 0.114)));
  paletteHue = clamp(greyHue + (paletteHue - greyHue) * 1.45, 0.0, 1.0);
  vec3 dustColor = mix(vec3(0.72, 0.78, 0.92), paletteHue, 0.45 + 0.3 * varianceA + 0.45 * nebulaType);
  vec3 color = dustColor * galaxy * (0.6 + 0.9 * nebulaType);

  float shear = sin(longitude * 13.0 + latitude * 4.0 - time * 0.35)
    * sin(longitude * 5.0 + time * 0.2);
  color += dustColor * band * cloud * max(shear, 0.0) * 0.14;

  float secondPlane = latitude - (0.35 + 0.25 * varianceB) * sin(longitude * 2.0 - 1.1) + 0.4;
  float secondArm = exp(-secondPlane * secondPlane * 7.0) * cloud;
  color += mix(dustColor, uAccentSecondary, 0.35) * secondArm * 0.2;

  vec3 ambientColor = mix(
    vec3(0.04, 0.03, 0.1),
    mix(uAccentPrimary, mix(uAccentSecondary, uAccentHighlight, varianceC), varianceA) * 0.22,
    0.75
  );
  color += ambientColor * (0.5 + 0.22 * sin(time * 0.4 + longitude)) * (0.4 + 0.6 * band);
  color += vec3(1.0, 0.88, 0.68) * pow(band, 4.0) * pow(cloud, 2.0) * 0.4;

  float coreAngle = varianceB * 6.28318;
  vec3 coreDirection = normalize(vec3(cos(coreAngle) * 0.85, 0.6 * (varianceC - 0.5), sin(coreAngle) * 0.85));
  float bulge = max(dot(direction, coreDirection), 0.0);
  color += mix(vec3(1.0, 0.85, 0.6), uAccentHighlight, 0.25)
    * (pow(bulge, 14.0) * 1.6 + pow(bulge, 4.0) * 0.5) * coreType;

  float pocketA = pow(cloud, 5.0) * band * (0.7 + 0.3 * sin(time * 0.6 + longitude * 3.0));
  color += mix(uAccentHighlight, uAccentPrimary, fract(varianceA + 0.5 * sin(longitude * 2.0) + 0.5))
    * pocketA * (0.5 + 0.4 * varianceB + 0.8 * nebulaType);
  float pocketB = pow(0.5 + 0.5 * sin(longitude * 3.0 + latitude * 4.0 - time * 0.18 + 2.0), 6.0) * band;
  color += mix(uAccentSecondary, uAccentHighlight, varianceC) * pocketB * (0.25 + 0.3 * varianceA + 0.5 * nebulaType);

  float detail = smoothstep(90.0, 200.0, uResolution.y) * uDetail;
  vec2 grainGrid = vec2(longitude, latitude) * 34.0;
  vec2 grainCell = floor(grainGrid);
  vec2 grainLocal = fract(grainGrid);
  float grainHash = scalarHash(grainCell.x * 3.7 + grainCell.y * 11.3);
  vec2 grainPoint = vec2(
    0.2 + 0.6 * scalarHash(grainHash * 91.0),
    0.2 + 0.6 * scalarHash(grainHash * 47.0)
  );
  float grainDistance = length((grainLocal - grainPoint) * vec2(cos(latitude), 1.0));
  float resolutionFactor = clamp(uResolution.y / 420.0, 0.22, 1.0);
  float grain = exp(-grainDistance * grainDistance * 700.0 * resolutionFactor)
    * step(0.3, grainHash) * (0.15 + 0.85 * band);
  color += vec3(0.88, 0.9, 1.0) * grain * 0.4 * detail;
  float coverage = clamp(galaxy * 0.7 + pow(band, 4.0) * 0.25, 0.0, 1.0);

  for (int scaleIndex = 0; scaleIndex < 3; scaleIndex++) {
    float scale = scaleIndex == 0 ? 6.0 : (scaleIndex == 1 ? 11.0 : 19.0);
    vec2 grid = vec2(longitude, latitude) * scale;
    vec2 cell = floor(grid);
    vec2 local = fract(grid);
    float hashX = scalarHash(cell.x * 13.7 + cell.y * 7.3 + float(scaleIndex) * 91.0);
    float hashY = scalarHash(cell.x * 5.1 + cell.y * 17.9 + float(scaleIndex) * 37.0);
    vec2 starPoint = vec2(0.15 + 0.7 * hashX, 0.15 + 0.7 * hashY);
    float distanceToStar = length((local - starPoint) * vec2(cos(latitude), 1.0));
    float census = (varianceB - 0.5) * 0.2 + 0.35 * nebulaType - 0.2 * coreType + 0.3 * deepType;
    float threshold = scaleIndex == 2 ? 0.3 : 0.55;
    float keep = step(threshold + census, scalarHash(hashX * 89.0 + hashY * 31.0) + band * 0.25);
    float twinkle = mix(
      0.92,
      0.6 + 0.4 * sin(time * (1.5 + 3.0 * hashX) + hashX * 40.0),
      resolutionFactor
    );
    float sizeHash = scalarHash(hashX * 53.0 + hashY * 71.0 + cell.x);
    float magnitude = 0.35 + 1.8 * sizeHash * sizeHash;
    float sharpness = (scaleIndex == 0 ? 260.0 : (scaleIndex == 1 ? 700.0 : 1600.0))
      / magnitude * resolutionFactor;
    float star = exp(-distanceToStar * distanceToStar * sharpness) * keep * twinkle;
    vec3 temperature = hashX < 0.33
      ? vec3(0.85, 0.9, 1.0)
      : (hashX < 0.66 ? vec3(1.0, 0.95, 0.85) : mix(vec3(1.0), uAccentSecondary, 0.3));
    vec3 tint = mix(vec3(1.0), temperature, 0.6);
    float brightness = (scaleIndex == 0 ? 1.7 : (scaleIndex == 1 ? 0.9 : 0.5))
      * (0.55 + 0.7 * magnitude);
    float scaleFade = mix(scaleIndex == 2 ? 0.14 : 0.45, 1.0, detail);
    color += tint * star * brightness * scaleFade;

    if (scaleIndex == 0) {
      float largeStar = smoothstep(1.2, 2.0, magnitude);
      color += tint * exp(-distanceToStar * distanceToStar * 60.0) * 0.18 * largeStar * twinkle * scaleFade;
      vec2 offset = (local - starPoint) * vec2(cos(latitude), 1.0);
      float spike = exp(-offset.x * offset.x * 1200.0) * exp(-offset.y * offset.y * 26.0)
        + exp(-offset.y * offset.y * 1200.0) * exp(-offset.x * offset.x * 26.0);
      color += tint * spike * 0.3 * largeStar * twinkle * scaleFade;
      coverage = max(coverage, spike * 0.3 * largeStar * scaleFade);
    }
    coverage = max(coverage, star * min(brightness, 1.5) * scaleFade);
  }

  float pulsarAngle = varianceA * 6.28318;
  vec3 pulsarDirection = normalize(vec3(
    sin(pulsarAngle) * 0.9,
    1.4 * (varianceB - 0.5),
    cos(pulsarAngle) * 0.9
  ));
  float pulsarAlignment = max(dot(direction, pulsarDirection), 0.0);
  float pulse = pow(0.5 + 0.5 * sin(time * (1.2 + varianceC + 1.5 * uAudioPulse) + varianceC * 6.28), 8.0);
  pulse = min(1.0, pulse + 0.6 * uAudioPulse);
  float pulsarFade = mix(0.45, 1.0, detail);
  color += vec3(0.9, 0.95, 1.0)
    * (pow(pulsarAlignment, 900.0) * (0.6 + 1.2 * pulse) + pow(pulsarAlignment, 110.0) * 0.5 * pulse)
    * pulsarFade;
  coverage = max(coverage, pow(pulsarAlignment, 900.0) * (0.5 + 0.5 * pulse) * pulsarFade);
  return vec4(min(color, vec3(1.0)), min(coverage, 1.0));
}

vec4 sampleRotatedSphere(vec3 direction, float spin, float time) {
  float roll = time * 0.13;
  float rollCos = cos(roll);
  float rollSin = sin(roll);
  direction = vec3(
    rollCos * direction.x - rollSin * direction.y,
    rollSin * direction.x + rollCos * direction.y,
    direction.z
  );
  float tilt = 0.45 + 0.35 * sin(time * 0.24);
  float tiltCos = cos(tilt);
  float tiltSin = sin(tilt);
  direction = vec3(
    direction.x,
    tiltCos * direction.y - tiltSin * direction.z,
    tiltSin * direction.y + tiltCos * direction.z
  );
  float spinCos = cos(spin);
  float spinSin = sin(spin);
  direction = vec3(
    spinCos * direction.x + spinSin * direction.z,
    direction.y,
    -spinSin * direction.x + spinCos * direction.z
  );
  return sampleSky(direction, time);
}

vec3 shadeOrb(vec2 point) {
  float radius = length(point);
#ifdef COMPACT_ORB
  if (radius > 1.0) discard;
#endif
  float clampedRadius = min(radius, 0.9995);
  float depth = sqrt(1.0 - clampedRadius * clampedRadius);
  vec3 normal = vec3(point.x, point.y, depth);
  float rim = pow(1.0 - depth, 2.4);

  vec3 refracted = refract(vec3(0.0, 0.0, -1.0), normal, 0.75);
  float backDistance = -2.0 * dot(normal, refracted);
  vec3 backDirection = normalize(normal + refracted * backDistance);

  float time = uTime * 0.8 + uSeed;
  float varianceA = fract(uSeed * 6.31);
  float varianceB = fract(uSeed * 2.17);
  float warpedTime = time
    + (0.9 + 1.3 * varianceA) * sin(time * (0.09 + 0.07 * varianceB))
    + (0.5 + 0.8 * varianceB) * sin(time * (0.21 + 0.09 * varianceA) + 2.6);
  vec4 front = sampleRotatedSphere(normal, uSpin, warpedTime);
#ifdef COMPACT_ORB
  vec4 back = vec4(0.0);
#else
  vec4 back = sampleRotatedSphere(backDirection, uSpin, warpedTime * 0.8 + 2.7);
#endif

  vec3 voidColor = mix(uBaseColor * 0.04, uBaseColor * 0.35, rim);
  vec3 color = mix(uInteriorColor, voidColor, 0.97 - 0.04 * rim);
  float frontAlpha = clamp(front.a, 0.0, 1.0);
  float backAlpha = clamp(back.a, 0.0, 1.0);
  color = mix(color, back.rgb, backAlpha * 0.16);
  color = mix(color, front.rgb, frontAlpha * 0.85);

  float auroraLongitude = atan(normal.x, normal.z);
  float speechWave = pow(
    0.5 + 0.5 * sin(auroraLongitude * 3.0 + sin(auroraLongitude * 7.0 + time * 1.1) * 0.7 + time * 0.5),
    3.0
  ) * (0.55 + 0.45 * sin(auroraLongitude * 5.0 - time * 0.65 + 1.7));
  float visibleSky = -normal.y;
  float hangingMask = smoothstep(-0.15, 0.5, visibleSky);
  float rayPattern = 0.7 + 0.3 * sin(
    auroraLongitude * 24.0 + sin(auroraLongitude * 9.0 - time * 0.8) * 2.0 + time * 1.6
  );
  float aurora = clamp(speechWave, 0.0, 1.0) * hangingMask * rayPattern * (1.0 + 2.2 * uAudioPulse);
  float auroraVariance = fract(uSeed * 2.93);
  vec3 auroraColor = mix(
    vec3(0.12, 0.95, 0.55),
    vec3(0.45, 0.35, 1.0),
    smoothstep(0.0, 0.95, visibleSky + 0.35 * speechWave)
  );
  auroraColor = mix(auroraColor, mix(uAccentPrimary, uAccentHighlight, auroraVariance), 0.15 + 0.4 * auroraVariance);
  color += auroraColor * aurora * 0.8;

  float meteorPeriod = 4.5 + 3.5 * fract(uSeed * 4.91);
  float meteorEpoch = floor(time / meteorPeriod);
  float meteorPhase = fract(time / meteorPeriod);
  vec2 meteorStart = vec2(
    -1.1 + 2.2 * scalarHash(meteorEpoch * 1.3),
    0.85 - 1.4 * scalarHash(meteorEpoch * 2.9)
  );
  vec2 meteorDirection = normalize(vec2(
    0.7 + 0.5 * scalarHash(meteorEpoch * 4.1),
    -0.35 - 0.4 * scalarHash(meteorEpoch * 5.3)
  ));
  vec2 meteorHead = meteorStart + meteorDirection * meteorPhase * 2.8;
  vec2 meteorRelative = point - meteorHead;
  float meteorAlong = dot(meteorRelative, meteorDirection);
  float meteorPerpendicular = dot(meteorRelative, vec2(-meteorDirection.y, meteorDirection.x));
  float meteorVisible = smoothstep(0.0, 0.06, meteorPhase) * smoothstep(0.5, 0.32, meteorPhase);
  float meteorTail = exp(-meteorPerpendicular * meteorPerpendicular * 1600.0)
    * exp(meteorAlong * 9.0) * step(meteorAlong, 0.0) * smoothstep(-0.5, -0.02, meteorAlong);
  float meteorGlow = exp(-dot(meteorRelative, meteorRelative) * 900.0);
  color += (vec3(1.0) * meteorGlow * 1.2 + mix(vec3(1.0), uAccentSecondary, 0.3) * meteorTail * 0.85)
    * meteorVisible;

  vec3 movingLight = normalize(vec3(
    0.85 * sin(time * 0.42),
    0.45 * sin(time * 0.26 + 1.2),
    0.5
  ));
  float diffuse = (0.62 + 0.65 * max(dot(normal, movingLight), 0.0)) * (1.0 + 0.35 * uAudioBrightness);
  color *= diffuse;
  vec3 voiceColor = mix(uAccentSecondary, vec3(1.0, 0.97, 0.9), 0.45);
  color += voiceColor * pow(1.0 - clampedRadius, 1.8) * uAudioBrightness * 0.5;
  color += (uAccentSecondary * 0.7 + vec3(0.12)) * rim * uAudioBrightness * 0.65 * uGlow;
  color += color * uAudioBrightness * 0.18 * sin(time * 14.0 + clampedRadius * 40.0 + uSeed * 7.0);
  float counterLight = max(dot(normal.xy, -movingLight.xy), 0.0) * rim;
  color += mix(uAccentPrimary, vec3(0.5, 0.6, 0.9), 0.5) * counterLight * 0.18 * uGlow;

  vec3 keyDirection = normalize(vec3(
    -0.45 + 0.3 * sin(time * 0.34),
    0.62 + 0.2 * sin(time * 0.27 + 1.7),
    0.64
  ));
  float keyStrength = 0.5 * (0.78 + 0.22 * sin(time * 0.45 + 2.2));
  color += vec3(1.0) * pow(max(dot(normal, keyDirection), 0.0), 150.0) * keyStrength * uGlow;
  vec3 sheenDirection = normalize(vec3(sin(time * 0.07) * 0.9, 0.35 + 0.3 * cos(time * 0.05), 0.7));
  color += vec3(1.0) * pow(max(dot(normal, sheenDirection), 0.0), 7.0) * 0.05 * uGlow;
  vec3 glintDirection = normalize(vec3(0.52, -0.5 + 0.12 * sin(time * 0.09), 0.69));
  color += vec3(1.0) * pow(max(dot(normal, glintDirection), 0.0), 140.0) * 0.25 * uGlow;
  color = mix(color, front.rgb, frontAlpha * rim * 0.3);
  float listeningState = step(0.5, uState) * (1.0 - step(1.5, uState));
  float thinkingState = step(1.5, uState) * (1.0 - step(2.5, uState));
  float successState = step(3.5, uState) * (1.0 - step(4.5, uState));
  float errorState = step(4.5, uState);
  float statePulse = 0.5 + 0.5 * sin(time * (1.1 + thinkingState * 0.7));
  float stateStrength = uStateBlend * (
    listeningState * 0.12
    + thinkingState * (0.08 + 0.1 * statePulse)
    + successState * 0.22
    + errorState * 0.18
  );
  vec3 stateColor = mix(uAccentPrimary, uAccentSecondary, thinkingState * statePulse);
  stateColor = mix(stateColor, uAccentHighlight, successState);
  stateColor = mix(stateColor, vec3(1.0, 0.08, 0.05), errorState);
  color += stateColor * (0.15 + 0.85 * rim) * stateStrength * uGlow;
  color *= uVisualIntensity;
  float limb = smoothstep(0.94, 1.0, clampedRadius);
  return mix(color, color * 0.85, limb * 0.4);
}

void main() {
  vec2 point = vUv * 2.0 - 1.0;
  if (length(point) > 1.0) discard;
  if (uGlass > 0.0) {
    float radius = length(point);
    float exponential = exp(2.0 * 1.7724539 * (radius - 0.9) / 0.1414214);
    float edgeFalloff = 0.5 + 0.5 * (exponential - 1.0) / (exponential + 1.0);
    if (edgeFalloff > 0.004) {
      float lensPulse = 1.0 + 0.16 * (
        0.6 * sin(uTime * 0.9 + uSeed)
        + 0.4 * sin(uTime * 1.7 + uSeed * 1.3)
      );
      float displacement = uGlass * edgeFalloff * lensPulse;
      float redShift = 1.4 * (1.0 + 0.06 * sin(uTime * 1.3 + uSeed));
      float greenShift = 1.2 * (1.0 + 0.06 * sin(uTime * 1.3 + uSeed + 2.1));
      float blueShift = 1.0 * (1.0 + 0.06 * sin(uTime * 1.3 + uSeed + 4.2));
      vec3 color = vec3(
        shadeOrb(point * (1.0 - displacement * redShift)).r,
        shadeOrb(point * (1.0 - displacement * greenShift)).g,
        shadeOrb(point * (1.0 - displacement * blueShift)).b
      );
      vec2 absolutePoint = min(abs(point), 1.0);
      float lobe = max(
        abs(absolutePoint.x * 0.766 + absolutePoint.y * 0.643),
        abs(absolutePoint.x * 0.766 - absolutePoint.y * 0.643)
      );
      float glow = 0.65 * pow(clamp((lobe - 0.0707) / 1.3435, 0.0, 1.0), 2.4) * edgeFalloff;
      glow += 1.02 * clamp(1.0 + (radius - 1.0) / 0.15, 0.0, 1.0)
        * step(radius, 1.0) * pow(lobe, 2.0);
      color += vec3(0.25) * min(glow, 1.0) * uGlow;
      gl_FragColor = vec4(color, 1.0);
      return;
    }
  }
  gl_FragColor = vec4(shadeOrb(point), 1.0);
}
`,ue=G.replace(`precision highp float;`,`precision highp float;
#define COMPACT_ORB`),K=1280,de=Object.freeze({idle:0,listening:1,thinking:2,speaking:3,success:4,error:5});function fe(){if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(K,K);let e=document.createElement(`canvas`);return e.width=K,e.height=K,e}function q(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)||`Unknown shader compile failure`;throw e.deleteShader(r),Error(t)}return r}function pe(e,t){let n=q(e,e.VERTEX_SHADER,le),r=q(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.bindAttribLocation(i,1,`aTextureCoord`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS)){let t=e.getProgramInfoLog(i)||`Unknown shader link failure`;throw e.deleteProgram(i),Error(t)}return i}var me=class{constructor(e,{fixedTime:t=null,onError:n=()=>{},quality:r=`high`,state:i=`idle`,variant:a,timeOffset:o=4e3*Math.random()}={}){if(this.visibleCanvas=e,this.onError=n,this.variant=a??j(),this.quality=r,this.qualityProfile=U(r),this.state=W(i),this.internalCanvas=fe(),this.visibleContext=e.getContext(`2d`,{alpha:!0}),this.gl=this.internalCanvas.getContext(`webgl`,{premultipliedAlpha:!0,alpha:!0,antialias:!1,preserveDrawingBuffer:!0}),!this.visibleContext||!this.gl)throw Error(`This browser could not create the required canvas contexts.`);this.batchExtension=this.gl.getExtension(`ANGLE_instanced_arrays`),this.compactPipeline=this.variant.lensStrength<=0&&!!this.batchExtension,this.program=null,this.locations=null,this.buffer=null,this.ready=!1,this.diameter=528,this.requestedDevicePixelRatio=1,this.devicePixelRatio=1,this.renderDiameter=528,this.active=!0,this.reducedMotion=!1,this.destroyed=!1,this.targetAudioLevel=0,this.stateBlend=1,this.lastStateFrameAt=null,this.motionState=S(this.variant.phase),this.timeOffset=o,this.fixedTime=Number.isFinite(t)?t:null,this.lastFrameAt=0,this.timer=0,this.frame=this.frame.bind(this),this.handleContextLost=this.handleContextLost.bind(this),this.handleContextRestored=this.handleContextRestored.bind(this),this.internalCanvas.addEventListener?.(`webglcontextlost`,this.handleContextLost),this.internalCanvas.addEventListener?.(`webglcontextrestored`,this.handleContextRestored),this.initializeGlResources(),this.visibleContext.globalCompositeOperation=`copy`}initializeGlResources(){let e=this.gl,t=this.compactPipeline?ue:G;this.program=pe(e,t),this.locations=this.getLocations(),this.buffer=this.createQuad(),this.gl.disable(this.gl.DEPTH_TEST),this.gl.enable(this.gl.BLEND),this.gl.blendFunc(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA),this.gl.enable(this.gl.SCISSOR_TEST),this.gl.useProgram(this.program),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffer),this.gl.enableVertexAttribArray(this.locations.position),this.gl.vertexAttribPointer(this.locations.position,2,this.gl.FLOAT,!1,16,0),this.gl.enableVertexAttribArray(this.locations.textureCoord),this.gl.vertexAttribPointer(this.locations.textureCoord,2,this.gl.FLOAT,!1,16,8),this.visibleContext.globalCompositeOperation=`copy`,this.setStaticUniforms(),this.ready=!0}getLocations(){let e=this.gl,t=[`uResolution`,`uInteriorColor`,`uBaseColor`,`uAccentPrimary`,`uAccentSecondary`,`uAccentHighlight`,`uTime`,`uSeed`,`uAudioBrightness`,`uAudioPulse`,`uSpin`,`uArchetype`,`uGlass`,`uVisualIntensity`,`uDetail`,`uGlow`,`uState`,`uStateBlend`],n={position:e.getAttribLocation(this.program,`aPosition`),textureCoord:e.getAttribLocation(this.program,`aTextureCoord`)};for(let r of t)n[r]=e.getUniformLocation(this.program,r);return n}createQuad(){let e=this.gl,t=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,1,-1,1,1,-1,1,0,0,1,1,1,0]),e.STATIC_DRAW),t}setStaticUniforms(){let e=this.gl,t=this.variant.appearance??{detail:1,glow:1,intensity:1};e.useProgram(this.program),e.uniform3f(this.locations.uInteriorColor,...this.variant.interiorColor??[0,0,0]),e.uniform3f(this.locations.uBaseColor,...this.variant.baseColor),e.uniform3f(this.locations.uAccentPrimary,...this.variant.accentColors[0]),e.uniform3f(this.locations.uAccentSecondary,...this.variant.accentColors[1]),e.uniform3f(this.locations.uAccentHighlight,...this.variant.accentColors[2]),e.uniform1f(this.locations.uSeed,this.variant.phase),e.uniform1f(this.locations.uArchetype,this.variant.archetypeIndex),e.uniform1f(this.locations.uGlass,this.variant.lensStrength),e.uniform1f(this.locations.uVisualIntensity,t.intensity),e.uniform1f(this.locations.uDetail,t.detail),e.uniform1f(this.locations.uGlow,t.glow)}resize(e,t){this.diameter=Math.max(1,Math.round(e)),this.requestedDevicePixelRatio=Math.max(1,t||1),this.devicePixelRatio=Math.min(this.qualityProfile.maxPixelRatio,this.requestedDevicePixelRatio),this.renderDiameter=Math.min(this.qualityProfile.maxResolution,Math.max(1,Math.round(this.diameter*this.devicePixelRatio))),this.visibleCanvas.width!==this.renderDiameter&&(this.visibleCanvas.width=this.renderDiameter),this.visibleCanvas.height!==this.renderDiameter&&(this.visibleCanvas.height=this.renderDiameter),this.visibleContext.globalCompositeOperation=`copy`,this.render(performance.now())}setAudioLevel(e){this.targetAudioLevel=Math.min(1,Math.max(0,Number(e)||0))}setVariant(e){this.variant=e,this.motionState.phase=e.phase;let t=e.lensStrength<=0&&!!this.batchExtension;t===this.compactPipeline?this.setStaticUniforms():(this.buffer&&this.gl.deleteBuffer(this.buffer),this.program&&this.gl.deleteProgram(this.program),this.compactPipeline=t,this.initializeGlResources()),this.render(performance.now())}setQuality(e){this.quality=e,this.qualityProfile=U(e),this.resize(this.diameter,this.requestedDevicePixelRatio)}setState(e){this.state=W(e),this.stateBlend=+!!this.reducedMotion,this.lastStateFrameAt=null,this.render(performance.now())}setActive(e){this.active=!!e,this.active&&this.requestFrame()}setReducedMotion(e){this.reducedMotion=!!e,this.reducedMotion&&(this.stateBlend=1),this.render(performance.now()),this.reducedMotion||this.requestFrame()}requestFrame(){this.destroyed||this.timer||!this.active||this.reducedMotion||(this.timer=typeof requestAnimationFrame==`function`?requestAnimationFrame(this.frame):setTimeout(()=>this.frame(performance.now()),1e3/this.qualityProfile.frameRate))}frame(e){if(this.timer=0,!this.active||this.destroyed||this.reducedMotion)return;let t=e-this.lastFrameAt,n=1e3/this.qualityProfile.frameRate;t<n||(this.lastFrameAt=e-t%n,this.render(e)),this.requestFrame()}render(e){if(!this.ready)return!1;let t=this.gl,n=this.fixedTime??e/1e3+this.timeOffset,r=this.variant.audioResponse??{brightness:1,motion:1,pulse:1};C(this.motionState,n,Math.min(1,this.targetAudioLevel*r.motion),this.variant.motion);let i=this.lastStateFrameAt===null?0:Math.min(.1,Math.max(0,(e-this.lastStateFrameAt)/1e3));this.lastStateFrameAt=e,this.stateBlend+=(1-this.stateBlend)*(i>0?1-Math.exp(-i/.18):0);let a=K-this.renderDiameter;return t.viewport(0,a,this.renderDiameter,this.renderDiameter),t.scissor(0,a,this.renderDiameter,this.renderDiameter),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.program),t.uniform2f(this.locations.uResolution,this.renderDiameter,this.renderDiameter),t.uniform1f(this.locations.uTime,n),t.uniform1f(this.locations.uAudioBrightness,Math.min(1,this.motionState.audioSmooth*r.brightness)),t.uniform1f(this.locations.uAudioPulse,Math.min(1,this.motionState.audioSmooth*r.pulse)),t.uniform1f(this.locations.uSpin,this.motionState.spin),t.uniform1f(this.locations.uState,de[this.state]),t.uniform1f(this.locations.uStateBlend,this.stateBlend),t.drawArrays(t.TRIANGLE_STRIP,0,4),this.visibleContext.drawImage(this.internalCanvas,0,0,this.renderDiameter,this.renderDiameter,0,0,this.renderDiameter,this.renderDiameter),!0}start(){let e=performance.now();this.render(e),this.lastFrameAt=e,this.requestFrame()}handleContextLost(e){e.preventDefault?.(),this.ready=!1}handleContextRestored(){try{this.initializeGlResources(),this.render(performance.now()),this.requestFrame()}catch(e){this.onError(e instanceof Error?e:Error(String(e)))}}destroy(){this.destroyed=!0,this.timer&&(typeof cancelAnimationFrame==`function`?cancelAnimationFrame(this.timer):clearTimeout(this.timer));let e=this.gl;this.internalCanvas.removeEventListener?.(`webglcontextlost`,this.handleContextLost),this.internalCanvas.removeEventListener?.(`webglcontextrestored`,this.handleContextRestored),this.buffer&&e.deleteBuffer(this.buffer),this.program&&e.deleteProgram(this.program)}};function he(e){if(typeof HTMLCanvasElement>`u`||!(e instanceof HTMLCanvasElement))throw TypeError(`createOrb requires an HTMLCanvasElement.`);return e}function J(e){if(e===void 0||typeof e==`string`)return j(e);if(!e||typeof e!=`object`||!Array.isArray(e.accentColors))throw TypeError(`theme must be a registered variant ID or a resolved orb theme.`);return e}var ge=class{constructor(e,t={}){this.canvas=he(e),this.destroyed=!1,this.paused=!1,this.visible=!0,this.pageVisible=typeof document>`u`||document.visibilityState===`visible`,this.audioDetach=null,this.reducedMotionSetting=t.reducedMotion??`user`,this.motionPreference=typeof matchMedia==`function`?matchMedia(`(prefers-reduced-motion: reduce)`):null,this.engine=new me(e,{fixedTime:t.fixedTime,onError:t.onError,quality:t.quality,state:t.state,timeOffset:t.timeOffset,variant:J(t.theme)}),this.handleVisibility=()=>{this.pageVisible=document.visibilityState===`visible`,this.updateActivity()},this.handleMotionPreference=e=>{this.reducedMotionSetting===`user`&&this.engine.setReducedMotion(e.matches)},this.resizeObserver=typeof ResizeObserver==`function`?new ResizeObserver(()=>this.resize()):null,this.intersectionObserver=typeof IntersectionObserver==`function`?new IntersectionObserver(([e])=>{this.visible=e.isIntersecting,this.updateActivity()}):null,this.resizeObserver?.observe(e),this.intersectionObserver?.observe(e),this.motionPreference?.addEventListener(`change`,this.handleMotionPreference),document.addEventListener(`visibilitychange`,this.handleVisibility),this.engine.setReducedMotion(this.shouldReduceMotion()),this.resize(),this.engine.start()}shouldReduceMotion(){return typeof this.reducedMotionSetting==`boolean`?this.reducedMotionSetting:!!this.motionPreference?.matches}resize(){let e=this.canvas.getBoundingClientRect(),t=Math.max(1,Math.min(e.width||this.canvas.clientWidth||264,e.height||this.canvas.clientHeight||e.width||264));this.engine.resize(t,globalThis.devicePixelRatio||1)}updateActivity(){this.engine.setActive(!this.destroyed&&!this.paused&&this.visible&&this.pageVisible)}setTheme(e){let t=J(e);return this.engine.setVariant(t),t}setState(e){this.engine.setState(e)}setQuality(e){this.engine.setQuality(e)}setAudioLevel(e){this.engine.setAudioLevel(e)}setReducedMotion(e){if(e!==`user`&&typeof e!=`boolean`)throw TypeError(`reducedMotion must be true, false, or user.`);this.reducedMotionSetting=e,this.engine.setReducedMotion(this.shouldReduceMotion())}attachAudioSource(e,t){return this.disconnectAudio(),this.audioDetach=y(e,e=>this.setAudioLevel(e),t),()=>this.disconnectAudio()}async connectMicrophone(e){return this.disconnectAudio(),this.audioDetach=await b(e=>this.setAudioLevel(e),e),()=>this.disconnectAudio()}disconnectAudio(){this.audioDetach?.(),this.audioDetach=null,this.setAudioLevel(0)}releaseAudioSource(e){x(e)}pause(){this.paused=!0,this.updateActivity()}resume(){this.paused=!1,this.updateActivity()}destroy(){this.destroyed||(this.destroyed=!0,this.disconnectAudio(),this.resizeObserver?.disconnect(),this.intersectionObserver?.disconnect(),this.motionPreference?.removeEventListener(`change`,this.handleMotionPreference),document.removeEventListener(`visibilitychange`,this.handleVisibility),this.engine.destroy())}};function _e(e,t){return new ge(e,t)}var Y=t(e(),1),X=[{id:`websites`,code:`01`,name:`AI Websites & Landing Pages`,line:`A website that answers questions and captures every enquiry.`,overview:`We design and build fast, modern websites and landing pages for your business, with an AI assistant that can answer common questions and forms that send every enquiry straight into your CRM.`,includes:[`Website or landing page design and build`,`AI chat that answers common visitor questions`,`Enquiry forms connected to your CRM`,`Mobile-friendly, fast-loading pages`],fit:`Your current site looks dated, or enquiries arrive in too many places to keep track of.`},{id:`advertising`,code:`02`,name:`Advertising & Marketing`,line:`Campaigns that reach the right people and follow up for you.`,overview:`We plan and run advertising and marketing campaigns, then connect them to automatic email and text follow-up so the people who respond hear back from you.`,includes:[`Ad campaign setup and management`,`Email and SMS follow-up sequences`,`Re-engagement campaigns for past contacts`,`Review request messages`],fit:`You spend on marketing but leads go cold before anyone follows up.`},{id:`agents`,code:`03`,name:`AI Voice & Chat Agents`,line:`AI assistants that answer calls, chats and messages.`,overview:`AI agents that answer phone calls, website chats and social messages in your business’s voice, ask qualifying questions, offer appointment times and hand the conversation to your team when a person is needed.`,includes:[`AI phone receptionist`,`Website chat and social DM replies`,`Lead qualification questions you approve`,`Hand-off to a team member when needed`],fit:`Calls and messages come in after hours or while your team is busy.`},{id:`funnels`,code:`04`,name:`Sales Funnels`,line:`Step-by-step pages that turn interest into booked appointments.`,overview:`We build focused funnels (an offer page, a booking page and the follow-up messages in between) so someone who clicks an ad or a link has a clear path to becoming a customer.`,includes:[`Offer and lead-magnet pages`,`Booking and application funnels`,`Follow-up messages between steps`,`Headline and layout testing`],fit:`People click through to your site but don’t know what to do next.`},{id:`video`,code:`05`,name:`Video & Clipping`,line:`Turn long videos into short clips for every platform.`,overview:`We help you produce short-form video and cut longer recordings (webinars, podcasts, walkthroughs) into clips sized and captioned for social platforms, so your business stays visible consistently.`,includes:[`Short-form video editing`,`Clipping long recordings into social posts`,`Captions and platform-specific formats`,`Publishing schedule support`],fit:`You have good recordings or ideas but no time to edit and post them.`},{id:`automations`,code:`06`,name:`Automations`,line:`The repetitive steps happen on their own.`,overview:`We map the repetitive steps in your business (reminders, task assignments, tagging, follow-ups, hand-offs) and build workflows that run them automatically, so nothing depends on someone remembering.`,includes:[`Workflow mapping with your team`,`Appointment reminders and no-show follow-up`,`Automatic tagging, routing and task creation`,`Connections between the tools you already use`],fit:`Your team spends hours on copy-paste, reminders and status updates.`},{id:`analytics`,code:`07`,name:`Analytics`,line:`See where leads come from and what happens to them.`,overview:`We set up reporting that shows your leads, conversations, appointments and sales in one place, so you can see which channels are working and where people drop off.`,includes:[`Pipeline and lead-source dashboards`,`Call and conversation reporting`,`Campaign tracking setup`,`Regular performance summaries`],fit:`You’re not sure which marketing is actually bringing in customers.`},{id:`crm`,code:`08`,name:`CRM & Sales`,line:`Every lead and deal in one organised pipeline.`,overview:`We set up and organise your CRM so every contact, conversation and deal lives in one pipeline, with text-back for missed calls, appointment booking and clear next steps for your sales team.`,includes:[`CRM setup and pipeline design`,`Missed-call text-back`,`Appointment booking and reminders`,`Contact history in one place`],fit:`Leads live in spreadsheets, inboxes and sticky notes.`}],ve=Object.fromEntries(X.map(e=>[e.id,e])),Z=n(),Q={name:`Please enter your name.`,email:`Please enter a valid email address.`,phone:`Please enter a valid phone number.`},ye=(0,Y.forwardRef)(function({department:e,onDepartmentChange:t,onStatus:n},r){let[i,a]=(0,Y.useState)(`idle`),[o,s]=(0,Y.useState)([]);function c(e){a(e),n?.(e)}async function l(e){e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));c(`sending`),s([]);try{let e=await fetch(`/api/lead`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),n=await e.json().catch(()=>({}));if(e.status===422){s(n.fields||[]),c(`invalid`);return}if(!e.ok)throw Error();c(n.mode===`dry-run`?`preview`:`sent`)}catch{c(`error`)}}if(i===`preview`)return(0,Z.jsxs)(`div`,{className:`cf-done`,role:`status`,children:[(0,Z.jsx)(`p`,{className:`mono label`,children:`Preview mode · not sent`}),(0,Z.jsx)(`h3`,{children:`Test submission saved locally.`}),(0,Z.jsx)(`p`,{children:`This preview is not connected to the CRM yet, so nobody has been notified. No one will contact you from this form.`})]});if(i===`sent`)return(0,Z.jsxs)(`div`,{className:`cf-done`,role:`status`,children:[(0,Z.jsx)(`p`,{className:`mono label`,children:`Request received`}),(0,Z.jsx)(`h3`,{children:`Thank you. We’ll be in touch.`}),(0,Z.jsx)(`p`,{children:`A member of the Backbone Business AI team will contact you to arrange your consultation.`})]});let u=e=>o.includes(e);return(0,Z.jsxs)(`form`,{className:`cf`,onSubmit:l,noValidate:!0,"aria-describedby":`cf-note`,children:[(0,Z.jsxs)(`div`,{className:`cf-row`,children:[(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`Name *`}),(0,Z.jsx)(`input`,{ref:r,name:`name`,autoComplete:`name`,required:!0,"aria-invalid":u(`name`)}),u(`name`)&&(0,Z.jsx)(`em`,{children:Q.name})]}),(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`Business name`}),(0,Z.jsx)(`input`,{name:`company`,autoComplete:`organization`})]})]}),(0,Z.jsxs)(`div`,{className:`cf-row`,children:[(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`Email *`}),(0,Z.jsx)(`input`,{name:`email`,type:`email`,autoComplete:`email`,required:!0,"aria-invalid":u(`email`)}),u(`email`)&&(0,Z.jsx)(`em`,{children:Q.email})]}),(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`Phone`}),(0,Z.jsx)(`input`,{name:`phone`,type:`tel`,autoComplete:`tel`,"aria-invalid":u(`phone`)}),u(`phone`)&&(0,Z.jsx)(`em`,{children:Q.phone})]})]}),(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`What would you like help with?`}),(0,Z.jsxs)(`select`,{name:`department`,value:e,onChange:e=>t(e.target.value),children:[(0,Z.jsx)(`option`,{value:``,children:`Not sure yet, help me decide`}),X.map(e=>(0,Z.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,Z.jsxs)(`label`,{children:[(0,Z.jsx)(`span`,{children:`Tell us a little about your business (optional)`}),(0,Z.jsx)(`textarea`,{name:`message`,rows:3})]}),(0,Z.jsx)(`input`,{className:`hp`,name:`website`,tabIndex:-1,autoComplete:`off`,"aria-hidden":`true`}),(0,Z.jsxs)(`button`,{className:`btn btn-primary btn-block`,disabled:i===`sending`,children:[(0,Z.jsx)(`span`,{className:`btn-label`,children:i===`sending`?`Sending…`:`Request my consultation`}),(0,Z.jsx)($,{})]}),(0,Z.jsxs)(`p`,{className:`cf-status`,role:`status`,"aria-live":`polite`,children:[i===`error`&&`Something went wrong sending your request. Please try again in a moment.`,i===`invalid`&&`Please check the highlighted fields.`]})]})});function $(){return(0,Z.jsx)(`svg`,{className:`chev`,viewBox:`0 0 20 12`,"aria-hidden":`true`,focusable:`false`,children:(0,Z.jsx)(`path`,{d:`M2 1l5 5-5 5M9 1l5 5-5 5`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`})})}export{_e as a,X as i,ye as n,ce as o,ve as r,$ as t};