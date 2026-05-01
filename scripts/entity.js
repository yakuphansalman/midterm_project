class Entity extends GameObject{
    health = 100;
    damage = 10;
    attackSpeed = 1.0;

    img = new Image();
    
    width = 0;
    height = 0;

    facingRight = 1;

    physics = new Physics(this, 0.9, 0.8, 10.0, 40.0, 1.0);

    constructor(name,posX, posY, health, speedX){
        super(name, posX, posY);
        this.health = health;
        this.speedX = speedX;
    }
    applyForce(forceX, forceY){
        forceX*=0.1*this.speedX;
        this.physics.applyForce(forceX, forceY);
    }

    draw(ctx){
        ctx.save();

        ctx.translate(this.posX + (this.width/2) - Camera.posX, this.posY + (this.height/2) - Camera.posY);
        ctx.scale(this.facingRight, 1);
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();
    }

    // Manages facing direction because of some inputs or ai calls
    checkFlip(){
        let cond_l = this.physics.velocityX < 0 && this.facingRight > 0;
        let cond_r = this.physics.velocityX > 0 && this.facingRight < 0;
        if(cond_l || cond_r){ this.facingRight *= -1;}
    }

    stateHistory = [];  // Array to store past states
    maxHistory = 180;   // Store up to 3 seconds at 60 FPS

    // Save current state to history
    saveState() {
        /* NOT: Animasyonlar için frame ve facingRight verisi stateHistory dizisine eklenmeli */
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
        let cooldown = baseCooldown*(100 -this.attackSpeed)/100;
        let canAttack = Date.now() > (this.lastAttack + cooldown);

        if(!canAttack){ return;}
            
        // Attack animation here
        this.lastAttack = Date.now();
        
        for(let i = 0; i < GameManager.allEntities.length; i++){
            let target = GameManager.allEntities[i];
            // Pass this target
            if(this === target){ continue;}
            let deltaX = target.posX - this.posX;
            let deltaY = target.posY - this.posY;

            // This entity can only attack forward and by it's height
            if(deltaX*this.facingRight < 0 || deltaY > this.height){ continue;}


            if(Math.abs(deltaX) <= range){
                target.takeDamage(this.damage, this.facingRight);
            }
        }
    }
    takeDamage(damage, hitDirection){
        this.health -= damage;
        // Health can't be negative
        if(this.health <= 0){ this.health = 0;}

        // Knockback
        let force = 10.0;
        this.physics.applyForce(hitDirection*force, 0);
        // Knockback animation here
    }
    die(){
        // Death Animation
    }
}



