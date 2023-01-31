const users = [];
const socketio = require('socket.io');
const models = require('../models/index');
let io;
module.exports = {
    init: (server) => {
        console.log("function called-----")
        io = socketio(server);
        io.on('connection', (socket) => {
            socket.on('chatMessage', data => {
                savePrivateChat(data);
                   io.emit('chatMessage', data);
             //   io.to(users[data.receiverid]).emit('chatMessage', data);
            });
            socket.on('newJobAdded', () => {

                   io.emit('newJobAdded', {});
             //   io.to(users[data.receiverid]).emit('chatMessage', data);
            });
        });

    },

};

// saveprivateChat
const savePrivateChat = async (data) => {
    // data.timeStamp = Date.now();
    models.Message.add(data);
};
const changeCoordinate = async (data) => {
    // data.timeStamp = Date.now();
    models.User.update({});

    models.User.update({
        latitude:data.latitude,
        longitude:data.longitude
    }, {
        where: {
            id: data.user_id,
            type:data.type
        }
    })
};
