import User from '../models/users';
import Room from '../models/room';
import Message from '../models/message';

async function HandleAuthorization(socket, id) {
  const user = await User.findOne({ email: id });
  if (user) {
    if (user.socket) {
      socket.emit('fail', 'User already authorized');
    } else {
      user.socket = socket.id;
      await user.save();
      // TODO : join all connected rooms
      socket.emit('success', 'User successfully authorized');
    }
  } else {
    socket.emit('fail', 'User does not exist');
  }
}

async function HandleJoinRoom(socket, roomId) {
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else {
    const roomObj = Room.findOne({ id: roomId });
    if (!roomObj) {
      socket.emit('fail', 'Room does not exist');
    } else {
      roomObj.users.push(user.id);
      user.rooms.push(roomObj);
      await roomObj.save();
      await user.save();

      socket.join(roomId);
      socket.emit('join-room', roomObj);
    }
  }
}

async function HandleAddFriend(io, socket, userId, roomId) {
  const user = User.findOne({ socket: socket.id });
  const friend = User.findOne({ id: userId });
  const friendSocket = io.sockets.connected[friend.socket];
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else if (!friend) {
    socket.emit('fail', 'User does not exist');
  } else {
    const roomObj = Room.findOne({ id: roomId });
    if (!roomObj) {
      socket.emit('fail', 'Room does not exist');
    } else {
      roomObj.users.push(friend.id);
      friend.rooms.push(roomObj);
      await roomObj.save();
      await friend.save();

      if (friendSocket) {
        friendSocket.join(roomId);
      }

      socket.emit('add-friend', roomObj);
    }
  }
}

async function HandleCreateRoom(socket, name) {
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else {
    const newRoom = new Room();
    newRoom.name = name;
    newRoom.users.push(user.id);
    newRoom.history = [];
    await newRoom.save();

    user.rooms.push(newRoom);
    await user.save();

    socket.join(newRoom.id);
    socket.emit('create-room', newRoom);
  }
}

async function HandleMessage(io, socket, message, room) {
  const roomObj = Room.findOne({ id: room });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('fail', 'Room does not exist');
  } else {
    const newMessage = new Message();
    newMessage.from.push(user);
    newMessage.to = room;
    newMessage.message = message;
    newMessage.date = Date.now();

    roomObj.history.push(newMessage);
    roomObj.save();

    io.in(room).emit('stop-typing', roomObj);
    io.in(room).emit('message', roomObj.history);
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

async function Handletyping(io, socket, roomId) {
  const roomObj = Room.findOne({ id: roomId });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('fail', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.id);
    const userIndex = user.rooms.findIndex(element => element.id === roomObj.id);

    if (roomIndex === -1) {
      socket.emit('fail', 'User not in room');
    } else if (!userIndex) {
      socket.emit('fail', 'User not in room');
    } else {
      io.in(roomId).emit('typing', roomObj);
    }
  }
}

async function HandleStoptyping(io, socket, roomId) {
  const roomObj = Room.findOne({ id: roomId });
  const user = User.findOne({ socket: socket.id });
  if (!user) {
    socket.emit('fail', 'User not authorized');
  } else if (!roomObj) {
    socket.emit('fail', 'Room does not exist');
  } else {
    const roomIndex = roomObj.users.indexOf(user.id);
    const userIndex = user.rooms.findIndex(element => element.id === roomObj.id);

    if (roomIndex === -1) {
      socket.emit('fail', 'User not in room');
    } else if (!userIndex) {
      socket.emit('fail', 'User not in room');
    } else {
      io.in(roomId).emit('stop-typing', roomObj);
    }
  }
}

async function HandleDisconnect(socket) {
  const user = User.findOne({ socket: socket.id });
  if (user && user.socket === socket.id) {
    user.socket = null;
    await user.save();
  }
}
/**
 * Chat
 * @param {*} io
 */
module.exports = {
  async start(io) {
    io.on('connection', socket => {
      socket.emit('authorization', 'email requested');
      socket.on('authorization', id => {
        HandleAuthorization(socket, id);
      });
      socket.on('join-room', id => {
        HandleJoinRoom(socket, id);
      });
      socket.on('add-friend', (userId, roomId) => {
        HandleAddFriend(socket, userId, roomId);
      });
      socket.on('create-room', name => {
        HandleCreateRoom(socket, name);
      });
      socket.on('leave-room', id => {
        HandleLeaveRoom(socket, id);
      });
      socket.on('message', (message, room) => {
        HandleMessage(io, socket, message, room);
      });
      socket.on('typing', room => {
        Handletyping(io, socket, room);
      });
      socket.on('stop-typing', room => {
        HandleStoptyping(io, socket, room);
      });
      socket.on('disconnect', () => {
        HandleDisconnect(socket);
      });
    });
  }
};
