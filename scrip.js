document.addEventListener('DOMContentLoaded', () => {
  // --- Carrusel sincronizado imagen + texto ---
  const slides = Array.from(document.querySelectorAll('.fade-slide'));
  const heroText = document.querySelector('.hero-text');

  if (slides.length && heroText) {
    let index = 0;
    let cycleCount = 0; // cuenta cuántos ciclos completos se han hecho (una vuelta entera)

    // Textos sincronizados con las 3 primeras imágenes
    const mensajes = [
      "De la familia Calizaya Aldana",
      "Para la toda la familia",
      "Preparados para vivir un día inolvidable juntos."
    ];

    // Mensajes finales (segundo ciclo)
const textoArriba = "Te invitamos a pasar un dia inolvidable en el rencuentro familiar el 27-diciembre en nuestra casa a horas 9:00 AM";
    const textoFinal = "💖 ¡Nos reunimos de nuevo, familia Calizaya! 💖";

    // Crear los elementos de texto
    const textoSuperior = document.createElement('p');
    textoSuperior.classList.add('mensaje-arriba');
    const textoDinamico = document.createElement('p');
    textoDinamico.classList.add('mensaje-carrusel');

    heroText.appendChild(textoSuperior);
    heroText.appendChild(textoDinamico);

    // Mostrar la primera imagen y texto
    slides[0].classList.add('active');
    textoDinamico.textContent = mensajes[0];
    textoDinamico.classList.add('fade-in');

    // --- Función de cambio ---
    const tick = () => {
      // Quitar la imagen activa y el texto visible
      slides[index].classList.remove('active');
      textoDinamico.classList.remove('fade-in');
      textoDinamico.classList.add('fade-out');

      // Avanzar al siguiente índice
      index++;

      // Si llegó al final del carrusel (última imagen)
      if (index >= slides.length) {
        index = 0;
        cycleCount++; // se completó un ciclo completo
      }

      // Esperar al fade-out antes de cambiar contenido
      setTimeout(() => {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');

        // PRIMER ciclo → mostrar los 3 mensajes normales
        if (cycleCount === 0) {
          textoSuperior.textContent = "";
          textoDinamico.textContent = mensajes[index];
          textoDinamico.classList.remove('mensaje-final');
        }

        // SEGUNDO ciclo → mostrar los mensajes finales
        if (cycleCount >= 1) {
          textoSuperior.textContent = textoArriba;
          textoDinamico.textContent = textoFinal;
          textoDinamico.classList.add('mensaje-final');
        }

        // Aplicar el fade-in del texto
        textoDinamico.classList.remove('fade-out');
        textoDinamico.classList.add('fade-in');
      }, 500); // duración del fade-out antes de cambiar

    };

    // Cambiar cada 4 segundos
    setInterval(tick, 4000);
  }
});
