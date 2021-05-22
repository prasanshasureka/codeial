
let page_title = document.title;
if (page_title == 'Codeial | Sign Up' || page_title == 'Codeial | Sign In'){
    layoutMain = document.getElementById('layout-main');
    layoutMain.style.cssText = "background-image: url('../images/doodle.jpg'); background-position: center; background-repeat: no-repeat; background-size: contain;"
}
// console.log(document.getElementById('user-name').innerHTML)
if (page_title == 'Home Page' && document.getElementById('user-name')){
    layoutMain = document.getElementById('layout-main');
    layoutMain.style.cssText = "background-color: #eeeeee;"
}

if (page_title == 'Home Page' && document.getElementById('user-name')){
    footer = document.getElementById('page-footer').parentElement;
    footer.style.cssText = "background-color: #eeeeee;"
}


