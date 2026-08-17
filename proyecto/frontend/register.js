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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


register_button.addEventListener("click" ,(e) => {
    e.preventDefault();

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
    if (register_password.value !== register_password_confirm.value) {
        register_error.textContent = "Las contraseñas no coinciden";
        return;
    }

    if (!emailRegex.test(register_email.value)) {
        register_error.textContent = "Correo inválido";
        return;
    }

    register_error.textContent = "todo correcto"
    
    
})