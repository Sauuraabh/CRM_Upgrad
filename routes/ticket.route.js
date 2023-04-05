const ticketController = require(`../controllers/ticket.controller`)
const authMiddleware = require(`../middlewares/auth`);
const verifyRequestMiddleware = require('../middlewares/verifyTicketRequestBody')

module.exports = function (app) {
    app.post("/crm/api/v1/ticket",[authMiddleware.verifyToken, verifyRequestMiddleware.validateTicketReq], ticketController.createTicket);
} 