class GameObject{
    name = "GameObject"
    posX = 0;
    posY = 0;

    
    move(dx, dy){
        this.posX += dx;
        this.posY += dy;
    }
}
