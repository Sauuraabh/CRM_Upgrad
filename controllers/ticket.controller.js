const Ticket = require(`../models/ticket.model`);
const User = require(`../models/user.model`)
const objectConverter = require(`../utils/objectConverter`);
const CONSTANTS = require(`../utils/constants`);
const constants = require("../utils/constants");

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

exports.updateTicket = async (req, res) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
        res.status(400).send({
            message: `Ticket with the ID ${ticketId} is not present.`
        })
    }

    const savedUSer = await User.findOne({ userId: req.userId });

    if (ticket.reporter == req.userId || ticket.assignee == req.userId || savedUSer.userType == CONSTANTS.userType.admin) {
        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

        var updatedTicket = await ticket.save();

        res.status(200).send(objectConverter.ticketResponse(updatedTicket));
    } else {
        res.status(401).send({
            message: `Ticket can only be updated by a CUSTOMER or ENGINEER and an ADMIN`
        })
    }
}

exports.getAllTickets = async (req, res) => {
    const queryObj = {}

    if(req.query.status != undefined) {
        queryObj.status = {$regex: new RegExp(req.query.status), $options: `i`};
    }

    const savedUser = await User.findOne({ userId : req.userId })

    if(savedUser.userType == constants.userType.engineer) {
        queryObj.assignee = req.userId
    } else if(savedUser.userType == constants.userType.customer){
        queryObj.reporter = req.userId
    } else {

    }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(tickets);
}