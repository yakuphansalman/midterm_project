class GameObject{
    constructor(name, x, y){
        this.name = name;
        this.posX = x;
        this.posY = y;
    }

    
    move(dx, dy){
        this.posX += dx;
        this.posY += dy;
    }
}
