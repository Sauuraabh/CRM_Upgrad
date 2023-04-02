const jwt = require(`jsonwebtoken`);
const config = require(`../configs/auth.config`);
const User = require(`../models/user.model`);

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

isAdmin = async (req, res, next) => {
    const user = await User.findOne({
        userId: req.userId
    })
    
    if(user && user.userType == "ADMIN") {
        next();    
    } else {
        return res.status(403).send({
            message: "Require admin role to access this feature"
        })
    }
}

const authCheck = {
    verifyToken: verifyToken,
    verifyToken: isAdmin
}

module.exports = authCheck;