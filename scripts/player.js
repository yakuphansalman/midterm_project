class Player extends Entity{
    constructor(name, x, y, health, speedX, src){
        super(name, x, y, health, speedX);
        this.img.src = src;
        this.width = this.img.width;
        this.height = this.img.height;
        
        // Constructor sets posY same as obstacles so this line aligns the object.
        this.posY -= this.height;

        
        GameManager.addGameObject(this);
        GameManager.addEntity(this);
        GameManager.player = this;
    }
}