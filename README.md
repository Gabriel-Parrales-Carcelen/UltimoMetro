# Metro de Vuelta

Videojuego 2D de navegador sobre el último viaje de metro entre Los Héroes y Estación Central. Está hecho con HTML, CSS y JavaScript puro, sin frameworks ni servicios externos. `Metro-de-Vuelta.html` es la versión autocontenida: estilos, código e imágenes vienen dentro de un solo archivo, así que no depende de carpetas vecinas.

## Cómo jugar

Abre `index.html` en un navegador moderno. Pulsa Enter o Espacio para comenzar y avanzar las cinco escenas introductorias.

- **A** o **←**: golpear hacia la izquierda.
- **D** o **→**: golpear hacia la derecha.
- **Espacio**: zafarte, recoger el completo e interactuar en los menús.
- **P** o **Esc**: pausar y continuar.
- **R**: reiniciar durante la pausa.

Cada tramo jugable dura 45 segundos. La ruta superior muestra el avance entre estaciones; no hay cronómetro numérico. El paisaje corre por las ventanas, los ataques arrancan pronto y los ladrones se acercan con mayor velocidad. Los golpes solo conectan con ladrones cercanos y del lado correcto. Cuando te atrapan, el minijuego de zafarse depende de si te rodea uno o más de un ladrón.

## Eventos

Copano amplía el margen de reacción, Mon Laferte ralentiza los ataques, Leo Rey aumenta el alcance y Carlos Pinto intensifica los ataques dobles. El completo se recoge con Espacio dentro de su ventana de cuatro segundos y permite contrarrestar un ataque doble. Cada nuevo millar de puntos activa automáticamente el barrido especial.

El sprite del enemigo se toma de la hoja de Carlos Pinto y conserva su cara sin máscara. Después de Los Héroes se muestra a Freire llegando por Copano. Las cinemáticas usan fondos de imagen fijos a pantalla completa, sin mostrar el juego ni el HUD. Después de ULA, la conductora dice: **«Queda una pura estación.»** Cada escena de estación dura siete segundos.

## Recursos y cambios

Los fondos y retratos están en `assets/`. Se mantienen separados del código para poder sustituirlos. `src/config.js` define las estaciones, duración y datos de eventos; `game.js` lleva el estado y las mecánicas; `events.js` contiene eventos; `cinematics.js` define sus textos; `render.js` dibuja la escena e interfaz y elimina el fondo blanco de las hojas de sprites; `main.js` gestiona controles y el ciclo de juego.

El personaje jugador es un dibujo pixelado creado en código porque no venía un sprite de estudiante entre los recursos adjuntos. Los sprites de celebridades y el fondo del vagón se usan en el juego.
