const Ticket = require(`../models/ticket.model`);
const User = require(`../models/user.model`)
const objectConverter = require(`../utils/objectConverter`);

exports.createTicket = async (req, res) => {
    const ticketObj = {
        title: req.body.title,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        status: req.body.status,
        reporter: req.userId
    }

    try {
        const engineer = await User.findOne({
            userType: `ENGINEER`,
            userStatus: `APPROVED`
        })
        ticketObj.assignee = engineer.userId;
        const ticket = await Ticket.create(ticketObj);

        if (ticket) {
            const user = await User.findOne({
                userId: req.userId
            });
            user.ticketsCreated.push(ticket._id);
            await user.save();
            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();
        }
        res.status(200).send(objectConverter.ticketResponse(ticket));
    } catch (err) {
        console.log(`Error while ticket creation`, err)
        res.send(500).send({
            message: `Internal server error.`
        })
    }
}