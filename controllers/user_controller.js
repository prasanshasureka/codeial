module.exports.profile = function(req, res){
    // res.end('<h1>User Profile</h1>');
    return res.render('users', {
        title: 'Users'
    })
}

module.exports.posts = function(req, res){
    res.end('<h1>User Posts</h1>')
}