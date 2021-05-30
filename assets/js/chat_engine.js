// this class is going to send a request for connection, from front end
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000', { transports : ['websocket'] });
        if (this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chat_room: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user Joined!', data);
            });
        });

        // trigger button click on enter key
        $('#chat-message-input').keypress(function(event){
            if (event.keyCode === 13) {
                console.log('enter pressed');
                $('#send-btn').click();
            }
        });
        

        $('#send-btn').click(function(){
            let msg = $('#chat-message-input').val()

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chat_room: 'codeial'
                });
            }

            $('#chat-message-input').val('');
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');
            let messageType = 'received-message';
            if (data.user_email == self.userEmail){
                messageType = 'sent-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#message-ul').append(newMessage);
            $('#message-list').animate({ scrollTop: $(newMessage).offset().top });
        })
    }
}