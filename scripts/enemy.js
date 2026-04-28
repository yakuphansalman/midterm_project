class Enemy extends Entity{
    constructor(name, x, y, health, velocity, src){
        super(name, x, y, health, velocity);
        this.img.src = src;
    }
}