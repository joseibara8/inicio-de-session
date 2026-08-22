const codigo_texarea = document.querySelector(".codigo-texarea")
const codigo_button = document.querySelector(".codigo-button")
const codigo_error = document.querySelector(".codigo-error")


codigo_button.addEventListener("click",(e) =>{
    e.preventDefault()

    if(codigo_texarea.value.trim() === ""){
        codigo_error.textContent = "campos vacios"
    }
    
    fetch("/codigo",{
        method: "post",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            codigo: codigo_texarea.value
        })
    })
    .then(response => response.text())
    .then(data =>{
        if(data === "Cuenta creada con éxito"){
            codigo_error.style.color = "green"
            codigo_error = data
            window.location.assign('/login')
        }
        codigo_error.textContent = data
    })
})