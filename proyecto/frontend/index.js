const listaTareas = document.querySelector(".lista-tareas");
const fondoModal = document.querySelector("#fondo-modal");
const botonAgregarTarea = document.querySelector(".boton-agregar-tarea");
const entradaNuevaTarea = document.querySelector(".entrada-nueva-tarea");
const modalEditarTarea = document.querySelector("#modal-editar-tarea");
const modalTituloTarea = document.querySelector("#modal-titulo-tarea");
const entradaEditarTarea = document.querySelector("#entrada-editar-tarea");
const entradaTituloTarea = document.querySelector("#entrada-titulo-tarea");
const botonGuardarEdicion = document.querySelector("#guardar-edicion-tarea");
const botonCancelarEdicion = document.querySelector("#cancelar-edicion-tarea");
const botonGuardarTitulo = document.querySelector("#guardar-titulo-tarea");
const botonCancelarTitulo = document.querySelector("#cancelar-titulo-tarea");
const botonIniciarSesion = document.querySelector(".boton-iniciar-sesion");

let tareaSeleccionada = null;
const tareas = [];

function agregarTarea(evento) {
  evento.preventDefault();

  const texto = entradaNuevaTarea.value.trim();

  if (!texto) {
    return;
  }

  const tarea = { texto, titulo: "" };
  tareas.push(tarea);
  tareaSeleccionada = tarea;
  entradaNuevaTarea.value = "";

  fondoModal.classList.remove("esta-oculto");
  modalTituloTarea.classList.remove("esta-oculto");
}

function guardarTituloTarea() {
  const titulo = entradaTituloTarea.value.trim();

  if (!titulo || !tareaSeleccionada) {
    return;
  }

  const tarea = tareaSeleccionada;
  tarea.titulo = titulo;
  crearTarea(tarea);
  entradaTituloTarea.value = "";
  ocultarModalTitulo();

  fetch("/tareas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: tarea.titulo,
      texto: tarea.texto
    }),
  }).catch((error) => {
    console.error("No se pudo guardar la tarea:", error);
  });
}

function crearTarea(tarea) {
  const elementoTarea = document.createElement("div");
  elementoTarea.classList.add("tarea");

  const tituloTarea = document.createElement("h3");
  tituloTarea.classList.add("tarea__titulo");      
  tituloTarea.textContent = tarea.titulo;

  const contenidoTarea = document.createElement("textarea");
  contenidoTarea.classList.add("tarea__contenido");
  contenidoTarea.value = tarea.texto;
  contenidoTarea.addEventListener("click", () => mostrarModalEdicion(tarea));

  const botonCompletar = document.createElement("button");
  botonCompletar.type = "button";
  botonCompletar.classList.add("tarea__boton-completar");
  botonCompletar.innerHTML = '<span class="material-symbols-outlined">check_box</span>';

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.classList.add("tarea__boton-eliminar");
  botonEliminar.innerHTML = '<span class="material-symbols-outlined">delete</span>';
  botonEliminar.addEventListener("click", () => eliminarTarea(tarea, elementoTarea));

  elementoTarea.append(tituloTarea, botonCompletar, contenidoTarea, botonEliminar);
  listaTareas.appendChild(elementoTarea);

  tarea.elementoContenido = contenidoTarea;
}
async function cargarTareas() {
    try {
        const respuesta = await fetch("/tareas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las tareas");
        }

        const tareasGuardadas = await respuesta.json();

        tareasGuardadas.forEach((tareaBD) => {
            const tarea = {
                id: tareaBD.id,
                texto: tareaBD.texto,
                titulo: tareaBD.titulo
            };

            tareas.push(tarea);
            crearTarea(tarea);
        });

    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}

function mostrarModalEdicion(tarea) {
  tareaSeleccionada = tarea;
  entradaEditarTarea.value = tarea.texto;
  fondoModal.classList.remove("esta-oculto");
  modalEditarTarea.classList.remove("esta-oculto");
}

function guardarEdicionTarea() {
  if (!tareaSeleccionada) {
    return;
  }

  const tarea = tareaSeleccionada
  tarea.texto = entradaEditarTarea.value
  tarea.elementoContenido.value = tarea.texto;


  fetch("/actualizar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
      texto: tarea.texto,
      id: tarea.id
    }),
  }).catch((error) => {
    console.error("No se pudo actualizar la tarea:", error);
  });
    ocultarModalEdicion()
}

function eliminarTarea(tarea, elementoTarea) {
  const indice = tareas.indexOf(tarea);

  if (indice !== -1) {
    tareas.splice(indice, 1);
  }

  elementoTarea.remove();

  fetch("/eliminar", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: tarea.titulo,
      texto: tarea.texto,
      id: tarea.id
    }),
  }).catch((error) => {
    console.error("No se pudo borrar la tarea:", error);
  });
}

function ocultarModalEdicion() {
  fondoModal.classList.add("esta-oculto");
  modalEditarTarea.classList.add("esta-oculto");
  tareaSeleccionada = null;
}

function ocultarModalTitulo() {
  fondoModal.classList.add("esta-oculto");
  modalTituloTarea.classList.add("esta-oculto");
  tareaSeleccionada = null;
}

function irAIniciarSesion(evento) {
  evento.preventDefault();
  window.location.assign("/login");
}
/*gatil s*/
botonAgregarTarea.addEventListener("click", agregarTarea);
botonGuardarTitulo.addEventListener("click", guardarTituloTarea);
botonGuardarEdicion.addEventListener("click", guardarEdicionTarea);
botonCancelarEdicion.addEventListener("click", ocultarModalEdicion);
botonCancelarTitulo.addEventListener("click", ocultarModalTitulo);
botonIniciarSesion.addEventListener("click", irAIniciarSesion);
cargarTareas();