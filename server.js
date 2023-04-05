const express = require('express');
const app = express();
const serverConfig = require(`./configs/server.config`);
const dbconfig = require(`./configs/db.config`);
const mongoose = require(`mongoose`);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect(dbconfig.DB_URL);
const db = mongoose.connection;

db.once(`open`, () => {
    console.log(`Successfully conected to MongoDb`);
});

db.on(`error`, () => {
    console.log(`Error connecting to MongoDb`);
    process.exit();
});

require(`./routes/auth.route`)(app);
require(`./routes/user.route`)(app);
require(`./routes/ticket.route`)(app);

app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on PORT ${serverConfig.PORT}`)
});