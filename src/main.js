(() => {
  const canvas = document.getElementById("game"), g = window.MetroGame, s = g.state;
  const overlay = document.getElementById("loading");
  let previous = performance.now(), lastPaint = 0;
  const pressed = new Set();
  function advanceIntro() {
    if (s.intro < 4) s.intro++;
    else g.beginGame();
  }
  function actionSpace() {
    if (s.screen === "menu") { g.start(); return; }
    if (s.screen === "intro") { advanceIntro(); return; }
    if (s.screen === "struggle") { g.struggleTap(); return; }
    if (s.screen === "game") {
      if (s.complete && Math.abs(s.complete.x - 640) < 145) window.MetroEvents.completePickup();
      return;
    }
    if (s.screen === "victory" || s.screen === "defeat") g.start();
  }
  function onKey(e) {
    const key = e.key.toLowerCase();
    if ([" ","arrowleft","arrowright","escape"].includes(key)) e.preventDefault();
    if (e.repeat || pressed.has(key)) return;
    pressed.add(key);
    if (key === "p" || key === "escape") {
      if (s.screen === "game") s.screen = "pause";
      else if (s.screen === "pause") s.screen = "game";
      return;
    }
    if (key === "r" && s.screen === "pause") { g.start(); return; }
    if (key === "enter" || key === " ") { actionSpace(); return; }
    if (key === "arrowleft" || key === "a") g.punch(-1);
    if (key === "arrowright" || key === "d") g.punch(1);
  }
  function onUp(e) { pressed.delete(e.key.toLowerCase()); }
  function frame(now) {
    const dt = Math.min(.05, (now - previous) / 1000); previous = now;
    if (s.screen !== "menu" && s.screen !== "pause" && s.screen !== "victory" && s.screen !== "defeat") g.tick(dt);
    if (now - lastPaint > 1000 / 40) { window.MetroRender.render(); lastPaint = now; }
    if (Object.values(window.MetroRender.images).every(im => im.complete && im.naturalWidth)) overlay.classList.add("done");
    requestAnimationFrame(frame);
  }
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onUp);
  canvas.addEventListener("pointerdown", e => {
    canvas.focus?.(); const box=canvas.getBoundingClientRect(), x=(e.clientX-box.left)*1280/box.width;
    if (s.screen === "game") g.punch(x < 640 ? -1 : 1);
    else if (s.screen === "menu" || s.screen === "intro" || s.screen === "victory" || s.screen === "defeat") actionSpace();
  });
  requestAnimationFrame(frame);
})();
