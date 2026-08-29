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

// Scratch reveal — works with mouse, pointer and touch.
const canvas=document.getElementById('scratchCanvas');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
let scratching=false,revealed=false;
function resizeScratch(){
  const r=canvas.getBoundingClientRect(),d=Math.max(1,window.devicePixelRatio||1);
  canvas.width=Math.floor(r.width*d);canvas.height=Math.floor(r.height*d);ctx.setTransform(d,0,0,d,0,0);
  ctx.globalCompositeOperation='source-over';
  const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#d9bd75');g.addColorStop(.5,'#a47f37');g.addColorStop(1,'#6b511f');ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
  ctx.fillStyle='rgba(255,241,188,.95)';ctx.font='700 26px Cormorant Garamond';ctx.textAlign='center';ctx.fillText('SCRATCH ME ✦',r.width/2,r.height/2-5);ctx.font='18px Cormorant Garamond';ctx.fillText('Reveal our Nikah date',r.width/2,r.height/2+28);
}
resizeScratch();window.addEventListener('resize',resizeScratch);
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX??e.touches?.[0]?.clientX)-r.left,y:(e.clientY??e.touches?.[0]?.clientY)-r.top}}
function scratch(e){if(!scratching||revealed)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.x,p.y,30,0,Math.PI*2);ctx.fill();checkScratch()}
function checkScratch(){
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;
  for(let i=3;i<data.length;i+=4)if(data[i]<20)clear++;
  if(clear/(data.length/4)>.50)revealScratch();
}
function revealScratch(){
  if(revealed)return;revealed=true;canvas.style.transition='.6s';canvas.style.opacity='0';document.getElementById('scratchHint').style.opacity='0';
  setTimeout(()=>{canvas.style.display='none';document.getElementById('scratchHint').style.display='none';},650);
  document.getElementById('scratchStatus').textContent="Alhamdulillah ♥ The countdown is now revealed.";
  const section=document.getElementById('countdown');section.classList.remove('locked');
  makePetals();setTimeout(()=>section.scrollIntoView({behavior:'smooth',block:'start'}),500);
}
canvas.addEventListener('pointerdown',e=>{scratching=true;scratch(e)});canvas.addEventListener('pointermove',scratch);window.addEventListener('pointerup',()=>scratching=false);
canvas.addEventListener('touchstart',e=>{scratching=true;scratch(e)},{passive:false});canvas.addEventListener('touchmove',scratch,{passive:false});canvas.addEventListener('touchend',()=>scratching=false);

const music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn');
musicBtn.addEventListener('click',async()=>{try{if(music.paused){await music.play();musicBtn.textContent='❚❚'}else{music.pause();musicBtn.textContent='♫'}}catch{musicBtn.textContent='♫';alert('Music ke liye website folder mein music.mp3 file add kar dein.')}});
