const ticketController = require(`../controllers/ticket.controller`);
const authMiddleware = require(`../middlewares/auth`);
const verifyRequestMiddleware = require('../middlewares/verifyTicketRequestBody');
const commentController = require(`../controllers/comment.controller`);

module.exports = function (app) {
    app.post("/crm/api/v1/ticket", [authMiddleware.verifyToken, verifyRequestMiddleware.validateTicketReq], ticketController.createTicket);

    app.put("/crm/api/v1/ticket/:id", [authMiddleware.verifyToken, verifyRequestMiddleware.validateTicketReq], ticketController.updateTicket);

    app.get("/crm/api/v1/tickets", authMiddleware.verifyToken, ticketController.getAllTickets);

    app.post(`/crm/api/v1/tickets/:ticketId/comments`, [authMiddleware.verifyToken], commentController.createComment);

    app.get(`/crm/api/v1/tickets/:ticketId/comments`, [authMiddleware.verifyToken], commentController.fetchComments);
} 