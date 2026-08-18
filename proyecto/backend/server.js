const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.post("/", (req, res) => {
    console.log(req.body);

    res.send("Usuario recibido");
});


app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

app.post("/register", (req, res) => {
    console.log(req.body);

    res.send("Usuario recibido");
});

app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});