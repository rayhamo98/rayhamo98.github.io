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
//  5. Galaxy Starfield + Meteors + Floating Robots
// =====================
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let W, H, stars = [], meteors = [], bots = [];

function resizeCanvas(){
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
addEventListener("resize", resizeCanvas);
resizeCanvas();

// make colorful nebula gradient behind everything
function paintGalaxy(){
  const g = ctx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,H*0.9);
  g.addColorStop(0,"#0b0f14");
  g.addColorStop(0.3,"#10253b");
  g.addColorStop(0.55,"#1a2f48");
  g.addColorStop(0.75,"#111a27");
  g.addColorStop(1,"#090c11");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);
}

// build objects
function initStars(n=280){
  stars = Array.from({length:n},()=>({
    x:Math.random()*W,
    y:Math.random()*H,
    r:Math.random()*1.4+0.2,
    a:Math.random(),
    s:Math.random()*0.8+0.2
  }));
}
initStars();

function spawnMeteor(){
  const y=Math.random()*H*0.6;
  meteors.push({x:-80,y,dx:10+Math.random()*6,dy:4+Math.random()*3});
}
function spawnBot(){
  bots.push({
    x:Math.random()*W,
    y:Math.random()*H,
    r:30+Math.random()*40,
    speed:(Math.random()*0.3+0.05)*(Math.random()<0.5?1:-1),
    alpha:0.05+Math.random()*0.15
  });
}
for(let i=0;i<6;i++)spawnBot();

function drawBot(b){
  ctx.save();
  ctx.translate(b.x,b.y);
  ctx.rotate(Math.sin(Date.now()/1000 + b.x)*0.2);
  ctx.strokeStyle=`rgba(92,242,214,${b.alpha})`;
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.rect(-b.r/2,-b.r/2,b.r,b.r);
  ctx.moveTo(-b.r/4,-b.r/4);
  ctx.rect(-b.r/4,-b.r/4,b.r/2,b.r/2);
  ctx.stroke();
  ctx.restore();
}

let last=0;
function animateGalaxy(t){
  const dt=(t-last)||16; last=t;
  paintGalaxy();

  // twinkling stars
  for(const s of stars){
    s.a += (Math.random()-0.5)*0.04;
    s.a=Math.max(0.2,Math.min(1,s.a));
    ctx.fillStyle=`rgba(220,240,255,${s.a})`;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }

  // meteors
  if(Math.random()<0.006)spawnMeteor();
  for(const m of meteors){
    m.x+=m.dx; m.y+=m.dy;
    const g=ctx.createLinearGradient(m.x-100,m.y-50,m.x,m.y);
    g.addColorStop(0,"rgba(110,168,255,0)");
    g.addColorStop(1,"rgba(110,168,255,0.9)");
    ctx.strokeStyle=g;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(m.x-100,m.y-50);
    ctx.lineTo(m.x,m.y);
    ctx.stroke();
  }
  meteors=meteors.filter(m=>m.x<W+100 && m.y<H+100);

  // moving robots
  for(const b of bots){
    b.x+=b.speed;
    if(b.x<-80) b.x=W+80;
    if(b.x>W+80) b.x=-80;
    drawBot(b);
  }

  requestAnimationFrame(animateGalaxy);
}
requestAnimationFrame(animateGalaxy);
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
