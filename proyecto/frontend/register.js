const register_container = document.querySelector(".register-container")
const register_name = document.querySelector(".register-name")
const register_surname = document.querySelector(".register-surname")
const register_birthdate = document.querySelector("#register-birthdate")
const register_gender = document.querySelector("#register-gender")
const register_email = document.querySelector(".register-email")
const register_password = document.querySelector(".register-password")
const register_password_confirm = document.querySelector(".register-password-confirm")
const register_button = document.querySelector(".register-button")
const register_error = document.querySelector(".register-error")
const register_error_edad = document.querySelector(".register-error-edad")
const register_error_email = document.querySelector(".register-error-email")
const register_error_contraseña = document.querySelector(".register-error-contraseña")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


register_button.addEventListener("click" ,(e) => {
    e.preventDefault();
    register_error.textContent = ""
    register_error_contraseña.textContent = ""
    register_error_email.textContent = ""
    register_error_edad.textContent = ""
    if (
        register_name.value.trim() === "" ||
        register_surname.value.trim() === "" ||
        register_gender.value.trim() === "" ||
        register_birthdate.value.trim() === "" ||
        register_email.value.trim() === "" ||
        register_password.value.trim() === ""||
        register_password_confirm.value.trim() === ""
        
    ) {
        register_error.textContent = "campos vacios"
        return;
    }



    const birthDate = new Date(register_birthdate.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {age--;}

    if (age < 12) {
    register_error_edad.textContent = "*eres demasiado joven*";
        return;
    }else if (age > 99) {
        register_error_edad.textContent = "*eres demasiado mayor*";
        return;
    }



    if (register_password.value !== register_password_confirm.value) {
        register_error_contraseña.textContent = "*Las contraseñas no coinciden*";
        return;
    }

    if (!emailRegex.test(register_email.value)) {
        register_error_email.textContent = "*Correo inválido*";
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: register_name.value,
            surname: register_surname.value,
            birthdate: register_birthdate.value,
            gender: register_gender.value,
            email: register_email.value,
            password: register_password.value,
            password_confirm: register_password_confirm.value
        })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "*Este correo ya está registrado*") {
            register_error_email.textContent = data
        }else if(data === "Usuario creado correctamente"){
            register_error.style.color = "green"
            register_error.textContent = data
        }register_error.textContent = data
    })
    .catch(error => {
        console.error(error);
        register_error.textContent = "Error al conectar con el servidor";
    });
});