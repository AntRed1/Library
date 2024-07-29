// Función para mostrar mensaje de SweetAlert
function mostrarMensaje(title, text, icon = "info") {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: "OK",
  });
}

// Función para cargar comentarios
async function cargarComentarios() {
  try {
    // Mostrar SweetAlert de carga
    Swal.fire({
      title: "Cargando comentarios...",
      html: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden">Cargando...</span>',
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const response = await fetch("php/comentarios.php");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    actualizarComentariosUI(data); // Actualizar la interfaz con los comentarios obtenidos

    // Cerrar SweetAlert después de cargar comentarios
    Swal.close();
  } catch (error) {
    console.error(error);
  }
}

// Función para actualizar la interfaz con los comentarios obtenidos
function actualizarComentariosUI(data) {
  const comentariosContainer = document.getElementById("comentariosContainer");
  comentariosContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos comentarios
  data.forEach((comentario) => {
    const comentarioHTML = `
      <div class="alert alert-light" role="alert">
        <p><strong>${comentario.nombre} ${comentario.apellidos}</strong></p>
        <p>${comentario.comentarios}</p>
        <small class="text-muted">${comentario.fecha}</small>
      </div>
    `;
    comentariosContainer.innerHTML += comentarioHTML;
  });
}

// Función para validar campos del formulario
function validarCampos(nombre, apellidos, email, comentarios) {
  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    nombre.trim() !== "" &&
    apellidos.trim() !== "" &&
    email.trim() !== "" &&
    comentarios.trim() !== "" &&
    emailRegex.test(email)
  );
}

// Función para limpiar los campos del formulario después de enviar
function limpiarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("email").value = "";
  document.getElementById("comentarios").value = "";
}

// Función para enviar comentario
async function enviarComentario(formData) {
  try {
    const response = await fetch("php/comentarios.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Función para manejar el envío del formulario
async function Enviar(event) {
  event.preventDefault(); // Prevenir envío por default

  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const comentarios = document.getElementById("comentarios").value.trim();

  if (!validarCampos(nombre, apellidos, email, comentarios)) {
    mostrarMensaje(
      "Existen Campos Vacíos",
      "Por favor, complete todos los campos correctamente.",
      "error"
    );
    return;
  }

  const result = await Swal.fire({
    title: "Desea guardar los cambios?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    denyButtonText: `No Guardar`,
  });

  if (result.isConfirmed) {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellidos", apellidos);
    formData.append("email", email);
    formData.append("comentarios", comentarios);

    const data = await enviarComentario(formData);
    if (data.success) {
      limpiarCampos();
      mostrarMensaje(
        "Guardado",
        "El comentario se ha guardado correctamente.",
        "success"
      );
      // Recargar comentarios después de guardar
      actualizarBadge();
    } else {
      mostrarMensaje(
        "Error",
        `No se pudo guardar el comentario. ${data.message}`,
        "error"
      );
    }
  } else if (result.isDenied) {
    mostrarMensaje("Cancelado", "Los cambios no fueron guardados.", "info");
  }
}

// Función para actualizar el badge con la cantidad de comentarios
async function actualizarBadge() {
  try {
    const response = await fetch("php/comentarios.php");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const commentBadge = document.getElementById("commentBadge");
    commentBadge.innerText = data.length;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Listener para el botón de cargar comentarios
  const btnCargarComentarios = document.getElementById("btnCargarComentarios");
  if (btnCargarComentarios) {
    btnCargarComentarios.addEventListener("click", cargarComentarios);
  }

  // Listener para el envío del formulario
  const formulario = document.getElementById("formularioComentario");
  if (formulario) {
    formulario.addEventListener("submit", Enviar);
  }

  // Actualizar el badge al cargar la página
  actualizarBadge();
});
