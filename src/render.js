(() => {
  const canvas = document.getElementById("game"), ctx = canvas.getContext("2d");
  const assetNames = { background: "vagon.jpg", night: "vagon-noche.png", driver: "conductora.png", driverTalk: "conductora-habla.png", carlos: "carlos-pinto.jpg", copano: "copano.jpg", copanoTalk: "copano-boca.jpg", mon: "mon-laferte.jpg", freire: "freire.jpg", leo: "leo-rey.jpg", cinematicRepublica: "cinematics/republica.svg", cinematicUla: "cinematics/ula.svg" };
  const images = {}, sprites = {};
  for (const [key, file] of Object.entries(assetNames)) { const im = new Image(); im.src = `assets/${file}`; images[key] = im; }
  // Las hojas recibidas traen fondo blanco: esta pasada lo vuelve transparente para respetar el pixel art.
  function buildSprite(key, source, rect) {
    if (!images[source].complete || !images[source].naturalWidth) return;
    const [sx, sy, sw, sh] = rect, c = document.createElement("canvas"), x = c.getContext("2d", { willReadFrequently: true });
    c.width = sw; c.height = sh; x.drawImage(images[source], sx, sy, sw, sh, 0, 0, sw, sh);
    const d = x.getImageData(0, 0, sw, sh), p = d.data;
    for (let i = 0; i < p.length; i += 4) if (p[i] > 232 && p[i + 1] > 232 && p[i + 2] > 232) p[i + 3] = 0;
    x.putImageData(d, 0, 0); sprites[key] = c;
  }
  const sheets = ["carlos", "copano", "mon", "freire", "leo"];
  let made = false;
  function makeSprites() {
    if (made || sheets.some(k => !images[k].complete || !images[k].naturalWidth)) return;
    made = true;
    buildSprite("thief", "carlos", [1060, 55, 600, 1430]);
    buildSprite("copano", "copano", [25, 55, 700, 1420]);
    buildSprite("copanoTalk", "copanoTalk", [12, 65, 760, 1650]);
    buildSprite("mon", "mon", [8, 60, 590, 1415]);
    buildSprite("freire", "freire", [18, 62, 585, 1410]);
    buildSprite("freireSit", "freire", [2070, 270, 650, 1220]);
    buildSprite("leo", "leo", [15, 55, 620, 1430]);
  }
  images.driver.onload = images.driverTalk.onload = () => {};
  for (const im of Object.values(images)) im.onload = makeSprites;
  const C = window.MetroConfig, G = window.MetroGame, s = G.state;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function drawBg(night = false) {
    const im = night ? images.night : images.background;
    if (im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0, 1280, 720);
    else { ctx.fillStyle = "#28334d"; ctx.fillRect(0,0,1280,720); }
    if (night) { ctx.fillStyle = "#10142f99"; ctx.fillRect(0,0,1280,720); }
  }
  function drawTravel() {
    const scroll=s.elapsed*155;
    ctx.save(); const panes=[[5,116,104,248],[422,112,440,248],[1170,116,105,248]];
    ctx.beginPath();panes.forEach(([x,y,w,h])=>ctx.rect(x,y,w,h));ctx.clip();
    panes.forEach(([x,y,w,h],idx)=>{
      ctx.fillStyle=idx===1?"#89c7ef":"#86c6ed";ctx.fillRect(x,y,w,h);
      ctx.fillStyle="#d9f1ff";for(let c=0;c<3;c++){const cx=x+((c*191-scroll*.26)%(w+90));const cy=y+18+(c%2)*24;ctx.fillRect(cx,cy,38,3);ctx.fillRect(cx+9,cy-4,20,4);}
      ctx.fillStyle="#7098c7";ctx.beginPath();ctx.moveTo(x,y+h*.68);for(let q=0;q<5;q++){ctx.lineTo(x+q*w/4,y+h*(.4+(q%2)*.11));}ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();
      ctx.fillStyle="#5182b5";const unit=72,offset=scroll%unit;for(let bx=x-offset-unit;bx<x+w+unit;bx+=unit){const bh=22+((Math.floor((bx+offset)/unit)*37)%50);ctx.fillRect(bx,y+h-bh,42,bh);ctx.fillStyle="#b7dcf3";for(let wy=y+h-bh+5;wy<y+h-4;wy+=12)ctx.fillRect(bx+7,wy,5,5);ctx.fillStyle="#5182b5";}
      ctx.fillStyle="#e0edfa66";for(let k=0;k<3;k++){const lx=x+((k*147-scroll*1.2)%(w+45));ctx.fillRect(lx,y+h-8,24,2);}
    });ctx.restore();
  }
  function drawStationPlatform() {
    const grad=ctx.createLinearGradient(0,0,0,720);grad.addColorStop(0,"#101a39");grad.addColorStop(.68,"#26385d");grad.addColorStop(1,"#66718a");ctx.fillStyle=grad;ctx.fillRect(0,0,1280,720);
    ctx.fillStyle="#d5e6ff";for(let i=0;i<54;i++){const x=(i*197)%1270,y=(i*83)%255;ctx.fillRect(x,y,2+(i%3),2);}
    for(let i=0;i<12;i++){const x=i*115-25,h=135+(i*71)%175;ctx.fillStyle=i%2?"#182744":"#1c2e4f";ctx.fillRect(x,380-h,98,h);ctx.fillStyle="#90a9c322";for(let r=0;r<5;r++)for(let c=0;c<3;c++)ctx.fillRect(x+13+c*26,394-h+r*30,8,10);}
    ctx.fillStyle="#d0d4e0";ctx.fillRect(0,434,1280,22);ctx.fillStyle="#6d7890";ctx.fillRect(0,456,1280,183);ctx.fillStyle="#f2c64c";ctx.fillRect(0,455,1280,11);
    ctx.fillStyle="#3e495f";ctx.fillRect(0,639,1280,81);ctx.fillStyle="#222c43";ctx.fillRect(0,660,1280,60);
    for(let i=0;i<20;i++){ctx.fillStyle=i%2?"#818ba0":"#737f95";ctx.fillRect(i*68,668,36,3);}
    ctx.fillStyle="#131d35";ctx.fillRect(50,58,410,94);ctx.strokeStyle="#b6c4df";ctx.lineWidth=4;ctx.strokeRect(50,58,410,94);label("METRO · SANTIAGO",78,87,17,"#ff5a69",900);label(C.stations[s.cinematic?.to]||"",78,121,29,"#fff",850);
    ctx.fillStyle="#ffd774";ctx.fillRect(540,36,4,29);ctx.fillStyle="#e9f4ff";ctx.beginPath();ctx.ellipse(542,34,36,10,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.16;ctx.fillStyle="#fff7c0";ctx.fillRect(505,42,74,260);ctx.globalAlpha=1;
  }
  function drawSprite(key, x, y, w, h, flip = false) {
    const im = sprites[key]; if (!im) return;
    ctx.save(); if (flip) { ctx.translate(x + w, y); ctx.scale(-1,1); ctx.drawImage(im,0,0,w,h); }
    else ctx.drawImage(im,x,y,w,h); ctx.restore();
  }
  function panel(x,y,w,h,fill="#101629eF", stroke="#c7cde1", radius=10) {
    ctx.beginPath(); ctx.roundRect(x,y,w,h,radius); ctx.fillStyle=fill; ctx.fill(); ctx.lineWidth=3; ctx.strokeStyle=stroke; ctx.stroke();
  }
  function label(text,x,y,size=22,color="#fff",weight=700,align="left") {
    ctx.textAlign=align; ctx.textBaseline="middle"; ctx.font=`${weight} ${size}px Trebuchet MS, Arial`; ctx.fillStyle=color; ctx.shadowColor="#060914"; ctx.shadowBlur=4; ctx.fillText(text,x,y); ctx.shadowBlur=0;
  }
  function pixelAvatar() {
    const x=520+Math.sin(s.elapsed*8)*2,y=380+Math.sin(s.elapsed*15)*1.5;
    // Silueta sentada: mochila, polerón, piernas, manos y cabello en bloques de pixel art.
    ctx.save();
    ctx.fillStyle="#17334f"; ctx.fillRect(x+50,y+55,145,150); ctx.fillStyle="#284e70"; ctx.fillRect(x+62,y+67,120,112); ctx.fillStyle="#e1aa55"; ctx.fillRect(x+75,y+82,18,18); ctx.fillRect(x+152,y+82,18,18);
    ctx.fillStyle="#273449"; ctx.fillRect(x+20,y+145,105,74); ctx.fillRect(x+145,y+145,105,74); ctx.fillStyle="#202938"; ctx.fillRect(x+3,y+196,132,35); ctx.fillRect(x+135,y+196,135,35);
    ctx.fillStyle="#bc7958"; ctx.fillRect(x+32,y+123,53,35); ctx.fillRect(x+172,y+123,53,35);
    ctx.fillStyle="#273a58"; ctx.fillRect(x+45,y+60,35,110); ctx.fillRect(x+170,y+60,35,110); ctx.fillStyle="#e2ad7d"; ctx.fillRect(x+78,y+12,94,112); ctx.fillStyle="#292535"; ctx.fillRect(x+69,y+8,111,32); ctx.fillRect(x+62,y+29,28,36); ctx.fillRect(x+161,y+29,30,26);
    ctx.fillStyle="#2a2224"; ctx.fillRect(x+99,y+55,13,8); ctx.fillRect(x+142,y+55,13,8); ctx.fillStyle="#fff1d8"; ctx.fillRect(x+103,y+58,7,5); ctx.fillRect(x+146,y+58,7,5); ctx.fillStyle="#70443b"; ctx.fillRect(x+113,y+91,25,6);
    ctx.fillStyle="#be754d"; ctx.fillRect(x+69,y+166,36,29); ctx.fillRect(x+158,y+166,36,29);
    ctx.fillStyle="#f1c852"; ctx.fillRect(x+72,y+140,10,68); ctx.fillRect(x+181,y+140,10,68);
    ctx.restore();
  }
  function drawHud() {
    panel(22,18,272,72,"#101629dc","#b8c2dc",8); label(`ESTACIÓN  ${C.stations[s.station] || C.stations[3]}`,42,43,19,"#fff",800); label("23:00  ·  ÚLTIMO TREN",42,70,15,"#d9e0f4",600);
    panel(1000,18,258,72,"#101629dc","#b8c2dc",8); label(`PUNTAJE  ${s.score}`,1020,42,19,"#fff",800); label(`RACHA  ×${s.streak}`,1020,69,16,"#ffd36f",750);
    panel(382,18,516,60,"#101629cc","#b8c2dc",8); label("LOS HÉROES",397,48,12,"#e7eafd",700); label("REPÚBLICA",548,48,12,"#e7eafd",700); label("ULA",699,48,12,"#e7eafd",700); label("EST. CENTRAL",772,48,12,"#e7eafd",700);
    ctx.strokeStyle="#cdd4ea"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(415,68); ctx.lineTo(862,68); ctx.stroke();
    const px=415+(s.station+(1-s.segment/C.segmentSeconds))*145; ctx.fillStyle="#ff485d"; ctx.beginPath(); ctx.arc(clamp(px,415,862),68,9,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(clamp(px,415,862),68,3,0,Math.PI*2); ctx.fill();
    const cards=s.buffs.filter(b=>b.time>0); cards.forEach((b,i)=>{let y=105+i*72;panel(24,y,275,62,"#151d35eF",b.id==="sweep"?"#ff566b":"#b8c2dc",8);label(b.name,41,y+19,15,b.id==="sweep"?"#ff8794":"#ffe18e",800);label(b.effect,41,y+40,12,"#edf0fb",600);ctx.fillStyle="#59617b";ctx.fillRect(42,y+54,235,4);ctx.fillStyle="#ffc957";ctx.fillRect(42,y+54,235*clamp(b.time/b.max,0,1),4);});
  }
  function drawEnemy(e) { const towardLeft=e.side>0,bob=Math.round(Math.sin(s.elapsed*13+e.phase)*4); drawSprite("thief",e.x-63,e.y-208+bob,126,208,towardLeft); }
  function drawVisitors() {
    const active=id=>s.buffs.some(b=>b.id===id);
    if(active("copano")){drawSprite("copano",215,320,126,220);panel(285,285,98,38,"#fff8df","#292538",5);label("@#%!",334,304,17,"#26243a",900,"center");}
    if(active("mon")){drawSprite("mon",225,280,152,270);label("♪",320,270,28,"#f9b9d0",900,"center");}
    if(active("leo")){drawSprite("leo",925,305,126,235);label("+ alcance",994,287,13,"#ffe18e",800,"center");}
    if(active("carlos")){ctx.fillStyle="#c4c6d122";for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(946+(i%3)*20,390-Math.floor(i/3)*30,26,0,Math.PI*2);ctx.fill();}drawSprite("carlos",930,305,132,235);}
  }
  function drawFist() { if(s.punch<=0)return; const x=640+s.punchSide*118,y=465; ctx.save(); ctx.globalAlpha=clamp(s.punch/.22,0,1); ctx.fillStyle="#e3a25f"; ctx.fillRect(x-s.punchSide*14,y-2,46,24); ctx.fillStyle="#f2b475"; ctx.fillRect(x,y-18,39,39); ctx.fillStyle="#b8664c"; ctx.fillRect(x+6,y-8,27,6); ctx.restore(); }
  function drawSpecialSweep() {
    const fx=s.effects.find(e=>e.type==="sweep"); if(!fx)return;
    const x=-125+(5-fx.t)*310, y=465;
    // Figuras provisionales de pixel art: Tormenta China y el conejo rojo Bodoque.
    ctx.fillStyle="#25253a";ctx.fillRect(x+8,y+38,31,79);ctx.fillRect(x-2,y+105,34,13);ctx.fillRect(x+35,y+105,30,13);
    ctx.fillStyle="#e7b947";ctx.fillRect(x+2,y+24,47,63);ctx.fillRect(x+8,y+11,34,22);ctx.fillStyle="#e7b17c";ctx.fillRect(x+11,y-9,27,27);ctx.fillStyle="#292237";ctx.fillRect(x+8,y-13,32,10);
    ctx.fillStyle="#ae2940";ctx.fillRect(x+76,y+21,39,75);ctx.fillRect(x+80,y-13,12,40);ctx.fillRect(x+101,y-20,12,34);ctx.fillStyle="#dd4c5b";ctx.fillRect(x+72,y+10,50,45);ctx.fillStyle="#f0bd87";ctx.fillRect(x+82,y+22,8,8);ctx.fillRect(x+105,y+22,8,8);ctx.fillStyle="#222235";ctx.fillRect(x+84,y+25,4,5);ctx.fillRect(x+107,y+25,4,5);ctx.fillRect(x+78,y+94,25,15);ctx.fillRect(x+104,y+94,25,15);
    label("¡BARRIDO!",x+70,y-55,17,"#ffe38c",900,"center");
  }
  function drawGame() {
    drawBg();drawTravel();
    drawVisitors(); pixelAvatar();
    if(s.complete) { const x=s.complete.x,y=520,nx=x<640?x+70:x-155;ctx.fillStyle="#28263b";ctx.fillRect(nx+16,398,43,83);ctx.fillStyle="#a7454f";ctx.fillRect(nx+9,420,57,57);ctx.fillStyle="#e7b082";ctx.fillRect(nx+18,369,39,42);ctx.fillStyle="#342538";ctx.fillRect(nx+13,365,49,16);ctx.fillRect(nx+12,378,10,20);ctx.fillStyle="#e7b082";ctx.fillRect(nx+54,444,32,10);ctx.fillStyle="#212738";ctx.fillRect(nx+10,475,19,40);ctx.fillRect(nx+42,475,19,40);label("¡UPS!",nx+36,350,13,"#fff",800,"center");ctx.fillStyle="#f4d985";ctx.beginPath();ctx.ellipse(x,y,34,16,0,0,7);ctx.fill();ctx.fillStyle="#ef8054";ctx.fillRect(x-22,y-7,44,11);ctx.fillStyle="#43864b";ctx.fillRect(x-8,y-9,15,6);label("ESPACIO",x,y-38,13,"#fff",800,"center"); }
    s.enemies.forEach(drawEnemy); drawFist(); drawSpecialSweep(); drawHud();
    s.effects.forEach(e=>{label(e.label,e.x,e.y,25,e.type==="miss"?"#ff7f83":e.type==="event"?"#ffe18e":"#fff",900,"center");});
    if(s.hintTime>0){panel(350,620,580,56,"#101629df","#e5d594",8);label(s.hint,640,649,17,"#fff",800,"center");}
    if(s.flash>0){ctx.fillStyle=`rgba(255,245,195,${s.flash*.34})`;ctx.fillRect(0,0,1280,720);}
  }
  function drawMenu() {
    drawBg(true); drawSprite("freireSit",490,245,300,385);
    panel(145,95,990,445,"#0e1424eD","#dce4f5",14);
    label("METRO DE",640,168,26,"#f2d56b",800,"center"); label("VUELTA",640,228,67,"#fff",900,"center");
    label("EL ÚLTIMO TREN A CASA",640,295,20,"#e7eaf3",700,"center");
    label("Defiende tu mochila entre Los Héroes y Estación Central.",640,348,20,"#e5e7ed",600,"center");
    label("A / ← golpe izquierdo     D / → golpe derecho     ESPACIO: interactuar",640,393,16,"#f2d56b",700,"center");
    panel(468,440,344,64,"#bd263a","#fff0e0",9); label("ENTER / ESPACIO · JUGAR",640,472,19,"#fff",900,"center");
    label("P o ESC para pausar durante el viaje",640,566,15,"#d0d8eb",600,"center");
  }
  function drawIntro() {
    drawBg(s.intro===0); const c=window.MetroGame.introCards?.[s.intro];
    const titles=["23:00 · ÚLTIMO VIAJE","RUMBO A CASA","EL VAGÓN","ALGO SE MUEVE","¿LISTO?"];
    const lines=[["Sales tarde de clases.","El último tren ya te espera."],["Tu destino: Estación Central.","Mochila puesta. Ojos abiertos."],["La noche es larga y el vagón va casi vacío.","No pierdas de vista tus cosas."],["En cada estación puede aparecer un ladrón.","Defiéndete a tiempo."],["A / ← golpe izquierdo     D / → golpe derecho","ESPACIO: zafarte · recoger · responder"]][s.intro];
    if(s.intro===0)drawSprite("leo",865,180,235,420); if(s.intro===1)drawSprite("freireSit",510,275,270,360); if(s.intro===2)drawSprite("mon",190,185,220,430); if(s.intro===3){drawSprite("thief",820,170,230,480,true);pixelAvatar();}
    panel(135,90,1010,460,"#101629eB","#d5def3",13); label(titles[s.intro],640,188,36,"#ffe082",900,"center");
    lines.forEach((line,i)=>label(line,640,274+i*48,22,"#fff",700,"center"));
    panel(462,422,356,62,"#bd263a","#fff0e0",8);label(s.intro<4?"ENTER / ESPACIO · CONTINUAR":"ENTER / ESPACIO · SUBIR AL TREN",640,453,16,"#fff",850,"center");
    label(`${s.intro+1} / 5`,640,520,15,"#cbd4e9",650,"center");
  }
  function drawCinematic() {
    const data=s.cinematic;
    if(data?.event==="driver") {
      const im=images.driverTalk;
      if(im.complete&&im.naturalWidth) {const scale=Math.max(1280/im.width,720/im.height);ctx.drawImage(im,(1280-im.width*scale)/2,(720-im.height*scale)/2,im.width*scale,im.height*scale);}
      ctx.fillStyle="#09112635";ctx.fillRect(0,0,1280,720);
      ctx.fillStyle="#c8cad5";ctx.globalAlpha=.96;ctx.fillRect(-520+data.door*520,0,520,475);ctx.fillRect(1280-data.door*520,0,520,475);ctx.globalAlpha=1;
      panel(80,525,1120,145,"#101629f2","#f4f1e7",10);label("CONDUCTORA",112,555,16,"#ff6674",900);label("Queda una pura estación.",112,602,34,"#fff",850);label("ULA  →  ESTACIÓN CENTRAL",1160,638,14,"#d8dfef",700,"right");
    } else {
      const still=data?.from===0?images.cinematicRepublica:images.cinematicUla;
      if(still?.complete&&still.naturalWidth)ctx.drawImage(still,0,0,1280,720);else drawStationPlatform();
      label("PRÓXIMA ESTACIÓN",640,145,23,"#f1d372",800,"center");label(C.stations[data?.to]||"",640,207,54,"#fff",900,"center");
      if(data?.event==="freire"){drawSprite("freire",290,220,220,430);drawSprite("copano",785,230,205,420);label("¡Vamos, Copano!",640,320,22,"#fff",800,"center");}
      else if(data?.from===1){drawSprite("leo",180,230,205,420);drawSprite("mon",880,230,205,420);}
      else {drawSprite("freireSit",510,260,245,360);}
      label(window.MetroCinematics.textForCinematic(),640,552,25,"#fff",800,"center");
      const slide=clamp(data?.door||0,0,1);ctx.fillStyle="#d8d9e3";ctx.globalAlpha=.94;
      ctx.fillRect(-520+slide*520,0,520,720);ctx.fillRect(1280-slide*520,0,520,720);ctx.globalAlpha=1;
      ctx.strokeStyle="#202944";ctx.lineWidth=12;ctx.strokeRect(1,1,1278,718);
    }
    label("PUERTAS CERRÁNDOSE",640,40,13,"#dce5f7",750,"center");
  }
  function drawStruggle() {
    drawBg();pixelAvatar();s.enemies.forEach(drawEnemy);ctx.fillStyle="#090c18aa";ctx.fillRect(0,0,1280,720);
    panel(270,170,740,380,"#11182ced","#ff6a73",14);
    label("¡TE ATRAPARON!",640,225,36,"#ff8790",900,"center");
    if(s.struggle?.type==="one") {
      label("¡Pulsa ESPACIO varias veces para zafarte!",640,292,21,"#fff",750,"center");
      panel(390,359,500,35,"#27334f","#bbc4da",8);ctx.fillStyle="#ffc95b";ctx.fillRect(397,366,486*(s.struggle?.meter||0),21);
    } else {
      label("¡Pulsa ESPACIO cuando el marcador esté en la marca!",640,292,19,"#fff",750,"center");
      panel(390,359,500,35,"#27334f","#bbc4da",8);ctx.fillStyle="#57b883";ctx.fillRect(390+500*(s.struggle?.bar||.66)-24,359,48,35);ctx.fillStyle="#ffd064";ctx.fillRect(390+500*(s.struggle?.cursor||0)-5,354,10,45);
      label(`ACIERTO ${s.struggle?.hits||0} / 3`,640,436,19,"#ffe08a",800,"center");
    }
    label(`${Math.max(0,s.struggle?.timer||0).toFixed(1)} s`,640,491,18,"#e3e8f4",750,"center");
  }
  function drawPause() { drawGame();ctx.fillStyle="#080c18bb";ctx.fillRect(0,0,1280,720);panel(410,205,460,310,"#11182bf5","#e1e7f1",12);label("PAUSA",640,263,41,"#ffe083",900,"center");label("P / ESC · continuar",640,345,19,"#fff",700,"center");label("R · reiniciar viaje",640,394,19,"#fff",700,"center");label("El tren sigue esperando.",640,465,17,"#c8d0e3",600,"center");}
  function drawEnd(win) { drawBg(true);if(win)drawSprite("freireSit",505,255,270,375);else {drawSprite("thief",725,255,210,420);drawSprite("thief",390,270,180,390,true);}
    panel(190,105,900,465,"#0d1427ee",win?"#e1cb75":"#e97779",14);label(win?"LLEGASTE A CASA":"TE QUEDASTE SIN MOCHILA",640,190,38,win?"#f5db7e":"#ff8587",900,"center");
    label(win?"Estación Central. Tus cosas siguen contigo.":"Los ladrones escaparon con todas tus pertenencias.",640,260,21,"#fff",700,"center");label(`PUNTAJE FINAL  ${s.score}`,640,328,24,"#fff",800,"center");
    panel(450,408,380,60,"#b7273e","#fff0e0",8);label("ENTER / ESPACIO · VOLVER A JUGAR",640,438,17,"#fff",900,"center");
  }
  function render() {
    makeSprites();ctx.clearRect(0,0,1280,720);
    switch(s.screen){case"menu":drawMenu();break;case"intro":drawIntro();break;case"game":drawGame();break;case"cinematic":drawCinematic();break;case"struggle":drawStruggle();break;case"pause":drawPause();break;case"defeat":drawEnd(false);break;case"victory":drawEnd(true);break;}
  }
  window.MetroRender = { render, images, sprites };
})();
