console.log($('#current-user-friends>ul>li>a').html());

class ToggleFriend{
    constructor(toggleFriendForm){
        this.toggler = toggleFriendForm;
        this.toggleFriend();
    }
    
    toggleFriend(){
        $(this.toggler).submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: '/user/toggleFriend',
                data: $(self).serialize()
            })
            .done(function(data) {
                let friendbtn = $('#toggle-friend-btn').attr('value');
                if (data.data.deleted == true){
                    friendbtn = 'Add Friend';
                }else{
                    friendbtn = 'Remove Friend';
                }

                $('#toggle-friend-btn').attr('value', friendbtn);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}
