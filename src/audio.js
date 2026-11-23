(() => {
  const files = {
    chill: "musicachill.mp3", fight: "musicapelea.m4a", gameover: "gameover.m4a",
    copano: "8bit-teatro-en-chilevision-tema-clip5seg.wav",
    mon: "8bit-mon-laferte-tu-falta-de-querer-clip4seg.wav",
    leo: "8bit-la-noche-que-nadie-se-entere-video-lyric-karaoke_QcDxZPb1.wav",
    station0: "station-0.wav", station1: "station-1.wav",
    station2: "station-2.wav", station3: "station-3.wav"
  };
  const levels = { chill: 0.25, fight: 0.32 };
  const embedded = window.MetroAssetData || {};
  const createAudio = key => {
    const audio = new Audio(embedded[`audio-${key}`] || `assets/audio/${files[key]}`);
    audio.preload = "auto";
    return audio;
  };
  const music = { chill: createAudio("chill"), fight: createAudio("fight") };
  Object.values(music).forEach(track => { track.loop = true; track.volume = 0; });

  let mode = null, paused = false, ended = false, fadeTimer = 0, fadeToken = 0;
  let cueQueue = [], activeCue = null, gameoverCue = null, heardStations = new Set(), lastThreatAt = 0;

  function rampMusic() {
    clearInterval(fadeTimer);
    const token = ++fadeToken;
    const start = { chill: music.chill.volume, fight: music.fight.volume };
    const duck = activeCue ? 0.27 : 1;
    const target = {
      chill: !paused && mode === "chill" && !ended ? levels.chill * duck : 0,
      fight: !paused && mode === "fight" && !ended ? levels.fight * duck : 0
    };
    const began = performance.now(), duration = 380;
    const step = () => {
      if (token !== fadeToken) return;
      const p = Math.min(1, (performance.now() - began) / duration);
      for (const name of ["chill", "fight"]) music[name].volume = start[name] + (target[name] - start[name]) * p;
      if (p >= 1) {
        clearInterval(fadeTimer);
        for (const name of ["chill", "fight"]) if (target[name] === 0) music[name].pause();
      }
    };
    step();
    fadeTimer = setInterval(step, 24);
  }

  function setMode(next) {
    if (mode === next) {
      if (mode && !paused && !ended && music[mode].paused) music[mode].play().catch(() => {});
      return;
    }
    mode = next;
    if (mode && !paused && !ended) music[mode].play().catch(() => {});
    rampMusic();
  }

  function nextCue() {
    if (paused || activeCue || !cueQueue.length || ended) return;
    const item = cueQueue.shift();
    const audio = createAudio(item.key);
    activeCue = audio;
    audio.volume = item.volume;
    audio.onended = () => finishCue(audio);
    audio.onerror = () => finishCue(audio);
    rampMusic();
    const result = audio.play();
    if (result && result.catch) result.catch(() => finishCue(audio));
  }

  function finishCue(audio) {
    if (activeCue !== audio) return;
    audio.onended = null;
    audio.onerror = null;
    activeCue = null;
    rampMusic();
    nextCue();
  }

  function queueCue(key, volume = 0.62) {
    if (ended) return;
    cueQueue.push({ key, volume });
    nextCue();
  }

  function pauseAudio(value) {
    if (paused === value) return;
    paused = value;
    if (paused) {
      Object.values(music).forEach(track => track.pause());
      if (activeCue) activeCue.pause();
    } else {
      if (mode && !ended) music[mode].play().catch(() => {});
      if (activeCue) activeCue.play().catch(() => {});
      else nextCue();
      rampMusic();
    }
  }

  function startRun() {
    ended = false;
    cueQueue = [];
    if (activeCue) { activeCue.onended = null; activeCue.onerror = null; activeCue.pause(); activeCue = null; }
    if (gameoverCue) { gameoverCue.pause(); gameoverCue.currentTime = 0; gameoverCue = null; }
    heardStations = new Set();
    lastThreatAt = 0;
    pauseAudio(false);
    setMode("chill");
    playStation(0);
  }

  function playStation(index) {
    if (!Number.isInteger(index) || index < 0 || index > 3 || heardStations.has(index)) return;
    heardStations.add(index);
    queueCue(`station${index}`, 0.42);
  }

  function playCharacter(id) {
    if (id === "copano" || id === "mon" || id === "leo") queueCue(id, 0.62);
  }

  function gameOver() {
    if (ended) return;
    ended = true;
    clearInterval(fadeTimer);
    ++fadeToken;
    for (const track of Object.values(music)) { track.pause(); track.volume = 0; }
    cueQueue = [];
    if (activeCue) { activeCue.onended = null; activeCue.onerror = null; activeCue.pause(); activeCue = null; }
    gameoverCue = createAudio("gameover");
    gameoverCue.volume = 0.72;
    gameoverCue.play().catch(() => {});
  }

  function sync(state) {
    if (state.screen === "pause") { pauseAudio(true); return; }
    pauseAudio(false);
    if (ended) return;
    if (state.screen === "intro" || state.screen === "cinematic") {
      setMode("chill");
    } else if (state.screen === "game" || state.screen === "struggle") {
      const underAttack = state.screen === "struggle" || state.enemies.length > 0;
      if (underAttack) lastThreatAt = performance.now();
      setMode(underAttack || performance.now() - lastThreatAt < 1800 ? "fight" : "chill");
    } else {
      setMode(null);
    }
  }

  window.MetroAudio = { startRun, playStation, playCharacter, gameOver, sync };
})();
