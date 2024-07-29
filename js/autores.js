document.addEventListener("DOMContentLoaded", () => {
  const autoresBody = document.getElementById("autores-body");
  const pagination = document.getElementById("autores-pagination");
  const autoresPerPage = 10; // Número de autores por página
  let currentPage = 1;
  let autores = [];

  // Función para obtener los autores desde el servidor
  const obtenerAutores = async () => {
    try {
      const response = await fetch(
        "http://arojas252000.duckdns.org:6480/php/autores.php"
      );
      if (!response.ok) throw new Error("Error al obtener los autores");
      autores = await response.json();
      mostrarAutores();
      mostrarPaginacion();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los autores. Inténtalo de nuevo más tarde.",
      });
    }
  };

  // Función para mostrar los autores en la tabla
  const mostrarAutores = () => {
    autoresBody.innerHTML = "";
    const start = (currentPage - 1) * autoresPerPage;
    const end = start + autoresPerPage;
    const autoresPagina = autores.slice(start, end);

    autoresPagina.forEach((autor) => {
      const row = document.createElement("tr");
      row.innerHTML = `
		  <td>${autor.id_autor}</td>
		  <td>${autor.Nombres}</td>
		  <td>${autor.direccion}</td>
		  <td>${autor.ciudad}</td>
		  <td>${autor.pais}</td>
		  <td>${autor.cod_postal}</td>
		  <td>${autor.estado}</td>
		  <td>${autor.telefono}</td>
		`;
      autoresBody.appendChild(row);
    });
  };

  // Función para mostrar la paginación
  const mostrarPaginacion = () => {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(autores.length / autoresPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
      pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageItem.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        mostrarAutores();
        mostrarPaginacion();
      });
      pagination.appendChild(pageItem);
    }
  };

  obtenerAutores();
});
