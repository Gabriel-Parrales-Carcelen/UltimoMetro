(() => {
  const stations = ["Los Héroes", "República", "ULA", "Estación Central"];
  const events = {
    copano: { name: "COPANO", effect: "Más tiempo para reaccionar", duration: 11, firstStation: 0 },
    mon: { name: "MON LAFERTE", effect: "Los ataques se ralentizan", duration: 12 },
    leo: { name: "LEO REY", effect: "Mayor alcance del golpe", duration: 12 },
    carlos: { name: "CARLOS PINTO", effect: "Más ataques dobles y veloces", duration: 12 }
  };
  window.MetroConfig = { width: 1280, height: 720, stations, segmentSeconds: 45, cinematicSeconds: 7, events };
})();
