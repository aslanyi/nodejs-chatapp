const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const io = socketio();
const onlineUsers = require('./lib/onlineUsers');
const Rooms = require('./lib/Rooms');
const Messages = require('./lib/Messages');
const socketAuthorization = require('../middlewares/socketAuthorization');

const socketApi = {
    io
};

io.use(socketAuthorization);

io.adapter(redisAdapter({
    host:process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}));

io.on('connection',(socket)=>{
    const user = socket.request.user;
    console.log('a user logged in name '+user.name);

    onlineUsers.upsert(socket.id,user);

    onlineUsers.list(users=>{
        io.emit('onlinelist',users);
    });

    Rooms.list(rooms=>{
            socket.emit('roomList',rooms);
        });

    socket.on('newRoom',(roomName)=>{
        Rooms.upsert(roomName);
        Rooms.list(rooms=>{
            socket.emit('roomList',rooms);
        });
    });
    socket.on('newMessage',data=>{
        const messageData = {
            ...data,
            userId:user._id,
            name:user.name,
            surname:user.surname
        }
        Messages.upsert(messageData);
        socket.broadcast.emit('recieveMessage',messageData);
    });

    
    
    socket.on('disconnect',()=>{
        onlineUsers.remove(user._id);
        onlineUsers.list(users=>{
            io.emit('onlinelist',users);
        });
    });
});


module.exports = socketApi;