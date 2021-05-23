// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
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
                                    Just now
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

}