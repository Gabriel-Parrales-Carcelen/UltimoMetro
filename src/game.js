(() => {
  const C = window.MetroConfig;
  const state = {
    screen: "menu", intro: 0, station: 0, segment: C.segmentSeconds, score: 0, streak: 0,
    enemies: [], effects: [], buffs: [], flash: 0, shake: 0, punch: 0, punchSide: 1,
    nextAttack: 4.2, attackCount: 0, nextEvent: 12, eventName: "", pauseFrom: "game",
    struggle: null, cinematic: null, threshold: 1, complete: null, completeWindow: 0, completeSpawned: false,
    hint: "", hintTime: 0, elapsed: 0, doors: 0, introCard: 0, lastAttack: 0, hasComplete: false
  };
  const introCards = [
    { title: "23:00 · ÚLTIMO VIAJE", lines: ["Sales tarde de clases.", "El último tren ya te espera."] },
    { title: "RUMBO A CASA", lines: ["Tu destino: Estación Central.", "Mochila puesta. Ojos abiertos."] },
    { title: "EL VAGÓN", lines: ["La noche es larga y el vagón va casi vacío.", "No pierdas de vista tus cosas."] },
    { title: "ALGO SE MUEVE", lines: ["En cada estación puede aparecer un ladrón.", "Defiéndete a tiempo."] },
    { title: "¿LISTO?", lines: ["A / ← golpe izquierdo    D / → golpe derecho", "ESPACIO: zafarte · recoger · responder"] }
  ];
  function start() {
    Object.assign(state, { screen: "intro", intro: 0, station: 0, segment: C.segmentSeconds, score: 0, streak: 0,
      enemies: [], effects: [], buffs: [], nextAttack: 4.5, attackCount: 0, nextEvent: 11, threshold: 1, complete: null, completeSpawned: false, hasComplete: false, eventName: "", elapsed: 0 });
    window.MetroAudio?.startRun();
  }
  function beginGame() { state.screen = "game"; state.nextAttack = 1.8; state.hint = "¡Ojo, viene alguien!"; state.hintTime = 2.8; }
  function nextStation() {
    state.station++;
    if (state.station >= C.stations.length) { state.screen = "victory"; return; }
    window.MetroAudio?.playStation(state.station);
    state.segment = C.segmentSeconds; state.enemies = []; state.complete = null; state.buffs = [];
    state.cinematic = { timer: C.cinematicSeconds, from: state.station - 1, to: state.station, door: 0 };
    state.screen = "cinematic";
    if (state.cinematic.from === 0) state.cinematic.event = "freire";
    else if (state.cinematic.from === 2) state.cinematic.event = "driver";
  }
  function addEnemy(side, special = false, pair = null) {
    const double = pair !== null;
    state.enemies.push({ id: Math.random(), side, x: side < 0 ? -90 : C.width + 90, y: 535 + Math.random() * 10,
      speed: (235 + state.station * 34) * (state.buffs.some(b => b.id === "carlos") ? 1.32 : 1), grabbed: false,
      special, double, pair, hp: 1, born: state.elapsed, phase: Math.random() * 6 });
    state.attackCount++;
  }
  function punch(side) {
    if (state.screen !== "game" && state.screen !== "struggle") return;
    if (state.screen === "struggle") { window.MetroGame.struggleTap(); return; }
    state.punch = .22; state.punchSide = side;

    // El completo permite despejar una pareja doble con un golpe a distancia.
    if (state.hasComplete) {
      const paired = state.enemies
        .filter(e => e.double && e.side === side)
        .sort((a,b) => Math.abs(a.x - 640) - Math.abs(b.x - 640))[0];
      if (paired) {
        state.enemies = state.enemies.filter(e => e.pair !== paired.pair);
        state.score += 250; state.streak++;
        state.hasComplete = false; state.complete = null;
        state.effects.push({ type: "hit", x: 640, y: 350, t: .9, label: "¡DOBLE CONTRAATACADO! +250" });
        state.hint = "¡El completo despejó a los dos ladrones!";
        state.hintTime = 2;
        return;
      }
    }

    const reach = state.buffs.some(b => b.id === "leo") ? 300 : 215;
    const targets = state.enemies.filter(e => !e.grabbed && e.side === side && Math.abs(e.x - 640) < reach + 65);
    if (targets.length) {
      const target = targets.sort((a,b) => Math.abs(a.x-640)-Math.abs(b.x-640))[0];
      target.hp--;
      if (target.hp <= 0) {
        state.enemies = state.enemies.filter(e => e !== target);
        state.score += state.buffs.some(b => b.id === "copano") ? 180 : 100;
        state.streak++; state.flash = .18;
        state.effects.push({ type: "hit", x: target.x, y: target.y - 100, t: .65, label: "¡FUERA! +100" });
      }
    } else {
      state.streak = 0;
      state.effects.push({ type: "miss", x: 640 + side * 120, y: 440, t: .35, label: "¡FALLASTE!" });
    }
  }  function struggleTap() {
    const s = state.struggle; if (!s) return;
    if (s.type === "one") { s.press++; s.meter = Math.min(1, s.meter + .17); }
    else {
      const target = s.bar;
      if (s.cursor > target - .07 && s.cursor < target + .07) { s.hits++; s.meter = Math.min(1, s.meter + .34); s.cursor = 0; }
      else { s.meter -= .17; state.hint = "¡En la marca!"; state.hintTime = .6; }
    }
    if (s.meter >= 1) { state.screen = "game"; state.struggle = null; state.enemies = []; state.flash = .5; state.hint = "¡Te zafaste!"; state.hintTime = 1.2; }
  }
  function fail() { state.screen = "defeat"; state.enemies = []; state.buffs = []; window.MetroAudio?.gameOver(); }
  function tick(dt) {
    const s = state; s.elapsed += dt;
    s.flash = Math.max(0, s.flash - dt); s.shake = Math.max(0, s.shake - dt); s.punch = Math.max(0, s.punch - dt); s.hintTime = Math.max(0, s.hintTime - dt);
    s.effects.forEach(e => e.t -= dt); s.effects = s.effects.filter(e => e.t > 0);
    if (s.screen === "intro") return;
    if (s.screen === "cinematic") {
      s.cinematic.timer -= dt;
      const passed = C.cinematicSeconds - s.cinematic.timer;
      s.cinematic.door = passed < .5 ? 0 : passed < 1.5 ? passed - .5 : passed < 5.5 ? 1 : passed < 6.4 ? 1 - (passed - 5.5) / .9 : 0;
      if (s.cinematic.timer <= 0) { s.screen = "game"; s.nextAttack = 2.0; s.hint = "Próxima estación: " + C.stations[s.station]; s.hintTime = 2.1; }
      return;
    }
    if (s.screen === "struggle") {
      const x = s.struggle; x.timer -= dt;
      if (x.type === "one") x.meter = Math.max(0, x.meter - dt * .12);
      else x.cursor = (x.cursor + dt * 1.35) % 1;
      if (x.timer <= 0 || (x.type === "one" && x.meter <= 0)) fail(); return;
    }
    if (s.screen !== "game") return;
    s.segment -= dt;
    s.buffs.forEach(b => b.time -= dt); s.buffs = s.buffs.filter(b => b.time > 0);
    if (s.complete) { s.completeWindow -= dt; if (s.completeWindow <= 0) s.complete = null; }
    s.nextAttack -= dt;
    if (s.nextAttack <= 0 && !s.buffs.some(b => b.id === "sweep")) {
      const slowdown = s.buffs.some(b => b.id === "mon") ? .56 : 1;
      const carlos = s.buffs.some(b => b.id === "carlos");
      let chance = .11 + s.station * .12 + (carlos ? .38 : 0);
      const isDouble = Math.random() < chance;
      if (isDouble) { const pair=Math.random(); addEnemy(-1,false,pair); addEnemy(1,false,pair); } else addEnemy(Math.random() < .5 ? -1 : 1);
      s.nextAttack = Math.max(1.05, (2.4 - s.station * .25) * slowdown * (carlos ? .72 : 1)) * (.78 + Math.random() * .45);
    }
    window.MetroEvents.update(dt);
    for (const e of s.enemies) {
      if (!e.grabbed) {
        const reaction = s.buffs.some(b => b.id === "copano") ? .72 : 1;
        e.x += (e.side < 0 ? 1 : -1) * e.speed * reaction * dt;
        if (Math.abs(e.x - 640) < 85) {
          e.grabbed = true;
          const multiple = e.double && s.enemies.some(q => q !== e && q.pair === e.pair && !q.grabbed);
          if (multiple) s.enemies.filter(q => q.pair === e.pair).forEach(q => q.grabbed = true);
          s.screen = "struggle"; s.struggle = { type: multiple ? "two" : "one", timer: 5.6, meter: .58, cursor: 0, bar: .66, press: 0, hits: 0 };
          s.hint = "¡Te agarraron!"; s.hintTime = 1.5; break;
        }
      }
    }
    s.enemies = s.enemies.filter(e => e.x > -180 && e.x < C.width + 180);
    if (s.segment <= 0) nextStation();
  }
  window.MetroGame = { state, start, beginGame, nextStation, addEnemy, punch, struggleTap, fail, tick };
})();


