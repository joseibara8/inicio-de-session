const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { log } = require("console");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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






app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});


app.post("/login", (req, res) => {

    console.log("LLEGÓ UNA PETICIÓN A /LOGIN");
    console.log(req.body);

    

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [req.body.email], async (err, results) => {
        console.log(results);
        
        if (err) {
            return res.status(500).send("error en la base de datos");
        }
        
        if (results.length === 0) {
            return res.status(400).send("El correo no existe");
        }
        
        const user = results[0];

        const passwordCorrecta = await bcrypt.compare(
            req.body.password,
            user.password
        );

        console.log(passwordCorrecta);
        if (passwordCorrecta) {
        return res.send("exito");
}

        return res.status(400).send("La Contraseña es Incorrecta");
    });
});


app.post("/register", (req, res) => {

    if (
        req.body.name.trim() === "" ||
        req.body.surname.trim() === "" ||
        req.body.gender.trim() === "" ||
        req.body.birthdate.trim() === "" ||
        req.body.email.trim() === "" ||
        req.body.password.trim() === "" ||
        req.body.password_confirm.trim() === ""
    ) {
        return res.status(400).send("Campos vacíos");
    }


    const birthDate = new Date(req.body.birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 12) {
        return res.status(400).send("*eres demasiado joven*");
        

    } else if (age > 99) {
        return res.status(400).send("*eres demasiado mayor*");
        
    }


    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send("*Las contraseñas no coinciden*");
        
    }


    if (!emailRegex.test(req.body.email)) {
        return res.status(400).send("*Correo inválido*");
        
    }

    const checkEmailSql = "SELECT id FROM users WHERE email = ?";

    db.query(checkEmailSql, [req.body.email], async (err, results) => {

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