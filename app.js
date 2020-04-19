var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
io = socketIO(server);

var chatGroups = {};
var socketUserMap = {};

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/views/chat.html');
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

io.on('connection', (socket) => {

    socket.on('join-chat', (data) => {
        socketUserMap[socket.id] = { user: data.user, chat: data.chat };
        if (chatGroups[data.chat.id]) {
            chatGroups[data.chat.id].members = chatGroups[data.chat.id].members.concat([data.user]);
        } else {
            chatGroups[data.chat.id] = { members: [data.user] };
        }
        socket.join(data.chat.id);
        socket.to(data.chat.id).emit('joined', data.user.name + ' has joined the chat.');
    });

    socket.on('message', ({ chatId, message, from }) => {
        socket.to(chatId).emit('message', { message, from });
    });

    socket.on('disconnect', () => {
        var user = socketUserMap[socket.id].user;
        var chat = socketUserMap[socket.id].chat;
        delete socketUserMap[socket.id];
        // Todo: Fix this!
        chatGroups[chat.id] = chatGroups[chat.id].members.filter(m => m.id !== user.id);
        socket.to(chat.id).emit('left', user.name + ' has left the chat.');
    });
});