(() => {
  const C = window.MetroConfig, s = window.MetroGame.state;
  function textForCinematic() {
    if (!s.cinematic) return "";
    if (s.cinematic.from === 0) return "Sergio Freire llega y se lleva a Copano rumbo a República.";
    if (s.cinematic.from === 2) return "Queda una pura estación.";
    return `El tren parte rumbo a ${C.stations[s.cinematic.to]}.`;
  }
  window.MetroCinematics = { textForCinematic };
})();
