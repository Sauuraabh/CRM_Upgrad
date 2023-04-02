const userController = require(`../controllers/user.controller`);

module.exports = function(app) {
    app.get(`/crm/api/v1/users`, userController.findAll);
}