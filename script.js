// ========== CONTADOR REGRESIVO MEJORADO ==========
function startCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;

  function updateCountdown() {
    // Cambiar esta fecha por la de tu evento
    const eventDate = new Date('December 27, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      // El evento ya pasó - mensaje mejorado
      countdownElement.innerHTML = `
        <div class="countdown-finished">
           ¡La reunion está en marcha! 
          <div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.9;">
             Únete  
          </div>
        </div>
      `;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Formato mejorado con ceros a la izquierda
    countdownElement.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Días</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours.toString().padStart(2, '0')}</span>
        <span class="countdown-label">Horas</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes.toString().padStart(2, '0')}</span>
        <span class="countdown-label">Minutos</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds.toString().padStart(2, '0')}</span>
        <span class="countdown-label">Segundos</span>
      </div>
    `;
  }

  // Actualizar inmediatamente y luego cada segundo
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ========== CARRUSEL HOME ==========
document.addEventListener('DOMContentLoaded', () => {
  // Iniciar el contador regresivo automáticamente
  startCountdown();
  
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

  // ========== MÚSICA SIMPLIFICADA PARA SPA ==========
const audio = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");
const icon = document.getElementById("music-icon");
const bigMusicBtn = document.getElementById("big-music-init");

let isPlaying = false;
let musicStarted = false;

audio.volume = 0.35;
audio.loop = true;

// Función para actualizar la UI de música
function updateMusicUI() {
  if (isPlaying) {
    icon.src = "logos/musica_on.png";
    btn.classList.add("music-playing");
    
    const bigIcon = document.querySelector('.big-music-init .big-music-icon');
    if (bigIcon) {
      bigIcon.src = "logos/musica_on.png";
    }
  } else {
    icon.src = "logos/musica_off.png";
    btn.classList.remove("music-playing");
    
    const bigIcon = document.querySelector('.big-music-init .big-music-icon');
    if (bigIcon && bigMusicBtn && !bigMusicBtn.classList.contains('hidden')) {
      bigIcon.src = "logos/big-btn2.png";
    }
  }
}

// Función principal para iniciar música
function startMusic() {
  if (musicStarted && isPlaying) return;
  
  console.log("Iniciando música...");
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("¡Música iniciada!");
        isPlaying = true;
        musicStarted = true;
        
        if (bigMusicBtn) bigMusicBtn.classList.add('hidden');
        btn.classList.remove('hidden');
        
        updateMusicUI();
      })
      .catch(error => {
        console.error("Error al reproducir:", error);
        initializeAudioForMobile();
      });
  }
}

// Estrategia para móviles
function initializeAudioForMobile() {
  console.log("Intentando estrategia móvil...");
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      audioContext.close();
    }
  } catch (e) {
    console.log("AudioContext no disponible:", e);
  }
  
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    
    setTimeout(() => {
      startMusic();
    }, 100);
  }).catch(e => {
    console.log("Estrategia móvil falló:", e);
  });
}

// Función para alternar música (botón pequeño)
function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    updateMusicUI();
  } else {
    isPlaying = true;
    updateMusicUI();
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          console.log("Música reanudada exitosamente");
        })
        .catch(error => {
          console.error("Error al reanudar:", error);
          isPlaying = false;
          updateMusicUI();
          startMusic();
        });
    }
  }
}

// Función para iniciar música desde cualquier botón de navegación
function initiateMusicFromNavigation() {
  if (!musicStarted) {
    console.log("🎵 Activando música desde navegación...");
    startMusic();
  } else if (!isPlaying) {
    console.log("🎵 Reanudando música desde navegación...");
    toggleMusic();
  }
}

// Inicializar sistema de música
function initializeMusicSystem() {
  const bigIcon = document.querySelector('.big-music-init .big-music-icon');
  if (bigIcon) {
    bigIcon.src = "logos/big-btn2.png";
  }
  
  if (bigMusicBtn) bigMusicBtn.classList.remove('hidden');
  btn.classList.add('hidden');
  
  isPlaying = false;
  musicStarted = false;
  updateMusicUI();
}

// EVENT LISTENERS

// 1. Botón grande de música
if (bigMusicBtn) {
  bigMusicBtn.addEventListener('click', startMusic);
  bigMusicBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    startMusic();
  });
}

// 2. Botones de navegación (fotos y comida) - activan música
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[data-page]');
  if (link) {
    const page = link.getAttribute('data-page');
    console.log(`🔗 Navegando a: ${page}`);
    if (page === 'fotos' || page === 'comida') {
      initiateMusicFromNavigation();
    }
  }
});

// 3. Botón pequeño para toggle
btn.addEventListener('click', toggleMusic);
btn.addEventListener('touchend', function(e) {
  e.preventDefault();
  toggleMusic();
});

// Reiniciar cuando termine (backup por si loop falla)
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  if (isPlaying) {
    audio.play().catch(() => { });
  }
});

// Inicializar música al cargar
initializeMusicSystem();

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

        if (this.currentPage === 'fotos') {
          setTimeout(() => {
            initGallery();
          }, 100);
        }

        if (this.currentPage === 'comida') {
          setTimeout(() => {
            initComidaLightbox();
          }, 100);
        }
      }
    }

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // ========== GALERÍA 3D ==========
  function initGallery() {
    const sphere = document.getElementById('sphere');
    
    const images = [
      'img_familia/Fimagen_pc1.jpg',
      'img_familia/Fimagen_pc2.jpg', 
      'img_familia/Fimagen_pc3.jpg',
      'img_albaro/Aimagen1.jpg',
      'img_albaro/Aimagen2.jpg',
      'img_albaro/Aimagen3.jpg',
      'imgenes_saul/Simagen4.jpg',
      'imgenes_saul/Simagen5.jpg',
      'imgenes_saul/Simagen6.jpg',
      'img/img1.jpg',
      'img/img2.jpg',
      'img/img3.jpg',
      'img/imgAbuelos.jpg',
    ];

    let currentRotation = { x: 0, y: 0 };
    let isAutoRotating = true;
    let isDragging = false;
    let autoRotateInterval;
    let startX, startY, startRotationX, startRotationY;

    function createSphereItems() {
  sphere.innerHTML = '';
  
  const totalItems = 78;
  const radius = 300;
  
  for (let i = 0; i < totalItems; i++) {
    const item = document.createElement('div');
    item.className = 'sphere-item';
    
    // DISTRIBUCIÓN ESFÉRICA
    const phi = Math.acos(1 - (2 * i) / totalItems);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    // SOLO ROTACIÓN HORIZONTAL (Y) PARA MIRAR AL CENTRO
    // LAS FOTOS SE MANTIENEN VERTICALES (sin rotación X)
    const rotationY = Math.atan2(x, z);
    
    // APLICAR POSICIÓN + SOLO ROTACIÓN HORIZONTAL
    item.style.transform = `
      translate3d(${x}px, ${y}px, ${z}px)
      rotateY(${rotationY}rad)
    `;
    
    const imgIndex = i % images.length;
    const img = document.createElement('img');
    img.src = images[imgIndex];
    img.alt = `Recuerdo ${imgIndex + 1}`;
    img.loading = "lazy";
    
    img.onerror = function() {
      console.error('Error cargando imagen:', this.src);
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gJm5ic3A7ezxpbmRleCsxPn08L3RleHQ+PC9zdmc+';
    };
    
    item.appendChild(img);
    sphere.appendChild(item);
    
    item.addEventListener('click', function(e) {
      if (!isDragging) {
        e.stopPropagation();
        openModal(images[imgIndex]);
      }
    });
  }
  
  console.log(`✅ Creados ${totalItems} elementos verticales mirando al centro`);
}
    function setupDrag() {
      const container = document.querySelector('.sphere-container');
      
      const startDrag = (e) => {
        isDragging = false;
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        startRotationX = currentRotation.x;
        startRotationY = currentRotation.y;
      };
      
      const doDrag = (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        currentRotation.y = startRotationY + (deltaX / 25);
        currentRotation.x = Math.max(-8, Math.min(8, startRotationX - (deltaY / 25)));
        
        updateSphereRotation();
      };
      
      const endDrag = () => {
        isDragging = false;
        setTimeout(() => {
          if (!isDragging) isAutoRotating = true;
        }, 1000);
      };
      
      container.addEventListener('mousedown', startDrag);
      container.addEventListener('mousemove', doDrag);
      container.addEventListener('mouseup', endDrag);
      container.addEventListener('mouseleave', endDrag);
      
      container.addEventListener('touchstart', startDrag, { passive: true });
      container.addEventListener('touchmove', doDrag, { passive: true });
      container.addEventListener('touchend', endDrag);
    }

    function startAutoRotation() {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
      
      autoRotateInterval = setInterval(() => {
        if (isAutoRotating && !isDragging) {
          currentRotation.y += 0.15;
          updateSphereRotation();
        }
      }, 30);
    }

    function updateSphereRotation() { 
  sphere.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
}
    const resetBtn = document.getElementById('reset-view');
    const rotateBtn = document.getElementById('auto-rotate');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentRotation = { x: 0, y: 0 };
        isAutoRotating = true;
        updateSphereRotation();
      });
    }

    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        const icon = rotateBtn.querySelector('.control-icon');
        if (icon) {
          icon.src = isAutoRotating ? "logos/pausa.png" : "logos/play.png";
        }
      });
    }

    createSphereItems();
    setupDrag();
    startAutoRotation();
    updateSphereRotation();
  }

  // ========== LIGHTBOX ==========
  function openModal(src) {
    const modal = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    
    if (!modal || !modalImage) {
      console.error('Modal no encontrado');
      return;
    }

    modalImage.src = src;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };
    
    document.getElementById('close-modal').onclick = closeModal;
    modal.onclick = function(e) {
      if (e.target === modal) {
        closeModal();
      }
    };
    
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);
  }

  // ========== LIGHTBOX COMIDA ==========
  function initComidaLightbox() {
    const images = document.querySelectorAll('#comida-page .lightbox-trigger');
    const modal = document.getElementById('comida-modal-overlay');
    const modalImage = document.getElementById('comida-modal-image');
    const closeBtn = document.getElementById('close-comida-modal');

    if (!modal || !modalImage) return;

    images.forEach((img) => {
      img.addEventListener('click', function(e) {
        e.preventDefault();
        const src = this.src;
        modalImage.src = src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    document.addEventListener('keydown', escHandler);
  }

  // Inicializar SPA
  window.spa = new SPA();
});