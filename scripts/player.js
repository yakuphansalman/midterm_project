class Player extends Entity {
    constructor(name, x, y, health, speedX, src) {
        super(name, x, y, health, speedX);
        this.img.src = src;
        this.width = 30;  
        this.height = 48;

        this.spriteOffsetX = 0;
        this.spriteOffsetY = -10;

        GameManager.addGameObject(this);
        GameManager.addEntity(this);
        GameManager.player = this;
        

        this.animation = {
            // Format: Path, frameWidth, frameHeight, column, row, totalSquare, speed, loop
            idle: new animation( src + "/Idle.png", 128, 64, 2, 4, 8, 10, true),
            run: new animation( src + "/Run.png", 128, 64, 2, 4, 8, 5, true),

            jump: new animation( src + "/Jump.png", 128, 64, 2, 4, 8, 25, false),
            death: new animation( src + "/Death.png", 128, 64, 2, 4, 8, 10, false),

            attack: new animation( src + "/Attack.png", 128, 64, 8, 5, 4, 4, false)
        };
    }
}