// === LIGHTBOX SIMPLE ===
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const cerrar = document.querySelector('.cerrar');
  const fotos = document.querySelectorAll('.fotos img');

  fotos.forEach(img => {
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
    });
  });

  // Cerrar al hacer clic o presionar "Esc"
  lightbox.addEventListener('click', () => lightbox.style.display = 'none');
  cerrar.addEventListener('click', () => lightbox.style.display = 'none');
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.style.display = 'none';
  });
});
