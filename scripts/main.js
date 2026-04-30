
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');


window.onload = function(){

    /* This function calls only once */
    function start(){
        GameManager.initScene();
    }

    /* This function repeats itself */
    function update(){
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        GameManager.update(ctx);

        /* Background implementation */
        ctx.fillStyle = "#71D9E2"
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        
        /* Entity updates */
        GameManager.allEntities.forEach(element => {
            element.draw(ctx);
            element.faceForward();
        });

        /* Obstacle updates */
        GameManager.allObstacles.forEach(element =>{
            element.draw(ctx);
        });

        GameManager.drawConnectionLine(ctx);

        requestAnimationFrame(update);
    }
 

    start();
    update();

}
