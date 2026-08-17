const express = require("express")

const app = express()

app.get('/', (req, res) => {
    res.send('Hola, esta es la página principal');
});

app.listen(3000, () => {
    console.log("Servidor funcionando");
});