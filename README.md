# Authentication with NodeJS and JWT

## Download the project on github repository and runs

`npm install`

> **Note**: If you prefer you can install them manually as below

`npm install express`

`npm install bcrypt`

`npm install jsonwebtoken`

## Create directory middlewares and then auth.js file

```javascript
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = {
  isLogged: async function (req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(400).json({
        message: "Token not provided! A",
      });
    }

    const [, token] = authToken.split(" ");

    if (!token) {
      return res.status(400).json({
        message: "Token not provided! B",
      });
    }

    try {
      const decode = await promisify(jwt.verify)(
        token,
        "AB123CDE456EFG7890HIJK0987PQRSTU"
      );
      req.userId = decode.id;
      req.email = decode.email;

      // resume the middleware execution!
      return next();
    } catch (error) {
      return res.status(400).json({
        message: "Invalid Token provided! " + error,
      });
    }
  },
};
```

## Create app.js file on empty directory project

```javascript
const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { isLogged } = require("./middlewares/auth");

const SECRETEPRIVATEKEY = "AB123CDE456EFG7890HIJK0987PQRSTU";
let USERDATABASEPASSWORD =
  "$2b$08$lHkDCSn4kaIAwdn56oeEPOyYKhPc3.niixhmSx8XbRxyCN0MZdMj6";

const app = express();

app.use(express.json());

app.get("/", isLogged, async (req, res) => {
  return res.json({
    message: "Welcome, you are logged in!",
    idUser: req.userId,
    email: req.email,
  });
});

// Cadastro
app.get("/signup", async (req, res) => {
  const pwd = "123456"; // UPDATE THE VARIABLE USERDATABASEPASSWORD
  const pwdHashed = await bcrypt.hash(pwd, 8);

  console.log("password:", pwdHashed);

  res.json({
    message: "signup",
  });
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  // validacao de email, feita no database
  if (req.body.email != "eduardo.diogo@gmail.com") {
    res.status(400).json({
      mensagem: "Usuario ou senha invalidos ! Usuário não existe",
    });
  }

  if (!(await bcrypt.compare(req.body.password, USERDATABASEPASSWORD))) {
    res.status(400).json({
      mensagem: "Usuario ou senha invalidos ! Senha Invalida!",
    });
  }

  const userProfile = {
    id: 1,
    email: req.body.email,
  };

  let token = jwt.sign(userProfile, SECRETEPRIVATEKEY, {
    // expiresIn: 600 // 10 minutes
    //expiresIn: "1d",
    expiresIn: 60, // 1 minute
  });

  res.json({
    message: "login successfully!",
    token: token, // or only "token" depending on newest node version
  });
});

app.listen(8080, () => {
  console.log("Server is running !");
});
```

## Decoding your encoded token string

Go to https://jwt.io/ and paste your token on TOKEN field and notice it will be decoded and you will be able to find out the payload data, something like that:

```json
{
  "id": 1,
  "email": "whateveruser@email.com",
  "iat": 1639736918,
  "exp": 1639736978
}
```

## Test using Insominia or Postman app

Create a POST request called Login it should point to http://localhost:8080/login

Create a GET request called Signup it should point to http://localhost:8080/signup

Finally create another GET request called Login it should point to http://localhost:8080/login and needs to have a JSON body as below:

```json
{
  "email": "whateveruser@email.com",
  "password": "123456"
}
```

## License

MIT

**Free Software**
