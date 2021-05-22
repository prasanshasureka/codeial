// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.commentHeader = $('#comment-user-name-createdat');
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        
        
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
        $(' #comment-created-at', this.postContainer).each(function(){
            self.calculate($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comment/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comment-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                    pSelf.newCalculate($(' #comment-created-at', newComment) , data.data.comment);
                    new ToggleLike($(' .toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
            
            pSelf.newCommentForm[0].reset();

        });
    }


    newCommentDom(comment){
        return $(`<li id="comment-${ comment._id }" class="comment">
                    <div id="comment-header">
                        <div id="comment-user">
                            <div id="profile-image">
                                <img src="${ comment.user.avatar }" alt="${ comment.user.name }">
                            </div>
                            <div id="comment-user-name-createdat">
                                <p>
                                ${ comment.user.name }
                                </p>
                                <p id="comment-created-at">
                                    
                                ${ comment.createdAt }
                                </p>
                            </div>
                        </div>
                        
                        <small>
                            <a class="delete-comment-button" href="/comment/destroy/${ comment._id }"><i class="fas fa-trash-alt"></i></a>
                        </small>
                    </div>
                    <div id="comment-content">
                        <p>
                        ${ comment.content }
                        </p>
                        <div id="comment-likes">
                            
                            <small>
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ comment._id }&type=Comment">
                                    0 Likes
                                </a>
                            </small>
                            
                        </div>
                    </div>
                </li>`);
    }

    // newCommentDom(comment){
    //     return $(`<li id="comment-${ comment._id }">
    //                     <p>
                            
    //                         <small>
    //                             <a class="delete-comment-button" href="/comment/destroy/${comment._id}">X</a>
    //                         </small>
                            
    //                         ${comment.content}
    //                         <br>
    //                         <small>
    //                             ${comment.user.name}
    //                         </small>
    //                         <br>
    //                         <small>
    //                             <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ comment._id }&type=Comment">
    //                                 0 Likes
    //                             </a>
    //                         </small>
                            
    //                     </p>    

    //             </li>`);
    // }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    calculate(createdLink){
        console.log($(createdLink).html(), 'inside comm calc');
        let createdAt = moment($(createdLink).html());
        console.log(createdAt);
        let time_lapsed = moment(createdAt).from(moment())
        console.log('from ajax',time_lapsed);
        return createdLink.html(time_lapsed)
        
    }

    // using this function for a new comment as the createdAt for a new comment doesn't support moment
    // the format of createdAt when stored and then retrieved 
    // from mongo is diff than what is created in a new comment
    newCalculate(createdLink, comment){
        let createdAt = moment(comment.createdAt);
        let time_lapsed = moment(createdAt).from(moment())
        return createdLink.html(time_lapsed)
        
    }
}