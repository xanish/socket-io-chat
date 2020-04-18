var socket = io();
$('form').submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('message', (msg) => {
    $('#messages').append($('<li>').text(msg));
});