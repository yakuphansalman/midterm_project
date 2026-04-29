class Obstacle extends GameObject{
    width = 1;
    height = 1;

    constructor(posX, posY, width, height){
        super();
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        GameManager.addObstacle(this);
    }

    draw(ctx){
        ctx.fillStyle = "#e77c29"
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }
}