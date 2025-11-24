// ========== CARRUSEL HOME ==========
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

    const textoArriba = "Te invitamos a pasar un día inolvidable en el reencuentro familiar el 27-diciembre en nuestra casa a horas 9:00 AM";
    const textoFinal = "💖 ¡Nos reunimos de nuevo, familia Calizaya! 💖";

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

  // ========== SPA ==========
  class SPA {
    constructor() {
      this.currentPage = 'home';
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-page]');
        if (link) {
          e.preventDefault();
          const page = link.getAttribute('data-page');
          this.navigateTo(page);
          return;
        }

        const backBtn = e.target.closest('.btn-volver');
        if (backBtn) {
          e.preventDefault();
          this.navigateTo('home');
          return;
        }
      });

      window.addEventListener('hashchange', () => {
        const page = window.location.hash.replace('#', '') || 'home';
        this.navigateTo(page);
      });

      const initialPage = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(initialPage, false);
    }

    async navigateTo(page, animate = true) {
      if (this.currentPage === page) return;

      if (animate) {
        this.hideCurrentPage();
        await this.delay(300);
      }

      await this.loadPage(page);

      this.currentPage = page;
      window.location.hash = page === 'home' ? '' : page;

      if (animate) {
        this.showCurrentPage();
      } else {
        const pageEl = document.getElementById(`${this.currentPage}-page`);
        if (pageEl) {
          pageEl.classList.add('active');
          pageEl.style.opacity = '1';
          pageEl.style.transform = 'translateY(0)';
        }
      }

      // No inicializamos lightbox ya que lo eliminamos
    }

    hideCurrentPage() {
      const currentPageEl = document.getElementById(`${this.currentPage}-page`);
      if (currentPageEl) {
        currentPageEl.style.opacity = '0';
        currentPageEl.style.transform = 'translateY(20px)';
        setTimeout(() => {
          currentPageEl.classList.remove('active');
        }, 300);
      }
    }

    async loadPage(page) {
      const pageEl = document.getElementById(`${page}-page`);
      if (page === 'home') return;

      try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        let content = null;
        if (page === 'fotos') {
          content = tempDiv.querySelector('.galeria-content');
        } else if (page === 'comida') {
          content = tempDiv.querySelector('.comida-content');
        }

        if (content) {
          pageEl.innerHTML = content.outerHTML;
        } else {
          throw new Error('No se encontró el contenido específico de la página');
        }

      } catch (error) {
        pageEl.innerHTML = `
          <div style="padding: 50px; text-align: center; color: white; background: #ff4757;">
            <h2>Error al cargar la página</h2>
            <p>${error.message}</p>
            <button onclick="window.location.hash=''" style="padding: 10px 20px; margin-top: 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Volver al Inicio
            </button>
          </div>
        `;
      }
    }

    showCurrentPage() {
      const pageEl = document.getElementById(`${this.currentPage}-page`);
      if (pageEl) {
        pageEl.classList.add('active');
        setTimeout(() => {
          pageEl.style.opacity = '1';
          pageEl.style.transform = 'translateY(0)';
        }, 50);
      }
    }

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // ========== MÚSICA ==========
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  const icon = document.getElementById("music-icon");
  const bigMusicBtn = document.getElementById("big-music-init");

  let isPlaying = false;
  let audioInitialized = false;

  audio.volume = 0.35;
  audio.loop = true;

  function initializeAudio() {
    if (audioInitialized) return;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioInitialized = true;
    }).catch(() => { });
  }

  function checkSavedState() {
    const savedState = localStorage.getItem("music-playing");
    const savedTime = localStorage.getItem("music-time");

    // Siempre mostrar botón grande al recargar
    if (bigMusicBtn) {
      bigMusicBtn.classList.remove('hidden');
      btn.classList.add('hidden');
    }

    // Solo restaurar el tiempo de reproducción, no el estado
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }

    // Actualizar el estado interno (pero no reproducir automáticamente)
    isPlaying = false;
    icon.src = "logos/musica_off.png";
    btn.classList.remove("music-playing");
  }

  function startMusic() {
    if (!audioInitialized) initializeAudio();

    audio.play().then(() => {
      isPlaying = true;
      audioInitialized = true;
      localStorage.setItem("music-playing", "true");
      localStorage.setItem("music-time", audio.currentTime);

      // Transición a botón pequeño
      if (bigMusicBtn) bigMusicBtn.classList.add('hidden');
      btn.classList.remove('hidden');
      icon.src = "logos/musica_on.png";
      btn.classList.add("music-playing");
    }).catch(() => {
      alert("No se pudo iniciar la música. Asegúrate de que el navegador permita la reproducción de audio.");
    });
  }

  function toggleMusic() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      icon.src = "logos/musica_off.png";
      btn.classList.remove("music-playing");
      localStorage.setItem("music-playing", "false");
    } else {
      audio.play().then(() => {
        isPlaying = true;
        icon.src = "logos/musica_on.png";
        btn.classList.add("music-playing");
        localStorage.setItem("music-playing", "true");
      }).catch(() => {
        alert("Error al reproducir la música. Intenta nuevamente.");
      });
    }
  }

  if (bigMusicBtn) bigMusicBtn.addEventListener('click', startMusic);
  btn.addEventListener('click', toggleMusic);

  setInterval(() => {
    if (!audio.paused && isPlaying) {
      localStorage.setItem("music-time", audio.currentTime);
    }
  }, 1000);

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => { });
  });

  // Inicializar
  initializeAudio();
  checkSavedState();
  window.spa = new SPA();
});