class Entity extends GameObject{

    img = new Image();
    facingRight = 1;

    physics = new Physics(this, 0.9, 0.8, 5.0, 40.0, 1.0);

    constructor(name,posX, posY, health, speedX, damage, attackSpeed, attackRange, visionRange,src){
        super(name, posX, posY);
        this.img.src = src;
        this.width = this.img.width;
        this.height = this.img.height;
        this.health = health;
        this.speedX = speedX;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.attackRange = attackRange;
        this.visionRange = visionRange;
        this.posY -= this.height;

        this.ai = new AI(this);

        GameManager.addEntity(this);
    }

    changeState(newState) {
        if (this.currentState === newState || this.currentState === "death") { return; }

        this.currentState = newState;

        // Safety check: Ensure the animation exists for the new state.
        // If it does, reset its frames and timers to 0 so it plays from the very beginning 
        // instead of resuming from where it left off last time.
        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].reset();
        }
    }

    update() {
        this.checkFlip();

        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].update();

            if (this.animation[this.currentState].isDone) {
                if (this.currentState !== "death" && this.currentState !== "jump") {
                    this.changeState("idle");
                }
            }
        }
    }

    applyForce(forceX, forceY) {
        forceX *= 0.1 * this.speedX;
        this.physics.applyForce(forceX, forceY);
    }

    // Add these default values right below "facingRight = 1;" at the top of your Entity class
    spriteOffsetX = 0;
    spriteOffsetY = 0;

    // Replace your draw method with this:
    draw(ctx) {
        ctx.save();

        let centerX = this.posX + (this.width / 2) - Camera.posX;
        let centerY = this.posY + (this.height / 2) - Camera.posY;
        ctx.translate(centerX, centerY);

        if (GameManager.current === this) {
            ctx.fillStyle = "#00FF00";
            ctx.beginPath();

            // Create a smooth bouncing effect using the current time and Sine wave
            let bounce = Math.sin(Date.now() / 150) * 5;

            // Position the arrow above the character's head (-height / 2)
            let arrowTipY = -this.height / 2 - 15 + bounce;

            // Draw an upside-down triangle using Canvas lines
            ctx.moveTo(0, arrowTipY);           // Bottom point (pointing down at head)
            ctx.lineTo(-8, arrowTipY - 12);     // Top left corner
            ctx.lineTo(8, arrowTipY - 12);      // Top right corner
            ctx.fill();                         // Fill the shape with color
        }

        // Apply specific offsets (Mushrooms will be 0, Player will be -15)
        ctx.translate(this.spriteOffsetX * this.facingRight, this.spriteOffsetY);
        ctx.scale(this.facingRight, 1);

        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].draw(ctx);
        } else {
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }

    // Manages facing direction because of some inputs or ai calls
    checkFlip() {
        let cond_l = this.physics.velocityX < 0 && this.facingRight > 0;
        let cond_r = this.physics.velocityX > 0 && this.facingRight < 0;
        if (cond_l || cond_r) { this.facingRight *= -1; }
    }

    stateHistory = [];  // Array to store past states
    maxHistory = 180;   // Store up to 3 seconds at 60 FPS

    // Save current state to history
    saveState() {
        let currentAnimFreame = 0;
        if (this.animation && this.animation[this.currentState]) {
            currentAnimFreame = this.animation[this.currentState].currentFrame;
        }

        this.stateHistory.push({
            posX: this.posX,
            posY: this.posY,
            health: this.health,
            currentState: this.currentState,
            facingRight: this.facingRight,
            animFrame: currentAnimFreame
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

            this.currentState = lastState.currentState;
            this.facingRight = lastState.facingRight;

            if (this.animation && this.animation[this.currentState]) {
                this.animation[this.currentState].currentFrame = lastState.animFrame;
            }
        }
    }

    jump(force, event){
        if(event){
            if(this.physics.isGrounded && !this.physics.jumpLock){
                this.physics.applyForce(0, -force);
                console.log("jump");
            }
            this.physics.jumpLock = true;
        } else{
            this.physics.jumpLock = false;
        }
    }
    // Every entity can attack and take damage

    lastAttack = Date.now();
    attack(range){
        let baseCooldown = 1000;
        let cooldown = baseCooldown * (100 - this.attackSpeed) / 100;
        let canAttack = Date.now() > (this.lastAttack + cooldown);

        if (!canAttack) { return; }

        this.changeState("attack");
        this.lastAttack = Date.now();
        
        for(let i = 0; i < GameManager.allEntities.length; i++){
            let target = GameManager.allEntities[i];
            if (this === target) { continue; }
            let deltaX = target.posX - this.posX;
            let deltaY = target.posY - this.posY;

            if (deltaX * this.facingRight < 0 || deltaY > this.height) { continue; }

            if (Math.abs(deltaX) <= range) {
                target.takeDamage(this.damage, this.facingRight);
            }
        }
    }

    takeDamage(damage, hitDirection) {
        this.health -= damage;
        if (this.health <= 0) { this.health = 0; }

        let force = 10.0;
        this.physics.applyForce(hitDirection * force, 0);
    }

    die() {
        this.changeState("death");
    }
}


