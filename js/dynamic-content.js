// dynamic-content.js

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  // Función para cargar contenido desde un archivo HTML
  function cargarContenido(url) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        mainContent.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error al cargar el contenido:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el contenido.",
          icon: "error",
        });
      });
  }

  // Listener para el menú desplegable
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.target.getAttribute("data-page");
      if (page) {
        let url = "";
        switch (page) {
          case "contacts":
            url = "pages/contacts.html";
            break;
          case "comentarios":
            url = "pages/comentarios.html";
            break;
          case "autores":
            url = "pages/autores.html";
            break;
          case "libros":
            url = "pages/libros.html";
            break;
          default:
            url = "pages/contacts.html";
        }
        cargarContenido(url);
      }
    });
  });
});
