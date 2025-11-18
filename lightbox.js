document.addEventListener("DOMContentLoaded", () => {

  // Selecciona el lightbox y sus elementos
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const cerrar = document.querySelector(".cerrar");

  // Selecciona TODAS las imágenes de la galería actual
  const imagenes = document.querySelectorAll(
    ".fotos img, .desayuno-fotos img, .almuerzo-fotos img, .bebidas-fotos img"
  );

  if (!lightbox || !lightboxImg || !imagenes.length) {
    console.warn("Lightbox: No se encontraron imágenes o elementos necesarios.");
    return;
  }

  // Abrir lightbox al hacer clic en una imagen
  imagenes.forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      document.body.style.overflow = "hidden"; // bloquea scroll de fondo
    });
  });

  // Cerrar con botón ✖
  cerrar.addEventListener("click", () => {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Cerrar haciendo clic fuera de la imagen
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

});
