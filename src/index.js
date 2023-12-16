const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express();
// we need the server for both express and socet so we use general server creation , this is same when express creates a server
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.port || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New websocket connection");


  // this is a new way of emitting events here using join we are emitting events to just that room so only others in that room would actually see them
  /**
   * soscket.emit => sends an event to a specific cleint
   * io.emit => sends an event to every connected client 
   * socket.broadcast.emit => sends an event to every connected client except for this(current ) one
   */

  /**
   * While working with rooms we're going to have 2 new setups we'll be using for emitting messages 
   * io.to.emit => emits an event to everybody in a specific room 
   * socket.broadcast.to.emit => sends an event to everyone except for the specific client but its limiting it to a specific chatroom
   */

  socket.on('join', (options, callback)=>{
    const {error, user} = addUser({id: socket.id, ...options})

    if(error){
      return callback(error)
    }

    socket.join(user.room)

    socket.emit("message", generateMessage('Admin', "Welcome!"));
    socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined!`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()

  })

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane()) {
      return callback("bad words are not allowed");
    }

    const user = getUser(socket.id)

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("shareLocation", (location, callback) => {
    const { latitude, longitude } = location;

    const user = getUser(socket.id)

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`)
    );

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    
    if(user){
      io.to(user.room).emit("message", generateMessage('Admin', `${user.username} has left the room!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

  });
});

server.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
