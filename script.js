const WEDDING_DATE = '2026-09-24T21:00:00+05:30';

function openInvitation(){
  document.getElementById('opening').classList.add('closed');
  makePetals();
}
function makePetals(){
  const box=document.getElementById('petals');
  for(let i=0;i<18;i++){
    const p=document.createElement('span');p.className='petal';p.textContent=Math.random()>0.45?'✦':'❧';
    p.style.left=Math.random()*100+'%';p.style.animationDuration=(5+Math.random()*7)+'s';p.style.animationDelay=(Math.random()*2)+'s';box.appendChild(p);
    setTimeout(()=>p.remove(),13000);
  }
}

// Countdown is intentionally hidden until the scratch card is revealed.
function updateCountdown(){
  const diff=new Date(WEDDING_DATE).getTime()-Date.now();
  const vals=diff>0?[
    Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60
  ]:[0,0,0,0];
  ['days','hours','mins','secs'].forEach((id,i)=>document.getElementById(id).textContent=vals[i]);
}
updateCountdown();setInterval(updateCountdown,1000);

// Scratch reveal — robust mouse + touch + pointer support.
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let scratching = false, revealed = false;

function paintScratchCover() {
  const r = canvas.getBoundingClientRect();
  const d = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  canvas.width = Math.round(r.width * d);
  canvas.height = Math.round(r.height * d);
  canvas.style.touchAction = 'none';
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.globalCompositeOperation = 'source-over';

  const g = ctx.createLinearGradient(0, 0, r.width, r.height);
  g.addColorStop(0, '#e4c982');
  g.addColorStop(.5, '#b18a3e');
  g.addColorStop(1, '#725522');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, r.width, r.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff4c9';
  ctx.font = '700 28px Georgia, serif';
  ctx.fillText('SCRATCH ME ✦', r.width / 2, r.height / 2 - 12);
  ctx.font = '18px Georgia, serif';
  ctx.fillText('Reveal our Nikah date', r.width / 2, r.height / 2 + 25);
}

function getPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: e.clientX - r.left,
    y: e.clientY - r.top
  };
}

function scratch(e) {
  if (!scratching || revealed) return;
  e.preventDefault();
  const p = getPoint(e);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(p.x, p.y, 34, 0, Math.PI * 2);
  ctx.fill();
  checkScratch();
}

function checkScratch() {
  // Check a smaller sample for speed and reliability on high-DPI phones.
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let clear = 0;
  const step = 16;
  let total = 0;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const a = data[(y * canvas.width + x) * 4 + 3];
      if (a < 80) clear++;
      total++;
    }
  }
  if (total && clear / total >= 0.42) revealScratch();
}

function revealScratch() {
  if (revealed) return;
  revealed = true;
  canvas.style.pointerEvents = 'none';
  canvas.style.transition = 'opacity .65s ease';
  canvas.style.opacity = '0';
  document.getElementById('scratchHint').style.opacity = '0';
  document.getElementById('scratchStatus').textContent = 'Alhamdulillah ♥ The countdown is now revealed.';

  const section = document.getElementById('countdown');
  section.classList.remove('locked');
  makePetals();
  setTimeout(() => {
    canvas.style.display = 'none';
    document.getElementById('scratchHint').style.display = 'none';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 700);
}

paintScratchCover();
window.addEventListener('resize', () => {
  if (!revealed) paintScratchCover();
});

canvas.addEventListener('pointerdown', e => {
  scratching = true;
  try { canvas.setPointerCapture(e.pointerId); } catch {}
  scratch(e);
});
canvas.addEventListener('pointermove', scratch);
canvas.addEventListener('pointerup', e => {
  scratching = false;
  try { canvas.releasePointerCapture(e.pointerId); } catch {}
});
canvas.addEventListener('pointercancel', () => scratching = false);
canvas.addEventListener('pointerleave', () => { scratching = false; });

const music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn');
musicBtn.addEventListener('click',async()=>{try{if(music.paused){await music.play();musicBtn.textContent='❚❚'}else{music.pause();musicBtn.textContent='♫'}}catch{musicBtn.textContent='♫';alert('Music ke liye website folder mein music.mp3 file add kar dein.')}});
