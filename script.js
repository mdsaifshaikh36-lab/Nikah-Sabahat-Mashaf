// ===============================
// NIKAH COUNTDOWN + SCRATCH CARD
// ===============================

const target = new Date("2026-09-24T21:00:00+05:30").getTime();

const scratchCanvas = document.getElementById("scratchCanvas");
const scratchCard = document.getElementById("scratchCard");
const countdownSection = document.getElementById("countdownSection");

let isScratching = false;
let revealed = false;

// -------------------------------
// COUNTDOWN
// -------------------------------

function updateCountdown() {
  if (!revealed) return;

  const now = Date.now();
  let diff = target - now;

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;

  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

// -------------------------------
// SCRATCH CARD
// -------------------------------

function setupScratchCard() {
  if (!scratchCanvas) return;

  const ctx = scratchCanvas.getContext("2d", {
    willReadFrequently: true
  });

  function resizeCanvas() {
    const rect = scratchCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    scratchCanvas.width = rect.width * dpr;
    scratchCanvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Gold scratch layer
    const gradient = ctx.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#d8b45c");
    gradient.addColorStop(0.5, "#f0cf7b");
    gradient.addColorStop(1, "#c69a3d");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle gold texture
    ctx.fillStyle = "rgba(255,255,255,0.10)";

    for (let i = 0; i < 350; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const size = Math.random() * 2 + 1;

      ctx.fillRect(x, y, size, size);
    }

    // Scratch text
    ctx.globalCompositeOperation = "source-over";
    ctx.textAlign = "center";

    ctx.fillStyle = "#fff8df";
    ctx.font = "600 22px Georgia";

    ctx.fillText(
      "SCRATCH ME ✦",
      rect.width / 2,
      rect.height / 2 - 5
    );

    ctx.font = "15px Georgia";

    ctx.fillText(
      "Use your finger or mouse",
      rect.width / 2,
      rect.height / 2 + 25
    );
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  function scratch(x, y) {
    if (revealed) return;

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  }

  function getPosition(e) {
    const rect = scratchCanvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Mouse
  scratchCanvas.addEventListener("pointerdown", (e) => {
    isScratching = true;
    scratchCanvas.setPointerCapture(e.pointerId);

    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  });

  scratchCanvas.addEventListener("pointermove", (e) => {
    if (!isScratching) return;

    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  });

  scratchCanvas.addEventListener("pointerup", () => {
    isScratching = false;
  });

  scratchCanvas.addEventListener("pointercancel", () => {
    isScratching = false;
  });

  // Check how much has been scratched
  function checkScratchProgress() {
    const width = scratchCanvas.width;
    const height = scratchCanvas.height;

    // Sample pixels rather than checking every pixel
    const imageData = ctx.getImageData(
      0,
      0,
      width,
      height
    ).data;

    let transparent = 0;
    let total = 0;

    const step = 20;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;

        total++;

        if (imageData[index + 3] < 80) {
          transparent++;
        }
      }
    }

    const percentage = (transparent / total) * 100;

    if (percentage >= 55) {
      revealCard();
    }
  }

  function revealCard() {
    if (revealed) return;

    revealed = true;

    scratchCanvas.style.transition =
      "opacity 0.8s ease";

    scratchCanvas.style.opacity = "0";

    setTimeout(() => {
      scratchCanvas.style.display = "none";
      scratchCard.classList.add("revealed");
    }, 800);

    // NOW countdown starts
    countdownSection.classList.add("revealed");

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

// -------------------------------
// START
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  setupScratchCard();

  const musicBtn = document.getElementById("musicBtn");

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      alert(
        "Music button ready — upload your MP3 later if you want background music."
      );
    });
  }
});
