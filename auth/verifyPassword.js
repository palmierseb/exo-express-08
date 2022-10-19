const argon = require('argon2');
const jwt = require('jsonwebtoken');

const verifyPassword = (req, res) => {
    argon
    .verify(req.user.password, req.body.password)
    .then((isVerified) => {
        if(isVerified) {
            const payload = { sub: req.user.id };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            res.send({token, user: req.user});
        } else {
            res.status(401).send("Invalid password");
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}


module.exports = verifyPassword;