/***********************
 * 1) Typing Effect
 ***********************/
const words = ["Robotics", "AI Systems", "Autonomous Tech", "Intelligent Machines"];
let wIdx = 0, j = 0, deleting = false;
const typingEl = document.getElementById("typing");
function typeEffect() {
  const word = words[wIdx];
  typingEl.textContent = deleting ? word.slice(0, j--) : word.slice(0, j++);
  if (!deleting && j === word.length + 3) deleting = true;
  if (deleting && j === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
  setTimeout(typeEffect, deleting ? 60 : 120);
}
typeEffect();

/***********************
 * 2) Footer Year
 ***********************/
document.getElementById("year").textContent = new Date().getFullYear();

/***********************
 * 3) AI Voice Greeting
 ***********************/
const sayHiBtn = document.getElementById("sayHi");
if (sayHiBtn) {
  sayHiBtn.addEventListener("click", () => {
    const utter = new SpeechSynthesisUtterance("Welcome to Ray's Future.");
    utter.lang = "en-US"; utter.rate = 1.05; utter.pitch = 1.05;
    speechSynthesis.cancel(); speechSynthesis.speak(utter);
  });
}

/***********************
 * 4) Scroll Reveal
 ***********************/
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); observer.unobserve(e.target); } });
},{ threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/***********************
 * 5) Galaxy Scene
 *    (Parallax Stars + Nebula + Meteors + Robots + Flames)
 ***********************/
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d", { alpha: true });

function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", () => { resizeCanvas(); initStars(); });
resizeCanvas();

// mouse for parallax + gentle influence
const mouse = { x: innerWidth/2, y: innerHeight/2 };
addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// --- stars (two layers for parallax) ---
let starsFar = [], starsNear = [];
function initStars(nFar=140, nNear=120){
  starsFar = Array.from({length:nFar},()=>({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: Math.random()*1.1 + 0.2, tw: Math.random()*0.02+0.003, ph: Math.random()*Math.PI*2
  }));
  starsNear = Array.from({length:nNear},()=>({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: Math.random()*1.6 + 0.4, tw: Math.random()*0.03+0.006, ph: Math.random()*Math.PI*2
  }));
}
initStars();

// --- meteors ---
let meteors = [];
function spawnMeteor() {
  meteors.push({
    x: -140, y: Math.random()*canvas.height*0.6,
    vx: 10 + Math.random()*8, vy: 4 + Math.random()*3, life: 0
  });
}

// --- background + layers ---
function drawBackground() {
  const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*0.9);
  g.addColorStop(0, "#091226");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

  // Nebula glows
  ctx.globalAlpha = 0.18;
  const nebula1 = ctx.createRadialGradient(canvas.width*0.75, canvas.height*0.25, 0, canvas.width*0.75, canvas.height*0.25, canvas.width*0.5);
  nebula1.addColorStop(0, "rgba(110,168,255,0.9)");
  nebula1.addColorStop(1, "rgba(110,168,255,0)");
  ctx.fillStyle = nebula1; ctx.beginPath(); ctx.arc(canvas.width*0.75, canvas.height*0.25, canvas.width*0.5, 0, Math.PI*2); ctx.fill();

  const nebula2 = ctx.createRadialGradient(canvas.width*0.2, canvas.height*0.65, 0, canvas.width*0.2, canvas.height*0.65, canvas.width*0.45);
  nebula2.addColorStop(0, "rgba(165,110,255,0.9)");
  nebula2.addColorStop(1, "rgba(165,110,255,0)");
  ctx.fillStyle = nebula2; ctx.beginPath(); ctx.arc(canvas.width*0.2, canvas.height*0.65, canvas.width*0.45, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
}

let rgbMode = false; // set by mode button later

function drawStarsLayer(arr, parallaxFactor, colorBase=255) {
  const offX = (mouse.x - canvas.width/2) * parallaxFactor;
  const offY = (mouse.y - canvas.height/2) * parallaxFactor;
  for (const s of arr) {
    const a = 0.5 + 0.5 * Math.sin(performance.now() * s.tw + s.ph);
    const hue = rgbMode ? (performance.now() * 0.05 + s.ph * 50) % 360 : 210;
    ctx.fillStyle = rgbMode
      ? `hsla(${hue},100%,70%,${a})`
      : `rgba(${colorBase},${colorBase},255,${a})`;
    ctx.beginPath();
    ctx.arc(s.x - offX, s.y - offY, s.r, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawMeteors() {
  if (Math.random() < 0.004) spawnMeteor();
  for (const m of meteors) {
    m.x += m.vx; m.y += m.vy; m.life += 1;
    const grad = ctx.createLinearGradient(m.x - 110, m.y - 55, m.x, m.y);
    grad.addColorStop(0, "rgba(110,168,255,0)");
    grad.addColorStop(1, "rgba(110,168,255,0.9)");
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(m.x - 110, m.y - 55); ctx.lineTo(m.x, m.y); ctx.stroke();

    // lens flare at head
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI*2); ctx.fill(); ctx.restore();
  }
  meteors = meteors.filter(m => m.x < canvas.width + 220 && m.y < canvas.height + 220);
}

// --- robots with separation + wander ---
const robots = [];
const ROBOT_COUNT = 10;
for (let r = 0; r < ROBOT_COUNT; r++) {
  robots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.4,
    size: 40 + Math.random() * 40,
    hue: Math.random() * 360,
    spin: Math.random() * Math.PI * 2,
    jitter: Math.random() * 1000
  });
}

function updateRobots() {
  const maxSpeed = 0.8;
  const friction = 0.985;
  const sepRadius = 90;
  const sepForce  = 0.012;
  const mouseForce = 0.00001;
  const t = performance.now() * 0.001;

  for (let i = 0; i < robots.length; i++) {
    const b = robots[i];

    // wander
    b.vx += Math.cos(t * 0.9 + b.jitter) * 0.0015;
    b.vy += Math.sin(t * 1.1 + b.jitter) * 0.0015;

    // mild mouse pull (only when close)
    const dxm = mouse.x - b.x, dym = mouse.y - b.y;
    const d2m = dxm * dxm + dym * dym;
    if (d2m < 250 * 250) { b.vx += dxm * mouseForce; b.vy += dym * mouseForce; }

    // separation
    for (let j = 0; j < robots.length; j++) {
      if (i === j) continue;
      const o = robots[j];
      const sx = b.x - o.x, sy = b.y - o.y;
      const dist2 = sx * sx + sy * sy;
      if (dist2 > 1 && dist2 < sepRadius * sepRadius) {
        const inv = sepForce / Math.sqrt(dist2);
        b.vx += sx * inv; b.vy += sy * inv;
      }
    }

    // friction + cap
    b.vx *= friction; b.vy *= friction;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > maxSpeed) { b.vx = (b.vx / sp) * maxSpeed; b.vy = (b.vy / sp) * maxSpeed; }

    // integrate
    b.x += b.vx; b.y += b.vy;
    b.spin += 0.002; b.hue = (b.hue + 0.35) % 360;

    // wrap
    if (b.x < -140) b.x = canvas.width + 140;
    if (b.x > canvas.width + 140) b.x = -140;
    if (b.y < -140) b.y = canvas.height + 140;
    if (b.y > canvas.height + 140) b.y = -140;
  }
}

function renderRobots() {
  for (const b of robots) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.sin(b.spin) * 0.25);

    // frame + glow
    ctx.lineWidth = 3; ctx.globalAlpha = 0.95;
    ctx.strokeStyle = `hsl(${b.hue}, 100%, 85%)`;
    ctx.shadowColor = `hsl(${b.hue}, 100%, 70%)`;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.rect(-b.size / 2, -b.size / 2, b.size, b.size);
    ctx.rect(-b.size / 4, -b.size / 4, b.size / 2, b.size / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // sensors
    const eyeOffset = b.size * 0.22;
    ctx.fillStyle = `hsl(${(b.hue + 40) % 360}, 100%, 65%)`;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(-eyeOffset, -eyeOffset * 0.4, b.size * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc( eyeOffset, -eyeOffset * 0.4, b.size * 0.06, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

// --- flames (RGB mode) ---
let flames = [];
const FLAME_COUNT_PER_FRAME = 10;
const FLAME_SIZE = 3.2;
const FLAME_DECAY = 0.03;

function spawnFlame(x, y, hueBase=20) {
  for (let i = 0; i < FLAME_COUNT_PER_FRAME; i++) {
    flames.push({
      x: x + Math.random() * 12 - 6,
      y: y + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.9,
      vy: -Math.random() * 2.0 - 0.4,
      life: 1,
      hue: hueBase + Math.random() * 20
    });
  }
}

function drawFlames() {
  const prevOp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter"; // additive glow

  for (let f of flames) {
    ctx.globalAlpha = f.life * 0.9;
    ctx.fillStyle = `hsl(${f.hue}, 100%, 55%)`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, FLAME_SIZE, 0, Math.PI * 2);
    ctx.fill();

    f.x += f.vx; f.y += f.vy; f.life -= FLAME_DECAY;
  }
  flames = flames.filter(f => f.life > 0.02);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = prevOp;
}

/***********************
 * Main animation loop
 ***********************/
function animate() {
  drawBackground();
  drawStarsLayer(starsFar, 0.010, 230);
  drawStarsLayer(starsNear, 0.020, 255);
  drawMeteors();

  updateRobots();
  renderRobots();

  if (rgbMode) {
    // spawn flames at each robot tail
    for (const b of robots) spawnFlame(b.x, b.y + b.size * 0.55);
    drawFlames(); // draw on top so it's visible
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/***********************
 * 6) Ray’s Assistant Chat
 ***********************/
const chatFab = document.getElementById("chatFab");
const chatBox = document.getElementById("chatBox");
const chatLog = document.getElementById("chatLog");
const chatClose = document.getElementById("chatClose");
const chatMsg = document.getElementById("chatMsg");
const chatSend = document.getElementById("chatSend");

function addBubble(text, who = "bot") {
  const d = document.createElement("div");
  d.className = "bubble " + who;
  d.textContent = text;
  chatLog.appendChild(d);
  chatLog.scrollTop = chatLog.scrollHeight;
}
if (chatFab) {
  chatFab.addEventListener("click", () => {
    chatBox.style.display = "block";
    chatLog.innerHTML = "";
    addBubble("Hi! This will be done for the future.");
  });
}
if (chatClose) {
  chatClose.addEventListener("click", () => {
    chatBox.style.display = "none"; chatLog.innerHTML = "";
  });
}
if (chatSend) {
  chatSend.addEventListener("click", () => {
    const q = chatMsg.value.trim(); if (!q) return;
    addBubble(q, "me"); chatMsg.value = "";
    setTimeout(() => addBubble("This will be done for the future."), 600);
  });
}

/***********************
 * 7) Ambient Synth (audible + smooth fade)
 ***********************/
let audioCtx, osc, gain, lfo, lfoGain, ambientOn = false;
const musicBtn = document.getElementById("musicToggle");

async function startAmbient(){
  audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if (audioCtx.state === "suspended") await audioCtx.resume();

  osc = audioCtx.createOscillator();
  gain = audioCtx.createGain();
  lfo = audioCtx.createOscillator();
  lfoGain = audioCtx.createGain();

  // deep sci-fi hum (change to sine/196 for lighter)
  osc.type = "sawtooth";
  osc.frequency.value = 80;
  gain.gain.value = 0.00001; // start silent
  lfo.frequency.value = 0.07; lfoGain.gain.value = 35;

  lfo.connect(lfoGain).connect(osc.frequency);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(); lfo.start();

  const now = audioCtx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.linearRampToValueAtTime(0.012, now + 1.2); // fade in
}
async function stopAmbient(){
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.linearRampToValueAtTime(0.00001, now + 0.8); // fade out
  setTimeout(async () => { if (audioCtx && audioCtx.state !== "closed") await audioCtx.close(); }, 900);
}
if (musicBtn) {
  musicBtn.addEventListener("click", async () => {
    try {
      if (!ambientOn) {
        await startAmbient(); ambientOn = true; musicBtn.textContent = "🔇 Stop Ambient";
      } else {
        await stopAmbient(); ambientOn = false; musicBtn.textContent = "🎵 Ambient";
      }
    } catch (e) { console.warn("Audio init failed:", e); }
  });
}

/***********************
 * 8) RGB Universe Mode Toggle
 ***********************/
const modeBtn = document.getElementById("modeToggle");
if (modeBtn) {
  modeBtn.addEventListener("click", () => {
    rgbMode = !rgbMode;
    document.body.classList.toggle("rgb-active", rgbMode);
    modeBtn.textContent = rgbMode ? "🌌 Normal Mode" : "🌈 RGB Mode";
  });
}
// =====================
// 9) Global Heart Counter (shared across all devices)
// =====================
(() => {
  const heartBtn = document.getElementById("heartBtn");
  const heartCountEl = document.getElementById("heartCount");
  if (!heartBtn || !heartCountEl) return;

  const NS  = "rayhamo98";
  const KEY = "hearts_total_global";   // one fixed shared key
  const USER_FLAG = "ray_hearted_global";
  const CACHE_KEY = "ray_heart_cache_global";

  // Show cached value first
  heartCountEl.textContent = localStorage.getItem(CACHE_KEY) || "0";

  // Fetch live global count
  async function loadHearts() {
    try {
      const r = await fetch(`https://api.countapi.xyz/get/${NS}/${KEY}`);
      const d = await r.json();
      heartCountEl.textContent = d.value ?? 0;
      localStorage.setItem(CACHE_KEY, d.value);
    } catch {
      /* offline fallback */
    }
  }

  // Increment only once per browser
  async function addHeartOnce() {
    if (localStorage.getItem(USER_FLAG) === "1") {
      heartBtn.classList.add("liked");
      setTimeout(() => heartBtn.classList.remove("liked"), 250);
      return;
    }
    try {
      const r = await fetch(`https://api.countapi.xyz/hit/${NS}/${KEY}?amount=1`);
      const d = await r.json();
      heartCountEl.textContent = d.value ?? (parseInt(heartCountEl.textContent) + 1);
      localStorage.setItem(USER_FLAG, "1");
      localStorage.setItem(CACHE_KEY, heartCountEl.textContent);
      heartBtn.classList.add("liked");
      setTimeout(() => heartBtn.classList.remove("liked"), 250);
    } catch {
      // fallback
      const v = parseInt(heartCountEl.textContent) + 1;
      heartCountEl.textContent = v;
      localStorage.setItem(USER_FLAG, "1");
      localStorage.setItem(CACHE_KEY, v);
    }
  }

  loadHearts();
  heartBtn.addEventListener("click", addHeartOnce);
})();


  ensureCounter();
  heartBtn.addEventListener("click", hitOnce);
})();

