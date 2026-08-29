const WEDDING_DATE = '2026-09-24T21:00:00+05:30';

function openInvitation(){
  const opening = document.getElementById('opening');
  if (opening) {
    opening.classList.add('closed');
  }
  makePetals();
}

function makePetals(){
  const box = document.getElementById('petals');
  if (!box) return;

  for(let i = 0; i < 18; i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = Math.random() > 0.45 ? '✦' : '❧';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = (Math.random() * 2) + 's';
    box.appendChild(p);

    setTimeout(() => p.remove(), 13000);
  }
}

/* =========================
   COUNTDOWN
========================= */

function updateCountdown(){

  const diff =
    new Date(WEDDING_DATE).getTime() - Date.now();

  const values = diff > 0
    ? [
        Math.floor(diff / 86400000),
        Math.floor(diff / 3600000) % 24,
        Math.floor(diff / 60000) % 60,
        Math.floor(diff / 1000) % 60
      ]
    : [0,0,0,0];

  const ids = ['days','hours','mins','secs'];

  ids.forEach((id,i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = values[i];
  });
}

updateCountdown();
setInterval(updateCountdown,1000);


/* =========================
   SCRATCH CARD
========================= */

const canvas = document.getElementById('scratchCanvas');

if(canvas){

  const ctx = canvas.getContext('2d');

  let isScratching = false;
  let revealed = false;

  function resizeCanvas(){

    const rect = canvas.getBoundingClientRect();

    const ratio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);

    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

    paintCover();
  }


  function paintCover(){

    const rect = canvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    ctx.globalCompositeOperation = 'source-over';

    const gradient = ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

    gradient.addColorStop(0,'#e7cf8d');
    gradient.addColorStop(.5,'#c9a45b');
    gradient.addColorStop(1,'#8c682b');

    ctx.fillStyle = gradient;
    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#fff6d8';

    ctx.font =
      '700 27px Georgia, serif';

    ctx.fillText(
      'SCRATCH ME ✦',
      width / 2,
      height / 2 - 15
    );

    ctx.font =
      '17px Georgia, serif';

    ctx.fillText(
      'Reveal our Nikah date',
      width / 2,
      height / 2 + 25
    );
  }


  function getPosition(event){

    const rect =
      canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }


  function scratch(event){

    if(!isScratching || revealed) return;

    event.preventDefault();

    const pos = getPosition(event);

    ctx.globalCompositeOperation =
      'destination-out';

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      38,
      0,
      Math.PI * 2
    );

    ctx.fill();

    checkProgress();
  }


  function checkProgress(){

    const data = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparent = 0;
    let total = 0;

    const step = 20;

    for(
      let y = 0;
      y < canvas.height;
      y += step
    ){

      for(
        let x = 0;
        x < canvas.width;
        x += step
      ){

        const alpha =
          data[
            (y * canvas.width + x) * 4 + 3
          ];

        if(alpha < 100){
          transparent++;
        }

        total++;
      }
    }

    const percentage =
      transparent / total;

    if(percentage >= 0.35){
      revealScratch();
    }
  }


  function revealScratch(){

    if(revealed) return;

    revealed = true;

    const status =
      document.getElementById('scratchStatus');

    const hint =
      document.getElementById('scratchHint');

    const countdown =
      document.getElementById('countdown');

    if(status){
      status.textContent =
        'Alhamdulillah ♥ The countdown is revealed.';
    }

    if(hint){
      hint.style.opacity = '0';
    }

    canvas.style.transition =
      'opacity .7s ease';

    canvas.style.opacity = '0';

    if(countdown){
      countdown.classList.remove('locked');
    }

    makePetals();

    setTimeout(() => {

      canvas.style.display = 'none';

      if(hint){
        hint.style.display = 'none';
      }

      if(countdown){
        countdown.scrollIntoView({
          behavior:'smooth',
          block:'start'
        });
      }

    },750);
  }


  /* MOUSE + TOUCH + PEN */

  canvas.addEventListener(
    'pointerdown',
    function(event){

      isScratching = true;

      try{
        canvas.setPointerCapture(
          event.pointerId
        );
      }catch(error){}

      scratch(event);
    }
  );


  canvas.addEventListener(
    'pointermove',
    scratch
  );


  canvas.addEventListener(
    'pointerup',
    function(event){

      isScratching = false;

      try{
        canvas.releasePointerCapture(
          event.pointerId
        );
      }catch(error){}
    }
  );


  canvas.addEventListener(
    'pointercancel',
    function(){
      isScratching = false;
    }
  );


  canvas.addEventListener(
    'pointerleave',
    function(){
      isScratching = false;
    }
  );


  /* IMPORTANT FOR LAPTOP + TOUCH */

  canvas.style.pointerEvents = 'auto';
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'crosshair';

  resizeCanvas();

  window.addEventListener(
    'resize',
    function(){

      if(!revealed){
        resizeCanvas();
      }

    }
  );
}


/* =========================
   MUSIC
========================= */

const music =
  document.getElementById('music');

const musicBtn =
  document.getElementById('musicBtn');

if(music && musicBtn){

  musicBtn.addEventListener(
    'click',
    async function(){

      try{

        if(music.paused){

          await music.play();

          musicBtn.textContent = '❚❚';

        }else{

          music.pause();

          musicBtn.textContent = '♫';

        }

      }catch(error){

        musicBtn.textContent = '♫';

        alert(
          'Music ke liye website folder mein music.mp3 add karein.'
        );
      }
    }
  );
}
