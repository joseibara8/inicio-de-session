
const login_container = document.querySelector(".login-container");
const login_email = document.querySelector(".login-email");
const login_password = document.querySelector(".login-password");
const login_button = document.querySelector(".login-button");
const login_button_error = document.querySelector(".login-button-error");
const login_email_error = document.querySelector(".login-email-error");
const login_contraseña_error = document.querySelector(".login-contraseña-error");
const login_ojo = document.querySelector(".ojo");


login_button.addEventListener("click", (e) => {

    e.preventDefault();
    login_email_error.textContent = ""
    login_contraseña_error.textContent = ""
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
        if(data === "El correo no existe"){
            login_email_error.textContent = "El correo no existe"
        }else if (data === "La Contraseña es Incorrecta"){
            login_contraseña_error.textContent = "La Contraseña es Incorrecta"
        }else
        window.location.assign("/")
    })
    .catch(error => {
        console.error(error);
        login_button_error.textContent = "Error al conectar con el servidor";
    });
});

login_ojo.addEventListener("click", (e) => {
    e.preventDefault()
    if (login_password.type === "password") {
        login_password.type = "text";
        this.querySelector(".material-symbols-outlined").textContent = "visibility";
    } else {
        login_password.type = "password";
        this.querySelector(".material-symbols-outlined").textContent = "visibility_off";
    }
});