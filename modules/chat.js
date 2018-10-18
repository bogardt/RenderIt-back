module.exports = function (io) {
    io.sockets.on('connection', function (socket, pseudo) {
        // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
        socket.on('nouveau_client', function (pseudo) {
            console.log('new client : ' + pseudo)
            pseudo = ent.encode(pseudo);
            socket.pseudo = pseudo;
            socket.broadcast.emit('nouveau_client', pseudo);
        });

        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        socket.on('message', function (message) {
            console.log('new message : ' + message)
            message = ent.encode(message);
            socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        });
    });
};