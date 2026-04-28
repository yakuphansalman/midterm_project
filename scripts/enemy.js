class Enemy extends Entity{
    constructor(name, x, y, health, src){
        super(name, x, y, health);
        this.img.src = src;
    }
}