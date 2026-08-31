// ==========================================
// SABAHAT & MASHAF — NIKAH WEBSITE
// Scratch → Reveal → Countdown
// ==========================================

const TARGET_DATE = new Date("2026-09-24T21:00:00+05:30").getTime();

let countdownTimer = null;
let revealed = false;

document.addEventListener("DOMContentLoaded", () => {
  setupScratchCard();
});

// ==========================================
// SCRATCH CARD
// ==========================================

function setupScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const card = document.getElementById("scratchCard");
  const status = document.getElementById("scratchStatus");

  if (!canvas || !card) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  let drawing = false;
  let lastPoint = null;
  let checkCounter = 0;

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawGoldCover(rect.width, rect.height);
  }

  function drawGoldCover(width, height) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#c79b43");
    gradient.addColorStop(0.25, "#e7c66f");
    gradient.addColorStop(0.5, "#f1d27e");
    gradient.addColorStop(0.75, "#dfbd61");
    gradient.addColorStop(1, "#b98732");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Elegant subtle texture
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 1.3 + 0.3;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff8df";
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Decorative border
    ctx.strokeStyle = "rgba(255,248,223,.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Scratch instruction
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#fff8df";
    ctx.font = "700 23px Georgia, serif";
    ctx.fillText("SCRATCH ME ✦", width / 2, height / 2 - 12);

    ctx.font = "15px Georgia, serif";
    ctx.fillText("Use your mouse or finger", width / 2, height / 2 + 19);

    ctx.font = "13px Georgia, serif";
    ctx.globalAlpha = .82;
    ctx.fillText("Reveal the blessed moment", width / 2, height / 2 + 43);
    ctx.globalAlpha = 1;
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function eraseAt(x, y) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 60;

    ctx.beginPath();

    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.01, y + 0.01);
    }

    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    lastPoint = { x, y };

    checkCounter++;

    // Checking every few strokes keeps the scratch smooth.
    if (checkCounter % 8 === 0) {
      checkScratchPercentage();
    }
  }

  function checkScratchPercentage() {
    if (revealed) return;

    const w = canvas.width;
    const h = canvas.height;

    const image = ctx.getImageData(0, 0, w, h).data;

    let transparent = 0;
    let sampled = 0;

    // Sample pixels for performance.
    const step = Math.max(8, Math.floor(window.devicePixelRatio || 1) * 8);

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const alpha = image[(y * w + x) * 4 + 3];

        sampled++;

        if (alpha < 80) {
          transparent++;
        }
      }
    }

    const percentage = (transparent / sampled) * 100;

    if (status) {
      status.textContent =
        percentage < 30
          ? "Keep scratching… ✦"
          : "Revealing your Nikah moment…";
    }

    if (percentage >= 30) {
      reveal();
    }
  }

  function reveal() {
    if (revealed) return;
const bgMusic = document.getElementById("bgMusic");
if (bgMusic) {
    bgMusic.play().catch(() => {});
}
    revealed = true;

    card.classList.add("revealed");

    if (status) {
      status.textContent = "Alhamdulillah ♥ The journey begins.";
    }

    canvas.style.transition = "opacity .8s ease";
    canvas.style.opacity = "0";

    setTimeout(() => {
      canvas.style.display = "none";
    }, 850);

    startCountdown();
  }

  // Pointer Events work with both mouse and touch.
  canvas.addEventListener("pointerdown", (event) => {
    if (revealed) return;

    event.preventDefault();
    drawing = true;
    lastPoint = null;

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (_) {}

    const point = getPoint(event);
    eraseAt(point.x, point.y);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing || revealed) return;

    event.preventDefault();

    const point = getPoint(event);
    eraseAt(point.x, point.y);
  });

  function stopDrawing() {
    drawing = false;
    lastPoint = null;
    checkScratchPercentage();
  }

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", () => {
    // Do not stop on leave; pointer capture handles normal dragging.
  });

  window.addEventListener("resize", () => {
    if (!revealed) {
      resizeCanvas();
    }
  });

  resizeCanvas();
}

// ==========================================
// COUNTDOWN
// ==========================================

function startCountdown() {
  const countdownSection = document.getElementById("countdownSection");

  if (!countdownSection) return;

  countdownSection.classList.add("revealed");

  updateCountdown();

  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = Date.now();
  let difference = TARGET_DATE - now;

  if (difference < 0) {
    difference = 0;
  }

  const days = Math.floor(difference / 86400000);
  difference %= 86400000;

  const hours = Math.floor(difference / 3600000);
  difference %= 3600000;

  const minutes = Math.floor(difference / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  setText("days", days);
  setText("hours", hours);
  setText("minutes", minutes);
  setText("seconds", seconds);
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = String(value).padStart(2, "0");
  }
}
