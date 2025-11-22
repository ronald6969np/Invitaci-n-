/* ==========================================
   musc.js — Música con botón grande solo en index
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  const icon = document.getElementById("music-icon");
  const bigMusicBtn = document.getElementById("big-music-init");

  if (!audio || !btn || !icon) return;

  audio.volume = 0.35;
  let isPlaying = false;

  /* ----------------------------------------
     Restaurar estado desde localStorage
  ---------------------------------------- */
  const savedTime = localStorage.getItem("music-time");
  const savedState = localStorage.getItem("music-state");
  const musicActivated = localStorage.getItem("music-activated");

  if (savedTime) audio.currentTime = parseFloat(savedTime);

  // ==============================================
  // COMPORTAMIENTO PARA INDEX.HTML (con botón grande)
  // ==============================================
  if (bigMusicBtn) {
    // Si la música ya fue activada antes, ocultar el botón grande y mostrar el pequeño
    if (musicActivated === "true") {
      bigMusicBtn.classList.add('hidden');
      btn.classList.remove('hidden');

      if (savedState === "playing") {
        isPlaying = true;
        icon.src = "logos/musica_on.png";
        btn.classList.add("music-playing");
        audio.play().catch(() => { });
      }
    } else {
      // Primera vez: mostrar solo el botón grande
      btn.classList.add('hidden');
    }

    /* ======================================================
       BOTÓN GRANDE INICIAL - Activar música por primera vez
    ====================================================== */
    bigMusicBtn.addEventListener("click", () => {
      // Marcar como activado
      localStorage.setItem("music-activated", "true");
      localStorage.setItem("music-unlocked", "true");

      // Reproducir música
      audio.play().then(() => {
        isPlaying = true;
        localStorage.setItem("music-state", "playing");

        // Animación de despedida del botón grande
        bigMusicBtn.style.transition = "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        bigMusicBtn.style.opacity = "0";
        bigMusicBtn.style.transform = "translate(-50%, -50%) scale(0.5)";

        setTimeout(() => {
          bigMusicBtn.classList.add('hidden');

          // Mostrar botón pequeño con animación
          btn.classList.remove('hidden');

          // Actualizar icono
          icon.src = "logos/musica_on.png";
          btn.classList.add("music-playing");
        }, 400);

      }).catch((error) => {
        console.error("Error al reproducir música:", error);
      });
    });

  }
  // ==============================================
  // COMPORTAMIENTO PARA OTRAS PÁGINAS (sin botón grande)
  // ==============================================
  else {
    // En otras páginas, mostrar el botón pequeño directamente
    btn.classList.remove('hidden');

    if (savedState === "playing") {
      isPlaying = true;
      icon.src = "logos/musica_on.png";
      btn.classList.add("music-playing");
      audio.play().catch(() => { });
    }
  }

  /* ======================================================
     BOTÓN PEQUEÑO - Play / Pause normal (funciona en todas las páginas)
  ====================================================== */
  btn.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      icon.src = "logos/musica_off.png";
      btn.classList.remove("music-playing");
      localStorage.setItem("music-state", "paused");
    } else {
      audio.play().catch(() => { });
      isPlaying = true;
      icon.src = "logos/musica_on.png";
      btn.classList.add("music-playing");
      localStorage.setItem("music-state", "playing");
    }
  });

  /* ----------------------------------------
     Guardar tiempo de reproducción
  ---------------------------------------- */
  setInterval(() => {
    if (!audio.paused) {
      localStorage.setItem("music-time", audio.currentTime);
    }
  }, 350);

  /* ----------------------------------------
     Repetir automáticamente
  ---------------------------------------- */
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => { });
  });

  /* ======================================================
     FADE OUT al cambiar de página
  ====================================================== */
  function smoothFadeOutAndGo(url) {
    let vol = audio.volume;

    const fade = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        vol = 0;
        clearInterval(fade);
        localStorage.setItem("music-time", audio.currentTime);
        window.location.href = url;
      }
      audio.volume = vol;
    }, 50);
  }

  /* Interceptar clics en enlaces internos */
  document.querySelectorAll("a[href]").forEach(a => {
    a.addEventListener("click", e => {
      const url = a.getAttribute("href");

      // Dejar pasar enlaces externos (whatsapp/maps)
      if (url.startsWith("http") && !url.includes(window.location.host)) return;

      if (url.startsWith("#") || url.startsWith("javascript")) return;

      e.preventDefault();
      smoothFadeOutAndGo(url);
    });
  });

});