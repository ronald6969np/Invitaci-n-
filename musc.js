/* ==========================================
   musc.js — Música sincronizada entre páginas
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  const icon = document.getElementById("music-icon");
  const touchLayer = document.getElementById("touch-layer");

  if (!audio || !btn || !icon) return;

  audio.volume = 0.35;

  let userInteracted = false;
  let isPlaying = false;

  /* ----------------------------------------
     Restaurar estado desde localStorage
  ---------------------------------------- */
  const savedTime = localStorage.getItem("music-time");
  const savedState = localStorage.getItem("music-state");
  let unlocked = localStorage.getItem("music-unlocked");

  if (savedTime) audio.currentTime = parseFloat(savedTime);

  if (savedState === "playing") {
    isPlaying = true;
    icon.src = "logos/musica_off.png";
    btn.classList.remove("music-playing");
  }

  /* ----------------------------------------
     Si estaba desbloqueado antes → autoplay real
  ---------------------------------------- */
  if (isPlaying && unlocked === "true") {
    audio.play().then(() => {
      icon.src = "logos/musica_on.png";
      btn.classList.add("music-playing");
      if (touchLayer) touchLayer.style.display = "none";
    }).catch(() => { });
  }

  /* ======================================================
     UNLOCK AUDIO — Funciona en móviles con cualquier toque
  ====================================================== */
  function unlockAudio() {
    if (!userInteracted) {
      userInteracted = true;
      unlocked = "true";
      localStorage.setItem("music-unlocked", "true");

      if (isPlaying) {
        audio.play().then(() => {
          icon.src = "logos/musica_on.png";
          btn.classList.add("music-playing");
        }).catch(() => { });
      }

      if (touchLayer) touchLayer.style.display = "none";

      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    }
  }

  window.addEventListener("touchstart", unlockAudio, { once: true });
  window.addEventListener("click", unlockAudio, { once: true });


  /* ======================================================
     BOTÓN PLAY / PAUSE — FIX DEFINITIVO
  ====================================================== */
  btn.addEventListener("click", (event) => {

    event.stopPropagation();          // Evita activar unlock sin querer
    userInteracted = true;
    localStorage.setItem("music-unlocked", "true");

    // Si aún no está desbloqueado → desbloquear primero
    if (!unlocked || unlocked === "false") {
      unlocked = "true";
      localStorage.setItem("music-unlocked", "true");

      audio.play().then(() => {
        isPlaying = true;
        icon.src = "logos/musica_on.png";
        btn.classList.add("music-playing");
        if (touchLayer) touchLayer.style.display = "none";
      }).catch(() => { });
      return;
    }

    // Toggle normal
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
