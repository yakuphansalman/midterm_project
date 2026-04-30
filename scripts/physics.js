class Physics{
    constructor(entity, frictionX = 0.9, frictionY = 0.8, maxSpeed = 10, mass = 1.0){
        this.entity = entity;

        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;

        this.isGrounded = false;
        this.jumpLock = false;

        this.mass = mass;
        this.frictionX = frictionX;
        this.frictionY = frictionY;
        this.maxSpeed = maxSpeed;// Prevents infinite velocity
    }

    applyForce(forceX, forceY){
        this.accelerationX += forceX;
        this.accelerationY += forceY;
    }

    checkCollision(){
        this.isGrounded = false;
        
        GameManager.allObstacles.forEach(obstacle => {
            let ent_l = this.entity.posX;
            let ent_r = this.entity.posX + this.entity.width;
            let ent_t = this.entity.posY;
            let ent_b = this.entity.posY + this.entity.height;

            let obs_l = obstacle.posX;
            let obs_r = obstacle.posX + obstacle.width;
            let obs_t = obstacle.posY;
            let obs_b = obstacle.posY + obstacle.height;

            // Colliding condition
            let isCollidingX =  ent_r > obs_l && ent_l < obs_r;
            let isCollidingY = ent_b > obs_t && ent_t < obs_b;
            let isColliding = isCollidingX && isCollidingY;

            
            /* Prevent the ground jitter */
            let tol = 2;
            let fixedY = ent_b >= (obs_t - 1) && ent_b <= (obs_t + tol);
            this.isGrounded = !this.isGrounded ? isCollidingX && fixedY : this.isGrounded;

            if(isColliding){
                let delta = [
                    ent_r - obs_l,
                    obs_r - ent_l,
                    obs_t - ent_b,
                    ent_t - obs_b
                ]
                for(let i = 0; i < delta.length; i++){
                    delta[i] = Math.abs(delta[i]);
                }
                // Get which side is closer
                let minDelta = Math.min(...delta);
                let index = delta.indexOf(minDelta);
                // Left
                if(index === 0){
                    this.entity.posX = obs_l - this.entity.width;
                    this.velocityX = 0;
                }
                // Right
                if(index === 1){
                    this.entity.posX = obs_r;
                    this.velocityX = 0;
                }
                // Top
                if(index === 2){
                    this.entity.posY = obs_t - this.entity.height;
                    this.velocityY = 0;
                }
                // Bottom
                if(index === 3){
                    this.entity.posY = obs_b;
                    this.velocityY = 0;
                }
            }
        });
    }

    update(){
        // Apply gravity
        this.applyForce(0, 0.5);

        // Increase velocity by acceleration
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        // Apply velocity limit
        this.velocityX = (this.velocityX > this.maxSpeed) ? this.maxSpeed : (this.velocityX < -this.maxSpeed) ? -this.maxSpeed : this.velocityX;
        this.velocityY = (this.velocityY > this.maxSpeed) ? this.maxSpeed : (this.velocityY < -this.maxSpeed) ? -this.maxSpeed : this.velocityY;

        //Apply friction
        this.velocityX *= this.frictionX;
        this.velocityY *= this.frictionY;

        // Set minimum velocity treshold
        if(Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        if(Math.abs(this.velocityY) < 0.1) this.velocityY = 0;

        // Position assignment
        this.entity.posX += this.velocityX;
        this.entity.posY += this.velocityY;

        // Reset the acceleration
        this.accelerationX = 0;
        this.accelerationY = 0;

        this.checkCollision();
    }


}