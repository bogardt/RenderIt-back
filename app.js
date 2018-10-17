'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');
const mongoose = require('mongoose');
const UserModel = require("./models/user.model.js");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');
const passport = require('passport');

const passportStrategies = require('./modules/passportStrategies')(passport);
const SERVER_PORT = 4000;
const SOCKET_PORT = 4001;

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

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        console.log('new client : ' + pseudo)
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        console.log('new message : ' + message)
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

/*
 * Listen on wanted port for socket server / express server
 */
server.listen(SOCKET_PORT);
app.listen(SERVER_PORT);
console.log('running on port ' + PORT);
