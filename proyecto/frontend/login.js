console.log("LOGIN.JS FUNCIONA");
const login_container = document.querySelector(".login-container");
const login_email = document.querySelector(".login-email");
const login_password = document.querySelector(".login-password");
const login_button = document.querySelector(".login-button");
const login_button_error = document.querySelector(".login-button-error");


login_button.addEventListener("click", (e) => {

    e.preventDefault();

    if (
        login_email.value.trim() === "" ||
        login_password.value.trim() === ""
    ) {
        login_button_error.textContent = "Campos vacíos";
        return;
    }


    fetch("/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: login_email.value,
            password: login_password.value
        })
    })

    .then(response => response.text())

    .then(data => {
        login_button_error.textContent = data;
    })

    .catch(error => {
        console.error(error);
        login_button_error.textContent = "Error al conectar con el servidor";
    });

});