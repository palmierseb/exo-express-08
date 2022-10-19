const argon = require('argon2');

const hashingOptions = {
    type: argon.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
    hashLength: 32,
};

const hashPassword = async (req, res, next) => {
    argon
        .hash(req.body.password, hashingOptions)
        .then(hash => {
            req.body.password = hash;
            delete req.body.password;
            next();
        })
        .catch(err => {
            res.status(500).send(err.message);
        }
    );

};


module.exports = hashPassword;

