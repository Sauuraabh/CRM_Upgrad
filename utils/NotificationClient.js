const Client = require(`node-rest-client`).Client;

var client = new Client();

module.exports = (ticketId, subject, content, emailIds, requester) => {
    const reqBody = {
        subject: subject,
        ticketId: ticketId,
        content: content,
        requester: requester,
        recipientEmails: emailIds
    };

    var args = {
        data: reqBody,
        headers: {"Content-Type": "application/json"}
    };

    client.post(`http://localhost:5400/notificationservice/api/v1/notification`, args, (data, response) => {
        console.log(`Notification request sent`);
        console.log(data.toString());
    });
};