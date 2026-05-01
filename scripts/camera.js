class Camera{

    static posX = 0.0; static posY = 0.0;

    static offsetX = 640.0; 
    static offsetY = 360.0;

    static lookAhead = 200.0;
    static move(posX, posY){
        this.posX += posX;
        this.posY += posY;
    }
    static focus(entity){
        let centerX = (entity.posX + entity.width/2) - this.offsetX;

        let targetX = centerX + (this.lookAhead*entity.facingRight);
        let targetY = entity.posY - this.offsetY;

        let lerpSpeed = 0.0023;

        this.posX += (targetX - this.posX)*lerpSpeed;
        this.posY += (targetY - this.posY)*lerpSpeed;
    }
}