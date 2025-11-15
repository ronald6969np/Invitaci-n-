/*******************************
 *  CARRUSEL + MENSAJES
 *******************************/
document.addEventListener('DOMContentLoaded', () => {

  const slides = Array.from(document.querySelectorAll('.fade-slide'));
  const heroText = document.querySelector('.hero-text');

  if (slides.length && heroText) {

    let index = 0;
    let cycleCount = 0;

    // Textos del primer ciclo
    const mensajes = [
      "De la familia Calizaya Aldana",
      "Para toda la familia",
      "Preparados para vivir un día inolvidable juntos."
    ];

    // Textos del segundo ciclo
    const textoArriba = "Te invitamos a pasar un día inolvidable en el reencuentro familiar el 27-diciembre en nuestra casa a horas 9:00 AM";
    const textoFinal = "💖 ¡Nos reunimos de nuevo, familia Calizaya! 💖";

    // Crear elementos de texto
    const textoSuperior = document.createElement('p');
    textoSuperior.classList.add('mensaje-arriba');

    const textoDinamico = document.createElement('p');
    textoDinamico.classList.add('mensaje-carrusel');

    heroText.appendChild(textoSuperior);
    heroText.appendChild(textoDinamico);

    slides[0].classList.add('active');
    textoDinamico.textContent = mensajes[0];
    textoDinamico.classList.add('fade-in');

    const tick = () => {

      slides[index].classList.remove('active');
      textoDinamico.classList.remove('fade-in');
      textoDinamico.classList.add('fade-out');

      index++;

      if (index >= slides.length) {
        index = 0;
        cycleCount++;
      }

      setTimeout(() => {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');

        // Evento para activar música
        document.dispatchEvent(new Event("cambioImagenCarrusel"));

        if (cycleCount === 0) {
          textoSuperior.textContent = "";
          textoDinamico.textContent = mensajes[index];
          textoDinamico.classList.remove('mensaje-final');

        } else {
          textoSuperior.textContent = textoArriba;
          textoDinamico.textContent = textoFinal;
          textoDinamico.classList.add('mensaje-final');
        }

        textoDinamico.classList.remove('fade-out');
        textoDinamico.classList.add('fade-in');

      }, 500);
    };

    setInterval(tick, 4000);
  }

});


/*******************************
 *  MÚSICA – CONTROL PERFECTO
 *******************************/
document.addEventListener("DOMContentLoaded", () => {

  const musicBtn = document.getElementById("music-btn");
  const musicIcon = document.getElementById("music-icon");
  const bgMusic = document.getElementById("bg-music");

  let isPlaying = false;        // Estado real
  let userInteracted = false;   // Para desbloquear sonido

  bgMusic.volume = 0.35;


  /**************************************
   *  DESBLOQUEAR AUDIO AL TOCAR LA PANTALLA
   **************************************/
  function enableMusic() {
    if (!userInteracted) {
      userInteracted = true;

      bgMusic.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch(() => {
        // Si falla, el usuario puede usar el botón normalmente
      });
    }
  }

  window.addEventListener("click", enableMusic, { once: true });
  window.addEventListener("touchstart", enableMusic, { once: true });



  /**************************************
   *  BOTÓN DE REPRODUCIR/PAUSAR
   **************************************/
  musicBtn.addEventListener("click", () => {

    if (!userInteracted) {
      // Si el usuario pulsa el botón antes de desbloquear audio
      enableMusic();
      return;
    }

    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
    } else {
      bgMusic.play();
      isPlaying = true;
    }

    updateUI();
  });



  /**************************************
   *  ACTUALIZACIÓN DE ICONO Y ESTILOS
   **************************************/
  function updateUI() {
    if (isPlaying) {
      musicIcon.src = "logos/musica_on.png";
      musicBtn.classList.add("music-playing");
      musicBtn.title = "Pausar música";
    } else {
      musicIcon.src = "logos/musica_off.png";
      musicBtn.classList.remove("music-playing");
      musicBtn.title = "Reproducir música";
    }
  }

});
