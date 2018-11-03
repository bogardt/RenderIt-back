import User from '../models/users';
import Room from '../models/room';
import Message from '../models/message';

async function HandleAuthorization(socket, id) {
  const user = await User.findOne({ email: id });
  if (user) {
    if (user.socket) {
      socket.emit('error', 'User already authorized');
      return;
    }
    user.socket = socket.id;
    await user.save();
    socket.emit('success', 'User successfully authorized');
    return;
  }
  socket.emit('error', 'User does not exist');
}

async function HandleJoinRoom(socket, room, roomId) {
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('error', 'User not authorized');
  } else if (!roomId) {
    const newRoom = new Room();
    newRoom.name = room;
    newRoom.users.push(user.id);
    newRoom.history = [];
    await newRoom.save();

    user.rooms.push(newRoom);
    await user.save();

    socket.join(roomId);
    socket.emit('join-room', newRoom);
  } else if (roomId) {
    const roomObj = Room.findOne({ id: roomId });
    roomObj.users.push(user.id);
    user.rooms.push(roomObj);
    await roomObj.save();
    await user.save();

    socket.join(room);
    socket.emit('join-room', roomObj);
  }
}

async function HandleMessage(socket, message, room) {
  const roomObj = Room.findOne({ id: room });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('sentMessage', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('sentMessage', 'Room does not exist');
  } else {
    const newMessage = new Message();
    newMessage.from.push(user);
    newMessage.to = room;
    newMessage.message = message;
    newMessage.date = Date.now();

    roomObj.history.push(newMessage);
    roomObj.save();
    // TODO: send the conversation history / the room / the message ?
    socket.in(room).emit('message', newMessage);
  }
}

async function HandleLeaveRoom(socket, roomId) {
  const roomObj = Room.findOne({ id: roomId });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('leave-room', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('leave-room', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.id);
    const userIndex = user.rooms.findIndex(index => index.id === roomObj.id);

    if (roomIndex === -1) {
      socket.emit('leave-room', 'User not in room');
    } else if (!userIndex) {
      socket.emit('leave-room', 'User not in room');
    } else {
      roomObj.users.splice(roomIndex, 1);
      user.rooms.splice(userIndex, 1);

      await roomObj.save();
      await user.save();
      socket.emit('leave-room', 'Success');
    }
  }
}

async function Handletyping(socket, roomId) {
  const roomObj = Room.findOne({ id: roomId });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('typing', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('typing', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.id);
    const userIndex = user.rooms.findIndex(element => element.id === roomObj.id);

    if (roomIndex === -1) {
      socket.emit('typing', 'User not in room');
    } else if (!userIndex) {
      socket.emit('typing', 'User not in room');
    } else {
      socket.in(roomId).emit('typing', roomObj);
    }
  }
}

/**
 * Chat
 * @param {*} io
 */
module.exports = {
  async start(io) {
    io.on('connection', socket => {
      socket.on('authorization', async id => {
        HandleAuthorization(socket, id);
      });
      socket.on('join-room', (room, id) => {
        HandleJoinRoom(socket, room, id);
      });
      socket.on('leave-room', id => {
        HandleLeaveRoom(socket, id);
      });
      socket.on('message', (message, room) => {
        HandleMessage(socket, message, room);
      });
      socket.on('typing', room => {
        Handletyping(socket, room);
      });
    });
  }
};
