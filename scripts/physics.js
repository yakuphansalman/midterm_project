class Physics{
    constructor(entity, frictionX = 0.9, frictionY = 0.8, maxSpeed = 10, mass = 1.0){
        this.entity = entity;

        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;

        this.mass = mass;
        this.frictionX = frictionX;
        this.frictionY = frictionY;
        this.maxSpeed = maxSpeed;// Prevents infinite velocity
    }

    applyForce(forceX, forceY){
        this.accelerationX += forceX;
        this.accelerationY += forceY;
    }

    update(){
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
    }


}