const Ticket = require(`../models/ticket.model`);
const objectConverter = require(`../utils/objectConverter`);

exports.createTicket = async (req, res) => {
    const ticketObj = {
        title : req.body.title,
        description : req.body.description,
        ticketPriority : req.body.ticketPriority,
        status : req.body.status,
        reporter: req.userId
    }

    try {
        const ticket = await Ticket.create(ticketObj);
        res.status(200).send(objectConverter.ticketResponse(ticket));
    } catch(err) {
        console.log(`Error while ticket creation`, err)
        res.send(500).send({
            message : `Internal server error.`
        })
    }
}