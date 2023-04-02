const User = require('../models/user.model');
const objectConverter = require(`../utils/objectConverter`)
/**
 * Fetch list of all users [later we will modify as per requirements]
 */

exports.findAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(objectConverter.userResponse(users));
    }catch(err) {
        console.log(`Error fetching up all users ${err}`);
        res.status(500).send({
            message: "Internal server error"
        });
    }
};