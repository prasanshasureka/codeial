{
    // method to submit form data for new post using AJAX
    
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    
                    // call the create comment class
                    new PostComments(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
            // $('#new-post-form')[0].reset();
            newPostForm[0].reset();
            
        });

        

        
    }

    

    // method to create a post in DOM
    
    let newPostDom = function(post){
        return $(`<li id="post-${ post._id }" class="post">
                    <div id="post-header">
                        <div id="post-user">
                            <div id="profile-image">
                                <img src="${ post.user.avatar }" onerror="this.src='/images/avatar-default.png';">
                            </div>
                            <div id="post-user-name-createdat">
                                <p>
                                    ${ post.user.name }
                                </p>
                                <p id="post-created-at">
                                    Just now
                                </p>
                            </div>
                        </div>
                        <a class="delete-post-button" href="/posts/destroy/${ post._id }"><i class="fas fa-trash-alt"></i></a>
                    </div>
                    
                    <div id="post-content">
                        <p>
                            ${ post.content }
                        </p>
                        <div id="post-likes">
                            <small>
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ post._id }&type=Post">
                                    0 Likes
                                </a>
                            </small>
                        </div>
                    </div>
                    
                    <div class="post-comments-list">
                        <ul id="post-comment-${ post._id }">
                            
                        </ul>
                        <div id="comment-profile">
                        <div id="profile-image">
                            <img src="${ post.user.avatar }" alt="${ post.user.name }">
                        </div>
                            
                                <form id="post-${ post._id }-comments-form" action="/comment/create" method="POST" class="comment-form">
                                    <input type="text" name="content" placeholder="Write a comment.." required>
                                    <input type="hidden" name="post" value="${ post._id }" >
                                    <input type="submit" value="Add" id="comment-btn">
                                </form>
                            
                        </div>
                        
                    </div>
                </li> `)
    
    }

    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
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


    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        
        $('#post-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            let createdLink = $(' #post-created-at', self)
            deletePost(deleteButton);
            
            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
        
    }


    createPost();
    convertPostsToAjax();
    
}