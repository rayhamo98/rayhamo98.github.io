// =====================
// 1) Typing Effect
// =====================
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

// =====================
// 2) Footer Year
// =====================
document.getElementById("year").textContent = new Date().getFullYear();

// =====================
// 3) AI Voice Greeting
// =====================
document.getElementById("sayHi").addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance("Welcome to Ray's Future.");
  utter.lang = "en-US"; utter.rate = 1.05; utter.pitch = 1.05;
  speechSynthesis.cancel(); speechSynthesis.speak(utter);
});

// =====================
// 4) Scroll Reveal
// =====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); observer.unobserve(e.target); } });
},{ threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =====================
// 5) Galaxy Scene (Parallax Stars + Nebula + Meteors + Robots)
// =====================
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d", { alpha: true });
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resizeCanvas); resizeCanvas();

// --- mouse interactivity (for parallax + robots) ---
const mouse = { x: innerWidth/2, y: innerHeight/2 };
addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// --- star layers (parallax) ---
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

// --- robots (enhanced visuals, color shift, mouse influence) ---
const robots = [];
for (let r = 0; r < 10; r++) {
  robots.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: 40 + Math.random()*40,
    dx: (Math.random()*0.4+0.1)*(Math.random()<0.5?1:-1),
    dy: (Math.random()*0.2+0.05)*(Math.random()<0.5?1:-1),
    hue: Math.random()*360,
    spin: Math.random()*Math.PI*2
  });
}

function drawBackground() {
  // Big dark radial gradient (galaxy core)
  const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*0.9);
  g.addColorStop(0, "#091226");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

  // Nebula passes (soft glows)
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

function drawStarsLayer(arr, parallaxFactor, colorBase=255) {
  const offX = (mouse.x - canvas.width/2) * parallaxFactor;
  const offY = (mouse.y - canvas.height/2) * parallaxFactor;
  for (const s of arr) {
    const a = 0.5 + 0.5 * Math.sin(performance.now() * s.tw + s.ph);
    ctx.fillStyle = `rgba(${colorBase},${colorBase},255,${a})`;
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

    // lens flare glow at the head
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  meteors = meteors.filter(m => m.x < canvas.width + 220 && m.y < canvas.height + 220);
}

function drawRobots() {
  for (const b of robots) {
    // gentle mouse attraction
    const toMx = mouse.x - b.x, toMy = mouse.y - b.y;
    b.dx += (toMx * 0.00002); b.dy += (toMy * 0.00002);
    // limit drift speed
    b.dx = Math.max(-0.7, Math.min(0.7, b.dx));
    b.dy = Math.max(-0.5, Math.min(0.5, b.dy));

    // move + wrap
    b.x += b.dx; b.y += b.dy; b.spin += 0.002; b.hue = (b.hue + 0.35) % 360;
    if (b.x < -140) b.x = canvas.width + 140;
    if (b.x > canvas.width + 140) b.x = -140;
    if (b.y < -140) b.y = canvas.height + 140;
    if (b.y > canvas.height + 140) b.y = -140;

    // draw: metallic frame + sensors + glow
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.sin(b.spin) * 0.25);

    // outer frame (metallic gradient illusion using two strokes)
    ctx.lineWidth = 3; ctx.globalAlpha = 0.95;
    ctx.strokeStyle = `hsl(${b.hue}, 100%, 85%)`;
    ctx.shadowColor = `hsl(${b.hue}, 100%, 70%)`;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.rect(-b.size/2, -b.size/2, b.size, b.size);
    ctx.rect(-b.size/4, -b.size/4, b.size/2, b.size/2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // inner “sensors” (two glowing circles)
    const eyeOffset = b.size*0.22;
    ctx.fillStyle = `hsl(${(b.hue+40)%360}, 100%, 65%)`;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(-eyeOffset, -eyeOffset*0.4, b.size*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( eyeOffset, -eyeOffset*0.4, b.size*0.06, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }
}

function animate() {
  drawBackground();
  // parallax: far then near
  drawStarsLayer(starsFar, 0.010, 230);
  drawStarsLayer(starsNear, 0.020, 255);
  drawMeteors();
  drawRobots();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// =====================
// 6) Ray’s Assistant Chat
// =====================
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
chatFab.addEventListener("click", () => {
  chatBox.style.display = "block";
  chatLog.innerHTML = "";
  addBubble("Hi! This will be done for the future.");
});
chatClose.addEventListener("click", () => {
  chatBox.style.display = "none"; chatLog.innerHTML = "";
});
chatSend.addEventListener("click", () => {
  const q = chatMsg.value.trim(); if (!q) return;
  addBubble(q, "me"); chatMsg.value = "";
  setTimeout(() => addBubble("This will be done for the future."), 600);
});

// =====================
// 7) Ambient Synth Toggle (WebAudio, very soft)
// =====================
let audioCtx, osc, gain, lfo, lfoGain, ambientOn = false;
function startAmbient(){
  audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  osc = audioCtx.createOscillator();
  gain = audioCtx.createGain();
  lfo = audioCtx.createOscillator();
  lfoGain = audioCtx.createGain();

  osc.type = "sine";       osc.frequency.value = 196;       // G3
  gain.gain.value = 0.0009;                                 // super soft
  lfo.frequency.value = 0.07; lfoGain.gain.value = 35;      // slow vibrato

  lfo.connect(lfoGain).connect(osc.frequency);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(); lfo.start();
}
document.getElementById("musicToggle").addEventListener("click", async ()=>{
  if(!ambientOn){ startAmbient(); ambientOn = true; }
  else { if(audioCtx) await audioCtx.close(); ambientOn = false; }
});

// =====================
// 8) RGB Universe Mode Toggle 🌈🔥
// =====================
let rgbMode = false;
let flames = []; // flame particles
const modeBtn = document.getElementById("modeToggle");

modeBtn.addEventListener("click", () => {
  rgbMode = !rgbMode;
  document.body.classList.toggle("rgb-active", rgbMode);
  modeBtn.textContent = rgbMode ? "🌌 Normal Mode" : "🌈 RGB Mode";
});

// --- Flame particle generator ---
function spawnFlame(x, y) {
  for (let i = 0; i < 4; i++) {
    flames.push({
      x: x + Math.random() * 10 - 5,
      y: y + Math.random() * 10 - 5,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 1.8 - 0.3,
      life: 1,
      color: `hsl(${Math.random() * 30}, 100%, 50%)`
    });
  }
}

function drawFlames() {
  for (let f of flames) {
    ctx.globalAlpha = f.life;
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    f.x += f.vx;
    f.y += f.vy;
    f.life -= 0.02;
  }
  flames = flames.filter(f => f.life > 0);
  ctx.globalAlpha = 1;
}

// --- Hook flames + RGB shifts into main animation ---
const oldDrawRobots = drawRobots;
drawRobots = function () {
  for (const b of robots) {
    if (rgbMode) spawnFlame(b.x, b.y + b.size / 2); // emit fire
  }
  if (rgbMode) drawFlames();
  oldDrawRobots(); // draw regular robots
};

// --- RGB stars color cycling ---
const oldDrawStarsLayer = drawStarsLayer;
drawStarsLayer = function (arr, parallaxFactor, colorBase = 255) {
  const offX = (mouse.x - canvas.width / 2) * parallaxFactor;
  const offY = (mouse.y - canvas.height / 2) * parallaxFactor;
  for (const s of arr) {
    const a = 0.5 + 0.5 * Math.sin(performance.now() * s.tw + s.ph);
    const hue = rgbMode ? (performance.now() * 0.05 + s.ph * 50) % 360 : 210;
    ctx.fillStyle = rgbMode
      ? `hsla(${hue},100%,70%,${a})`
      : `rgba(${colorBase},${colorBase},255,${a})`;
    ctx.beginPath();
    ctx.arc(s.x - offX, s.y - offY, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
};
