class Entity{
    posX = 0;
    posY = 0;
    name = "Entity";
    health = 100;

    /* TEMPORARY */
    color = "white";
    width = 100;
    height = 100;

    constructor(name,posX, posY, health){
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.health = health;
    }

    /* TEMPORARY */
    setColor(color){
        this.color = color;
    }
    
    draw(){
        ctx.fillStyle = this.color;

        ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }
    move(dx, dy){
        this.x += dx;
        this.y += dy;
    }
}

