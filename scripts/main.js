
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var gm;


window.onload = function(){

    /* This function calls only once */
    function start(){

    }

    /* This function repeats itself */
    function update(){
        GameManager.update();
        
        /* Background implementation */
        ctx.fillStyle = "#71D9E2"
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        /* Draw functions */
        GameManager.allEntities.forEach(element => {
            element.draw(ctx);
        });

        GameManager.allObstacles.forEach(element =>{
            element.draw(ctx);
        });


        requestAnimationFrame(update);
    }

    start();
    update();

}
