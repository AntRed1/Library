document.addEventListener("DOMContentLoaded", () => {
    const librosBody = document.getElementById("libros-body");
    const pagination = document.getElementById("pagination");
    const librosPerPage = 10;
    let currentPage = 1;
    let libros = [];
    let totalPages = 0;
  
    const obtenerLibros = async () => {
      try {
        const response = await fetch("http://arojas252000.duckdns.org:6480/php/libros.php?page=" + currentPage + "&perPage=" + librosPerPage);
        if (!response.ok) throw new Error("Error al obtener los libros");
        
        const data = await response.json();
        
        // Extrae el array de libros y el número total de páginas
        libros = data.libros;
        totalPages = data.totalPages;
        
        mostrarLibros();
        mostrarPaginacion();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los libros. Inténtalo de nuevo más tarde.",
        });
      }
    };
  
    const mostrarLibros = () => {
      librosBody.innerHTML = "";
      const start = (currentPage - 1) * librosPerPage;
      const end = start + librosPerPage;
      const librosPagina = libros.slice(start, end);
  
      librosPagina.forEach((libro) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${libro.id_autor}</td>
            <td>${libro.id_titulo}</td>
            <td>${libro.id_pub}</td>
            <td>${libro.Nombres}</td>
            <td>${libro.titulo}</td>
            <td>${libro.notas}</td>
            <td>${libro.precio}</td>
            <td>${libro.fecha_pub}</td>
            <td>${libro.derechos}</td>
          `;
        librosBody.appendChild(row);
      });
    };
  
    const mostrarPaginacion = () => {
      pagination.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = i;
          obtenerLibros();
        });
        pagination.appendChild(pageItem);
      }
    };
  
    obtenerLibros();
  });
  