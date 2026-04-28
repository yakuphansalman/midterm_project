class Entity{
    posX = 0;
    posY = 0;
    name = "Entity";
    health = 100;

    img = new Image();
    
    width = this.img.width;
    length = this.img.length;

    constructor(name,posX, posY, health){
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.health = health;
    }
    
    move(dx, dy){
        this.x += this.posX;
        this.y += this.posy;
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



