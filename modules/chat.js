import ent from 'ent';

/**
 * Chat
 * @param {*} io
 */
module.exports = {
  start(io) {


    io.on('connection', socket => {
      socket.on('message', message => {
        // logger.log('info', message.value);
        // socket.emit('ditConsumer', message.value);
        console.log('from console', message.value);
      });


    });


    
  }
};
