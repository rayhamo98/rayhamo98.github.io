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
// 5) Galaxy + Meteors + Floating Robots (single loop)
// =====================
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resizeCanvas); resizeCanvas();

// --- stars ---
let stars = [];
(function initStars(num = 260){
  for (let k = 0; k < num; k++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      tw: Math.random() * 0.03 + 0.005,
      phase: Math.random() * Math.PI * 2
    });
  }
})();

// --- meteors ---
let meteors = [];
function spawnMeteor() {
  meteors.push({
    x: -140,
    y: Math.random() * canvas.height * 0.6,
    vx: 10 + Math.random() * 8,
    vy: 4 + Math.random() * 3
  });
}

// --- floating robots ---
const robots = [];
for (let r = 0; r < 10; r++) {
  robots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 40 + Math.random() * 40,
    dx: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
    dy: (Math.random() * 0.2 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
    hue: Math.random() * 360,
    spin: Math.random() * Math.PI * 2
  });
}

function drawBackground() {
  const g = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.8
  );
  g.addColorStop(0, "#08121f");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRobots() {
  for (const b of robots) {
    b.x += b.dx; b.y += b.dy; b.spin += 0.002; b.hue = (b.hue + 0.3) % 360;

    // wrap
    if (b.x < -120) b.x = canvas.width + 120;
    if (b.x > canvas.width + 120) b.x = -120;
    if (b.y < -120) b.y = canvas.height + 120;
    if (b.y > canvas.height + 120) b.y = -120;

    // draw
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.sin(b.spin) * 0.25);

    ctx.strokeStyle = `hsl(${b.hue}, 100%, 85%)`;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.rect(-b.size / 2, -b.size / 2, b.size, b.size);         // outer
    ctx.rect(-b.size / 4, -b.size / 4, b.size / 2, b.size / 2); // inner
    // glow pass
    ctx.shadowColor = `hsl(${b.hue}, 100%, 70%)`;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();
  }
}

function animate() {
  drawBackground();

  // stars
  for (const s of stars) {
    const a = 0.5 + 0.5 * Math.sin(performance.now() * s.tw + s.phase);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }

  // meteors
  if (Math.random() < 0.004) spawnMeteor();
  for (const m of meteors) {
    m.x += m.vx; m.y += m.vy;
    const grad = ctx.createLinearGradient(m.x - 100, m.y - 50, m.x, m.y);
    grad.addColorStop(0, "rgba(110,168,255,0)");
    grad.addColorStop(1, "rgba(110,168,255,0.9)");
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(m.x - 100, m.y - 50); ctx.lineTo(m.x, m.y); ctx.stroke();
  }
  meteors = meteors.filter(m => m.x < canvas.width + 200 && m.y < canvas.height + 200);

  // robots last (on top of stars/meteors)
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
  chatBox.style.display = "none";
  chatLog.innerHTML = "";
});
chatSend.addEventListener("click", () => {
  const q = chatMsg.value.trim();
  if (!q) return;
  addBubble(q, "me"); chatMsg.value = "";
  setTimeout(() => addBubble("This will be done for the future."), 600);
});
