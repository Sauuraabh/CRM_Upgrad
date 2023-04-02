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