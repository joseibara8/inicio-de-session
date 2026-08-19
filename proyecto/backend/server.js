const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "holapas",
    database: "registro_app"
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar con MySQL:", err);
        return;
    }

    console.log("Conectado a MySQL");
});
db.query("SELECT * FROM users", (err, results) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(results);
});
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});


app.post("/", (req, res) => {
    console.log(req.body);

    res.send("Usuario recibido");
});


app.post("/register", async (req, res) => {

    const checkEmailSql = "SELECT id FROM users WHERE email = ?";

    db.query(checkEmailSql, [req.body.email], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error al comprobar el correo");
        }

        if (results.length > 0) {
            return res.status(400).send("Este correo ya está registrado");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const sql = `
            INSERT INTO users
            (name, surname, birthdate, gender, email, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.name,
            req.body.surname,
            req.body.birthdate,
            req.body.gender,
            req.body.email,
            hashedPassword
        ];

        db.query(sql, values, (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Error al crear usuario");
            }

            res.send("Usuario creado correctamente");
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});