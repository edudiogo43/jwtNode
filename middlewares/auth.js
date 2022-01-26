const jwt = require("jsonwebtoken");
const { promisify } = require('util');

module.exports = {
    isLogged: async function (req, res, next) {
        
        const authToken = req.headers.authorization;

        if(!authToken) {
            return res.status(400).json({
                message: "You are not logged in! Token not provided! A"
            })
        }

        const [, token] = authToken.split(" ");

        if(!token) {
            return res.status(400).json({
                message: "You are not logged in! Token not provided! B"
            })
        }

        try {
            
            const decode = await promisify(jwt.verify)(token, "AB123CDE456EFG7890HIJK0987PQRSTU");
            req.userId = decode.id;
            req.email = decode.email;

            // resume the middleware execution!
            return next();

        } catch (error) {
            return res.status(400).json({
                message: "Invalid Token provided! " + error
            })
        }

    }
}