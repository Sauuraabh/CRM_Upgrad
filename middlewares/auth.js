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
        });
    }
}

checkUserType = async (req, res, next) => {
    const loggedUser = await User.findOne({
        userId: req.userId
    })
    
    const userToUpdate = await User.findOne({
        userId: req.params.id
    })
    
    if(loggedUser && loggedUser.userType == "ADMIN") {
        next();    
    } else if(loggedUser.userType == "ENGINEER" || loggedUser.userType == "HOMEMAKER") {
        console.log(req.userId, "   ", loggedUser.userId)
        if(loggedUser.userId == userToUpdate.userId) {
            next();
        } else {
            return res.status(403).send({
                message: "You are not the owner"
            });
        }
    } else {
        return res.status(403).send({
            message: "Require admin role to access this feature"
        });
    }
}

const authCheck = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    checkUserType: checkUserType
}

module.exports = authCheck;