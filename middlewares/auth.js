const jwt = require(`jsonwebtoken`);
const config = require(`../configs/auth.config`);

verifyToken = (req, res, next) => {
    let token = req.headers['x-token-access'];

    if(!token) {
        return res.status(403).send({
            message: "No token provided."
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: "Unauthorised"
            })
        }
        req.userId = decoded.id;
        next();
    })
}

const authCheck = {
    verifyToken: verifyToken
}

module.exports = authCheck;