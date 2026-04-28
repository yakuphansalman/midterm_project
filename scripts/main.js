
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var gm;


window.onload = function(){

    //Load a game manager
    gm = new GameManager();

    /* This function calls only once */
    function start(){
        /* Background implementation */
        ctx.fillStyle = "#71D9E2"
        ctx.fillRect(0, 0, cvs.width, cvs.height);

    }

    /* This function repeats itself */
    function update(){
        gm.update();
        

        /* Draw functions */
        gm.player.draw(ctx);
        requestAnimationFrame(update);
    }

    start();
    update();

}
