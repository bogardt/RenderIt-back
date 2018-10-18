'use strict';

const express = require('express');
const app = express();
const ent = require('ent');
const mongoose = require('mongoose');
const UserModel = require("./models/user.model.js");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');
const passport = require('passport');
const passportStrategies = require('./modules/passportStrategies')(passport);
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('./modules/chat.js')(io);

const SERVER_PORT = 4000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 * Allow CORS for GET and POST only
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', "POST, PUT, OPTIONS, DELETE, GET");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});
/*
 * Connection to mangoose
 */
mongoose.connect('mongodb://localhost:27017/data');

/*
* Instanciate passport
*/
app.use(passport.initialize())

/*
 * Instanciate router
 */
app.use('/api', routes);

/*
 * Catch each exception
 */
process.on('uncaughtException', (err) => {
    console.log(err);
});

/*
 * Implement socket for chat-rooms
 */
/// only for testing with index.html
app.use(express.static(__dirname));

/*
 * Http server as a middleware
 */
server.listen(SERVER_PORT);
