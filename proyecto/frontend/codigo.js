const codigo_button = document.querySelector(".codigo-button");
const codigo_error = document.querySelector(".codigo-error");

const codigo = [
    document.querySelector("#codigo1"),
    document.querySelector("#codigo2"),
    document.querySelector("#codigo3"),
    document.querySelector("#codigo4"),
    document.querySelector("#codigo5"),
    document.querySelector("#codigo6")
];

codigo.forEach((div, index) => {

    div.addEventListener("paste", (e) => {

        e.preventDefault();

        const texto = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6 - index);

        texto.split("").forEach((numero, i) => {

            if (codigo[index + i]) {
                codigo[index + i].textContent = numero;
            }

        });

        if (texto.length > 0) {

            const posicionFinal = Math.min(
                index + texto.length,
                codigo.length - 1
            );

            codigo[posicionFinal].focus();

            const rango = document.createRange();
            const seleccion = window.getSelection();

            rango.selectNodeContents(codigo[posicionFinal]);
            rango.collapse(false);

            seleccion.removeAllRanges();
            seleccion.addRange(rango);
        }

    });

    div.addEventListener("input", () => {

        div.textContent = div.textContent.replace(/\D/g, "");

        if (div.textContent.length > 1) {
            div.textContent = div.textContent[0];
        }

        if (
            div.textContent !== "" &&
            index < codigo.length - 1
        ) {
            codigo[index + 1].focus();
        }

    });

    div.addEventListener("keydown", (e) => {

        if (
            e.key === "Backspace" &&
            div.textContent === "" &&
            index > 0
        ) {

            const div_anterior = codigo[index - 1];

            div_anterior.focus();

            const rango = document.createRange();
            const seleccion = window.getSelection();

            rango.selectNodeContents(div_anterior);
            rango.collapse(false);

            seleccion.removeAllRanges();
            seleccion.addRange(rango);
        }

        if (
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "v"
        ) {
            return;
        }

        if (
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "c"
        ) {
            return;
        }

        if (
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "a"
        ) {
            return;
        }

        if (
            !/^\d$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "Tab"
        ) {
            e.preventDefault();
        }

    });

});

codigo_button.addEventListener("click", (e) => {

    e.preventDefault();

    const codigo_texto = codigo
        .map(div => div.textContent)
        .join("");

    if (codigo_texto.length !== 6) {
        codigo_error.textContent = "Introduce el código completo";
        return;
    }

    fetch("/codigo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            codigo: codigo_texto
        })
    })

    .then(response => response.text())

    .then(data => {

        if (data === "Cuenta creada con éxito") {

            codigo_error.style.color = "green";
            codigo_error.textContent = data;

            window.location.assign("/login");

            return;
        }

        codigo_error.textContent = data;

    })

    .catch(error => {

        console.error("Error:", error);

        codigo_error.textContent =
            "Error de conexión con el servidor";

    });

});