$(() => {
    $("input[name='chat-type']").on('change', handleChatTypeSelection);
    $('#start-chat-form').on('submit', handleChatFormSubmission);
    handleChatTypeSelection();
});

function handleChatTypeSelection() {
    var value = $("input[name='chat-type']:checked").val();
    if (value === 'new') {
        $('#chat-secret-wrapper').hide();
        $('#chat-name-wrapper').show();
    } else {
        $('#chat-secret-wrapper').show();
        $('#chat-name-wrapper').hide();
    }
}

function handleChatFormSubmission(e) {
    e.preventDefault()
    var data = getChatFormData();
    localStorage.setItem('socket-chat', JSON.stringify(data));
    window.location = '/chat'
}

function getChatFormData() {
    var data = {
        user: {
            id: $('#username').val() + '-' + Date.now(),
            name: $('#username').val(),
            color: getUserAccent()
        },
        chat: {}
    };

    if (isNewChatRequest()) {
        var name = $('#chat-name').val();
        var id = btoa(data.user.id + '_' + data.user.name + '_' + name);
    } else {
        var id = $('#chat-secret').val();
        var name = atob(id).split('_')[2];
    }

    data.chat = {
        id,
        name
    };

    return data;
}

function isNewChatRequest() {
    return $("input[name='chat-type']:checked").val() === 'new';
}

function getUserAccent() {
    var colors = [ 'is-dark', 'is-primary', 'is-link', 'is-info', 'is-success', 'is-warning', 'is-danger'];
    return colors[ Math.floor(Math.random() * colors.length) ];
}