/*******************************
 *  CARRUSEL + MENSAJES
 *******************************/
document.addEventListener('DOMContentLoaded', () => {

  const slides = Array.from(document.querySelectorAll('.fade-slide'));
  const heroText = document.querySelector('.hero-text');

  if (slides.length && heroText) {

    let index = 0;
    let cycleCount = 0;

    const mensajes = [
      "De la familia Calizaya Aldana",
      "Para toda la familia",
      "Preparados para vivir un día inolvidable juntos."
    ];

    const textoArriba =
      "Te invitamos a pasar un día inolvidable en el reencuentro familiar el 27-diciembre en nuestra casa a horas 9:00 AM";

    const textoFinal =
      "💖 ¡Nos reunimos de nuevo, familia Calizaya! 💖";


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
