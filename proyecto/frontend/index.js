const contenedor = document.querySelector(".contenedor__de_listas");
const oculto = document.querySelector("#fondo");
const enviar = document.querySelector(".enviar");
const agregar = document.querySelector(".agregar");
const modal = document.querySelector("#modal");
const textarea_modal = document.querySelector("#textarea-modal");
const guardar = document.querySelector("#guardar");
const cancelar = document.querySelector("#cancelar");
const iniciar_session = document.querySelector(".button-iniciar-session")
let notaSeleccionada;
let ListaDenotas = [];
let indiceSeleccionado;

// Cargar notas guardadas
const notasGuardadas = localStorage.getItem("notas");

if (notasGuardadas) {
  ListaDenotas = JSON.parse(notasGuardadas);

  ListaDenotas.forEach((nota) => {
    crear_nota(nota.texto);
  });
}

iniciar_session.addEventListener("click", (e) => {
    e.preventDefault()
    window.location.assign('/login')
})

// Crear nota en pantalla
function crear_nota(texto) {
  const contenedor_listasj = document.createElement("div");
  contenedor_listasj.classList.add("listas");

  const nueva_lista = document.createElement("textarea");
  nueva_lista.classList.add("agregarT");
  nueva_lista.value = texto;

  nueva_lista.addEventListener("click", () => {
    notaSeleccionada = nueva_lista;

    indiceSeleccionado = ListaDenotas.findIndex(
      (nota) => nota.texto === nueva_lista.value,
    );

    oculto.classList.remove("oculto");
    textarea_modal.value = nueva_lista.value;
    modal.classList.remove("oculto");
  });

  const eliminar = document.createElement("button");
  eliminar.type = "button";
  eliminar.classList.add("eliminar");

  const icono = document.createElement("span");
  icono.classList.add("material-symbols-outlined");
  icono.textContent = "delete";

  eliminar.appendChild(icono);

  eliminar.addEventListener("click", () => {
    const indice = ListaDenotas.findIndex(
      (nota) => nota.texto === nueva_lista.value,
    );

    ListaDenotas.splice(indice, 1);

    localStorage.setItem("notas", JSON.stringify(ListaDenotas));

    contenedor_listasj.remove();
  });

  const check = document.createElement("button");
  check.type = "button";
  check.classList.add("check");

  const icono_check = document.createElement("span");
  icono_check.classList.add("material-symbols-outlined");
  icono_check.textContent = "check_box";

  check.appendChild(icono_check);

  contenedor_listasj.appendChild(check);
  contenedor_listasj.appendChild(nueva_lista);
  contenedor_listasj.appendChild(eliminar);

  contenedor.appendChild(contenedor_listasj);
}

// Agregar nota nueva
enviar.addEventListener("click", (e) => {
  e.preventDefault();

  if (agregar.value === "") {
    console.log("error");
    return;
  }

  ListaDenotas.push({
    texto: agregar.value,
  });

  localStorage.setItem("notas", JSON.stringify(ListaDenotas));

  crear_nota(agregar.value);

  agregar.value = "";
});

// Guardar edición
guardar.addEventListener("click", () => {
  notaSeleccionada.value = textarea_modal.value;

  ListaDenotas[indiceSeleccionado].texto = textarea_modal.value;

  localStorage.setItem("notas", JSON.stringify(ListaDenotas));

  oculto.classList.add("oculto");
  modal.classList.add("oculto");
});

// Cancelar edición
cancelar.addEventListener("click", () => {
  oculto.classList.add("oculto");
  modal.classList.add("oculto");
});
