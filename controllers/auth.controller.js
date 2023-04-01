const User = require(`../models/user.model`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const secretConfig = require(`../configs/auth.config`)
/**
 * Signup API
 */

exports.signup = async (req, res) => {

    var userTypeReq = req.body.userType;
    var userStatusReq = "APPROVED";
    if (userTypeReq === "ENGINEER") {
        userStatusReq = "PENDING";
    }

    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        userType: userTypeReq,
        userStatus: userStatusReq
    }

    try {
        const user = await User.create(userObj);
        res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus
        });
    } catch (err) {
        console.log(`Error creating user.`, err.message);
        res.status(500).send({
            message: `Internal server error.`
        })
    }
}

exports.signin = async (req, res) => {
    
    const user = await User.findOne({ userId : req.body.userId });

    if(user == null) {
        return res.status(400).send({
            message : "UserId dosen't exist."
        });
    }
    if(user.userStatus !== "APPROVED") {
        return res.status(200).send({
            message : `Con't login with status as ${user.userStatus}`
        });
    }
    if(!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(200).send({
            message : `Invalid password`
        });
    }

    /**
     * JWT - CREATE TOKEN
     */

    var token = jwt.sign({id : user.userId}, secretConfig.secret, {expiresIn : 5000})
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        accessToken : token
    });
}