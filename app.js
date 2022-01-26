const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { isLogged } = require('./middlewares/auth');

const SECRETEPRIVATEKEY = "AB123CDE456EFG7890HIJK0987PQRSTU";
let USERDATABASEPASSWORD = "$2b$08$lHkDCSn4kaIAwdn56oeEPOyYKhPc3.niixhmSx8XbRxyCN0MZdMj6";

const app = express();

app.use(express.json());

// Home
app.get("/", isLogged, async (req, res) => {
    return res.json({
        message: "Welcome, you are logged in!",
        idUser: req.userId,
        email: req.email
    })
})

// Cadastro
app.get("/signup", async (req, res) => {

    const pwd = "123456"; // UPDATE THE VARIABLE USERDATABASEPASSWORD
    const pwdHashed = await bcrypt.hash(pwd, 8);

    console.log("password:", pwdHashed)

    res.status(202).json({
        message: "signup successfully!"
    })
})

// Login
app.post("/signin", async (req, res) => {

    console.log(req.body);

    // validacao de email, feita no database
    if(req.body.email != "eduardo.diogo@gmail.com") {
        res.status(400).json({
            mensagem: "Usuario ou senha invalidos ! Usuário não existe"
        })
    }

    if(!(await bcrypt.compare(req.body.password, USERDATABASEPASSWORD))){
        res.status(400).json({
            mensagem: "Usuario ou senha invalidos ! Senha Invalida!"
        })
    }

    const userProfile = {
        id: 1, 
        email: req.body.email
    }    

    let token = jwt.sign(userProfile, SECRETEPRIVATEKEY, {
        // expiresIn: 600 // 10 minutes
        //expiresIn: "1d",
        expiresIn: 60, // 1 minute
    })

    res.status(202).json({
        message: "login successfully!",
        token: token // or only "token" depending on newest node version
    })

})

app.listen(8080, () => {
    console.log("Server is running !");
});