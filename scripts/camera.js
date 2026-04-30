class Camera{

    static posX = 0.0; static posY = 0.0;

    static offsetX = -100.0; 
    static offsetY = -200.0;
    static move(posX, posY){
        this.posX += posX;
        this.posY += posY;
    }
    static focus(entity){
        /*
        let targetX = entity.posX - this.offsetX;
        let targetY = entity.posY - this.offsetY;

        let lerpSpeed = 0.1;

        this.posX += (targetX - this.posX)*lerpSpeed;
        this.posY += (targetY - this.posY)*lerpSpeed;
        */
    }
}