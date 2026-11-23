(() => {
  const s = window.MetroGame.state, cfg = window.MetroConfig;
  function activate(id) {
    const data = cfg.events[id]; s.buffs = s.buffs.filter(b => b.id !== id);
    s.buffs.push({ id, name: data.name, effect: data.effect, time: data.duration, max: data.duration });
    s.eventName = id; s.hint = `${data.name}: ${data.effect}`; s.hintTime = 2.4;
    window.MetroAudio?.playCharacter(id);
    s.effects.push({ type: "event", x: 640, y: 215, t: 1.7, label: data.name });
  }
  function update(dt) {
    s.nextEvent -= dt;
    if (s.station === 0 && !s.buffs.some(b => b.id === "copano") && s.elapsed > 8 && !s.eventName) { activate("copano"); return; }
    if (s.nextEvent <= 0) {
      s.nextEvent = 18 + Math.random() * 12;
      const options = ["mon", "leo", "carlos"];
      const id = options[Math.floor(Math.random() * options.length)]; activate(id);
    }
    if (!s.complete && !s.hasComplete && !s.completeSpawned && s.elapsed > 13) {
      s.complete = { x: Math.random() < .5 ? 560 : 720 }; s.completeWindow = 4; s.completeSpawned = true;
      s.hint = "¡Se cayó un completo! ESPACIO para recoger"; s.hintTime = 2.8;
    }
    // Tormenta China y Juan Carlos Bodoque cruzan solos al superar cada millar.
    if (s.score >= s.threshold * 1000) {
      s.buffs.push({ id: "sweep", name: "BARRIDO ESPECIAL", effect: "Tormenta China y Bodoque limpian el vagón", time: 5, max: 5 });
      s.enemies = []; s.effects.push({ type: "sweep", x: 640, y: 260, t: 5, label: "¡TORmenta China + BODOQUE!" });
      s.threshold++; s.nextAttack = Math.max(s.nextAttack, 5);
    }
    if (s.buffs.some(b => b.id === "sweep")) s.enemies = [];
  }
  function completePickup() {
    if (s.complete) { s.complete = null; s.hasComplete = true; s.hint = "¡Completo guardado! Tu próximo doble se puede contrarrestar"; s.hintTime = 3; }
  }
  window.MetroEvents = { update, activate, completePickup };
})();

