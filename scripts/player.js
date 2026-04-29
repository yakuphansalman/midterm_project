class Player extends Entity{
    constructor(name, x, y, health, velocity, src){
        super(name, x, y, health, velocity);
        this.img.src = src;
        this.width = this.img.width;
        this.height = this.img.height;
        GameManager.addEntity(this);
    }
}