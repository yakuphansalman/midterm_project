class Physics{
    constructor(entity, frictionX = 0.9, frictionY = 0.8, maxSpeed = 10, mass = 1.0){
        this.entity = entity;

        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;

        this.isGrounded = false;

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
        
        GameManager.allObstacles.forEach(obstacle => {
            const ent_l = this.entity.posX;
            const ent_r = this.entity.posX + this.entity.width;
            const ent_t = this.entity.posY;
            const ent_b = this.entity.posY + this.entity.height;

            const obs_l = obstacle.posX;
            const obs_r = obstacle.posX + obstacle.width;
            const obs_t = obstacle.posY;
            const obs_b = obstacle.posY + obstacle.height;

            


            // Colliding condition
            let isColliding = ent_r > obs_l && ent_l < obs_r && ent_b > obs_t && ent_t < obs_b;
            
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

                this.isGrounded = index === 2;

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
                    this.isGrounded = true;
                }
                // Bottom
                if(index === 3){
                    this.entity.posY = obs_b;
                    this.velocityY = 0;
                }
            }
            else{
                this.isGrounded = false;
            }
        });
    }

    update(){
        // Apply gravity
        this.applyForce(0, 0.3);

        // Increase velocity by acceleration
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        // Apply velocity limit
        this.velocityX = (this.velocityX > this.maxSpeed) ? this.maxSpeed : (this.velocityX < -this.maxSpeed) ? -this.maxSpeed : this.velocityX;
        this.velocityY = (this.velocityY > this.maxSpeed) ? this.maxSpeed : (this.velocityY < -this.maxSpeed) ? -this.maxSpeed : this.velocityY;

        //Apply friction
        this.velocityX *= this.mass*this.frictionX;
        this.velocityY *= this.mass*this.frictionY;

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