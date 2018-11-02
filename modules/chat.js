import User from '../models/users';
import Room from '../models/room';
import Message from '../models/message';

async function HandleAuthorization(id, socket) {
  const user = await User.findOne({ email: id });
  if (user) {
    user.socket = socket.id;
    await user.save();
    socket.emit('success', 'User successfully authorized');
    return;
  }
  socket.emit('error', 'User does not exist');
}

async function HandleJoinRoom(room, id, socket) {
  // if (!id) -> create room
  // if (id) -> join existing room
  const roomObj = Room.findOne({ name: room });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('error', 'User not authorized');
  } else if (!roomObj) {
    const newRoom = new Room();
    newRoom.name = room;
    newRoom.users.push(user.email);
    newRoom.history = [];
    await newRoom.save();

    user.rooms.push(newRoom);
    await user.save();
    socket.join(room);
    socket.emit('join-room', newRoom);
  } else {
    roomObj.users.push(user.email);
    user.rooms.push(roomObj);
    await roomObj.save();
    await user.save();
    socket.emit('join-room', roomObj);
  }
}

async function HandleMessage(message, room, socket) {
  // TODO: use room id
  const roomObj = Room.findOne({ name: room });
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

async function HandleLeaveRoom(room, id, socket) {
  // TODO: use room id
  const roomObj = Room.findOne({ name: room });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('leave-room', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('leave-room', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.email);
    // TODO: use room id
    const userIndex = user.rooms.findIndex(index => index.name === roomObj.name);

    if (roomIndex === -1) {
      socket.emit('leave-room', 'User not in room');
    } else if (userIndex === -1) {
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

async function Handletyping(socket, room) {
  // TODO: use room id
  const roomObj = Room.findOne({ name: room });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('typing', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('typing', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.email);
    // TODO: use room id
    const userIndex = user.rooms.findIndex(index => index.name === roomObj.name);

    if (roomIndex === -1) {
      socket.emit('typing', 'User not in room');
    } else if (userIndex === -1) {
      socket.emit('typing', 'User not in room');
    } else {
      socket.in(room).emit('typing', room);
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
      socket.on('leave-room', (room, id) => {
        HandleLeaveRoom(socket, room, id);
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
