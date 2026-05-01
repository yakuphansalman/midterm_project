class Enemy extends Entity{
    constructor(name, x, y, health, speedX, src){
        super(name, x, y, health, speedX);
        this.img.src = src;
        this.width = 40;
        this.height = 43;
        GameManager.addGameObject(this);
        GameManager.addEntity(this);
        GameManager.addEnemy(this);
    }
}