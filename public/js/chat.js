var socket = io();
$(() => {
    var data = JSON.parse(localStorage.getItem('socket-chat'));
    socket.emit('join-chat', data);
    $('#chat-form').on('submit', handleMessageSend);
    $('#chat-group-name').html(getChatTitle());
});

function handleMessageSend(e) {
    e.preventDefault();
    var message = $('#message').val().trim();
    if (message !== '') {
        $('#message').val('');
        var chatId = getChatId();
        var from = getUser();
        socket.emit('message', { chatId, message, from });
        appendMessage({ message, from });
    }
}

function getChatId() {
    var data = JSON.parse(localStorage.getItem('socket-chat'));
    return data.chat.id;
}

function getMessageBox(message, user) {
    var alignment = user.id === (getUser()).id ? 'align-end' : '';
    return `
<div class="panel-block ${alignment}">
    <article class="message is-small ${user.color}">
        <div class="message-header"><p>${user.name}</p></div>
        <div class="message-body">${message}</div>
    </article>
</div>
`;
}

function getUser() {
    var data = JSON.parse(localStorage.getItem('socket-chat'));
    return data.user;
}

function appendMessage({ message, from }) {
    var messageBox = getMessageBox(message, from);
    $(messageBox).insertBefore('#chat-control-block');
}

function getChatTitle() {
    var data = JSON.parse(localStorage.getItem('socket-chat'));
    var chatName = data.chat.name;
    var chatId = data.chat.id;
    return `${chatName} <span class="tag is-white">Invite Code: ${chatId}</span>`;
}

function getUserJoinedNotificationBox(notification) {
    return `
<div class="panel-block align-center">
    <span class="tag is-success">${notification}</span>
</div>`;
}

function getUserLeftNotificationBox(notification) {
    return `
<div class="panel-block align-center">
    <span class="tag is-danger">${notification}</span>
</div>`;
}

socket.on('joined', (notification) => {
    var notifyBox = getUserJoinedNotificationBox(notification);
    $(notifyBox).insertBefore('#chat-control-block');
});

socket.on('message', appendMessage);

socket.on('left', (notification) => {
    var notifyBox = getUserLeftNotificationBox(notification);
    $(notifyBox).insertBefore('#chat-control-block');
});
