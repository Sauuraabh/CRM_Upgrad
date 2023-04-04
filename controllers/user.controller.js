const User = require('../models/user.model');
const objectConverter = require(`../utils/objectConverter`)
/**
 * Fetch list of all users [later we will modify as per requirements]
 */

exports.findAll = async (req, res) => {
    try {
        let userQuery = {};
        let userTypeReq = req.query.userType;
        let userStatusReq = req.query.userStatus;

        if(userTypeReq) {
            userQuery.userType = userTypeReq;
        }

        if(userStatusReq) {
            userQuery.userStatus = userStatusReq;
        }

        const users = await User.find(userQuery);
        res.status(200).send(objectConverter.userResponse(users));
    }catch(err) {
        console.log(`Error fetching up all users ${err}`);
        res.status(500).send({
            message: "Internal server error"
        });
    }
};

exports.findById = async (req, res) => {
    const reqUserId = req.params.id;
    try {
        const user = await User.findOne({userId: reqUserId});

        if(!user) {
            return res.status(200).send(`User with this is ${reqUserId} is not present`);
        }

        var userResObj = {
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus
        }

        return res.status(200).send(userResObj);
    } catch (err) {
        res.send(500).send ({
            message : "Internal Server Error"
        });
    }
};

exports.update = async (req, res) => {
    const reqUserId = req.params.id;
    try {
        const user = await User.findOne({userId: reqUserId});

        if(!user) {
            return res.status(200).send(`User with this is ${reqUserId} is not present`);
        }

        user.name = req.body.name ? req.body.name : user.name;
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;
        user.userType = req.body.userType ? req.body.userType : user.userType;
        
        const newUser = await user.save();

        var userResObj = {
            name: newUser.name,
            userId: newUser.userId,
            email: newUser.email,
            userType: newUser.userType,
            userStatus: newUser.userStatus
        }

        return res.status(200).send(userResObj);
    } catch (err) {
        res.send(500).send ({
            message : "Internal Server Error"
        });
    }
};