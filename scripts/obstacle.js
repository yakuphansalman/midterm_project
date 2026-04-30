class Obstacle extends GameObject{
    width = 1;
    height = 1;

    constructor(posX, posY, width, height){
        super();
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        GameManager.addGameObject(this);
        GameManager.addObstacle(this);
    }

    draw(ctx){
        ctx.save();

        ctx.fillStyle = "#e77c29";

        let drawX = this.posX - Camera.posX;
        let drawY = this.posY + Camera.posY;
        ctx.fillRect(drawX, drawY, this.width, this.height);

        ctx.restore();
    }
}