require('dotenv').config();
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { log } = require("console");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nodemailer = require("nodemailer");
const session = require("express-session");



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
db.connect((err) => {
    if (err) {
        console.error("Error al conectar con MySQL:", err);
        return;
    }

    console.log("Conectado a MySQL");
});



setInterval(() => {
    const sql = "DELETE FROM pending_users WHERE expires_at < NOW()";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error eliminando usuarios expirados:", err);
            return;
        }

        if (results.affectedRows > 0) {
            console.log(`Se eliminaron ${results.affectedRows} usuarios expirados`);
        }
    });
}, 60 * 1000);

const app = express();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "../frontend")));




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});
app.get("/codigo", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/codigo.html"));
});

app.get("/tareas", (req, res) => {
    const sql = "SELECT * FROM tarea WHERE user_id = ?";
    const user_id = req.session.userId
    
    
    db.query(sql,[user_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener las tareas");
        }
        
        res.json(results);
    });
});

app.delete("/eliminar", (req, res) => {
    console.log("DELETE recibido");
    console.log(req.body.id);
    
    const sql = "DELETE FROM tarea WHERE id = ?"
    db.query(sql,req.body.id,(err,results) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("error en la base de datos");

        }
        
        console.log("exito");
        
        return res.send("tarea borrada")
    })
});


app.patch("/actualizar",(req,res) =>{

    
    const sql = `UPDATE tarea
                SET texto = ?
                WHERE id = ?`

    db.query(sql,[req.body.texto,req.body.id],(err,results) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("error en la base de datos");
            
        }
        console.log("extito");
        
    })
})

app.post("/login", (req, res) => {
    if (req.body.email.trim() === "" || 
        req.body.password.trim() === "") {
        return res.status(400).send("Campos vacíos");
    }
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
            req.session.userId = user.id;

            console.log("Usuario conectado:", req.session.userId);

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
        const codigo = Math.floor(100000 + Math.random() * 900000);
        const expires_at = new Date(Date.now() + 5 * 60 * 1000);
        const mailOptions = {
        from: "registropagina8@gmail.com",
        to: req.body.email,
        subject: "Código de confirmación",
        text: ` Hola no compartas el siguiente codigo Tu código de confirmación es: ${codigo}`
        };
        
        const sql = `
            INSERT INTO pending_users
            (name, surname, birthdate, gender, email, password,code,expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.name,
            req.body.surname,
            req.body.birthdate,
            req.body.gender,
            req.body.email,
            hashedPassword,
            codigo,
            expires_at
        ];

        db.query(sql, values, (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Error al crear usuario");
            }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Error al enviar el correo");
            }
            console.log("Correo enviado");
            res.send("exito al registrarse")
            });
        });
    });
});

app.post("/codigo",(req,res) =>{
    
    const checkcodigo = "SELECT * FROM pending_users WHERE code = ? AND expires_at > NOW()";
    db.query(checkcodigo,[req.body.codigo],(err,results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al comprobar el correo");
        }
        if (results.length === 0) {
            console.log(results);
            
            return res.send("codigo incorrecto")
        }
        const user = results[0];
        const sql = `
            INSERT INTO users
            (name, surname, birthdate, gender, email, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user.name,
            user.surname,
            user.birthdate,
            user.gender,
            user.email,
            user.password        
        ];
        db.query(sql, values, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al comprobar el correo");
            }
            const deleteSql = "DELETE FROM pending_users WHERE id = ?";

            db.query(deleteSql, [user.id], (err) => {
                if (err) {
                console.error(err);
                return res.status(500).send("Cuenta creada, pero hubo un error al limpiar los datos");
            }

        res.send("Cuenta creada con éxito");
});
        })
    })
})
app.post("/tareas", (req, res) => {

    const { titulo, texto } = req.body;

    const userId = req.session.userId;

    const sql = `
        INSERT INTO tarea ( titulo, texto,user_id)
        VALUES (?, ?, ?)
    `;

    const values = [
        titulo,
        texto,
        userId
    ];

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error al guardar la tarea");
        }

        res.send("Tarea guardada correctamente");

    });

});

app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});
