class Entity extends GameObject{
    health = 100;
    velocity = 1.0;

    img = new Image();
    
    width = this.img.width;
    length = this.img.length;

    physics = new Physics(this, 0.8, 0.9, 10.0, 1.0);

    constructor(name,posX, posY, health, velocity){
        super();
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.health = health;
        this.velocity = velocity;
    }
    applyForce(forceX, forceY){
        this.physics.applyForce(forceX, forceY);
    }
    move(dx, dy){
        this.posX += dx*this.velocity;
        this.posY += dy;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.posX, this.posY);
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



