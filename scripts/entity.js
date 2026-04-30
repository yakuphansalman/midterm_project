class Entity extends GameObject{
    health = 100;
    velocity = 1.0;//Has to remove later

    img = new Image();
    
    width = 0;
    height = 0;

    facingRight = 1;

    physics = new Physics(this, 0.9, 0.5, 10.0, 1.0);

    constructor(name,posX, posY, health, speedX){
        super();
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.health = health;
        this.speedX = speedX;
    }
    applyForce(forceX, forceY){
        forceX*=0.1*this.speedX;
        this.physics.applyForce(forceX, forceY);
    }

    draw(ctx){
        ctx.save();

        ctx.translate(this.posX + (this.width/2), this.posY + (this.height/2));
        ctx.scale(this.facingRight, 1);
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();
    }
    
    faceForward(){
        if(this.physics.velocityX > 0.1){
            this.facingRight = 1;
        }
        else if(this.physics.velocityX < -0.1){
            this.facingRight = -1;
        }
    }

    stateHistory = [];  // Array to store past states
    maxHistory = 180;   // Store up to 3 seconds at 60 FPS

    // Save current state to history
    saveState() {
        this.stateHistory.push({
            posX: this.posX,
            posY: this.posY,
            health: this.health
        });

        // Limit history size
        if (this.stateHistory.length > this.maxHistory) {
            this.stateHistory.shift();
        }
    }

    // Return to last state
    rewind() {
        if (this.stateHistory.length > 0) {
            const lastState = this.stateHistory.pop();

            this.posX = lastState.posX;
            this.posY = lastState.posY;
            this.health = lastState.health;
        }
    }
}



