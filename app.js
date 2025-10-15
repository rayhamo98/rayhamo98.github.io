// =====================
//  1. Typing Effect
// =====================
const words = ["Robotics", "AI Systems", "Autonomous Tech", "Intelligent Machines"];
let i = 0, j = 0, deleting = false;
const typingEl = document.getElementById("typing");

function typeEffect() {
  const word = words[i];
  typingEl.textContent = deleting ? word.slice(0, j--) : word.slice(0, j++);
  if (!deleting && j === word.length + 3) deleting = true;
  if (deleting && j === 0) {
    deleting = false;
    i = (i + 1) % words.length;
  }
  setTimeout(typeEffect, deleting ? 60 : 120);
}
typeEffect();

// =====================
//  2. Footer Year
// =====================
document.getElementById("year").textContent = new Date().getFullYear();

// =====================
//  3. AI Voice Greeting
// =====================
document.getElementById("sayHi").addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance("Welcome to Ray's Future.");
  utter.lang = "en-US";
  utter.rate = 1.05;
  utter.pitch = 1.05;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
});

// =====================
//  4. Scroll Reveal Animations
// =====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =====================
//  5. Galaxy Starfield + Meteors
// =====================
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let W, H, stars = [], meteors = [];

function resizeCanvas() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
addEventListener("resize", resizeCanvas);
resizeCanvas();

function initStars(num = 220) {
  stars = Array.from({ length: num }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.6 + 0.2,
  }));
}
initStars();

function spawnMeteor() {
  const y = Math.random() * H * 0.6;
  meteors.push({
    x: -50,
    y,
    vx: 8 + Math.random() * 5,
    vy: 3 + Math.random() * 2,
    life: 0,
  });
}

let lastTime = 0;
function animate(t) {
  const dt = (t - lastTime) || 16;
  lastTime = t;
  ctx.clearRect(0, 0, W, H);

  // stars twinkle
  for (const s of stars) {
    s.a += (Math.random() - 0.5) * 0.05;
    s.a = Math.max(0.2, Math.min(1, s.a));
    ctx.fillStyle = `rgba(200,220,255,${s.a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // meteors
  if (Math.random() < 0.008) spawnMeteor();
  for (const m of meteors) {
    m.x += m.vx;
    m.y += m.vy;
    const grad = ctx.createLinearGradient(m.x - 80, m.y - 40, m.x, m.y);
    grad.addColorStop(0, "rgba(110,168,255,0)");
    grad.addColorStop(1, "rgba(110,168,255,0.9)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x - 80, m.y - 40);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
  }
  meteors = meteors.filter((m) => m.x < W + 100 && m.y < H + 100);

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// =====================
//  6. Ray’s Assistant Chat
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

// open chat
chatFab.addEventListener("click", () => {
  chatBox.style.display = "block";
  chatLog.innerHTML = "";
  addBubble("Hi! This will be done for the future.");
});

// close chat
chatClose.addEventListener("click", () => {
  chatBox.style.display = "none";
  chatLog.innerHTML = "";
});

// send message
chatSend.addEventListener("click", () => {
  const q = chatMsg.value.trim();
  if (!q) return;
  addBubble(q, "me");
  chatMsg.value = "";
  setTimeout(() => addBubble("This will be done for the future."), 600);
});
