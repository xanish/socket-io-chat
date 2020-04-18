var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
io = socketIO(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

io.on('connection', (socket) => {
    console.log('User conntected');

    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})