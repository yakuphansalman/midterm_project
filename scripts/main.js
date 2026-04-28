
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var image = new Image();
image.src = "./images/background2.png";
image.onload = function(){
    ctx.drawImage(image, 0, 0, 1280, 720);
}
