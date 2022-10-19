require("dotenv").config();
const jwt = require('jsonwebtoken');
const verifToken = (req, res, next) => {
    try {
        const authorizationHeader = req.get('Authorization');
        if(!authorizationHeader) {
            throw new Error('Authorization header is missing');
        }

        const [type , token] = authorizationHeader.split(' ');
        if(type !== 'Bearer') {
            throw new Error('Authorization header is not a Bearer token');
        }

        req.payload = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }
}


module.exports = verifToken;