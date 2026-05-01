AI_STATE = {
    RETURN: -1,
    PATROL: 0,
    STARE: 1,
    CHASE: 2,
    ATTACK: 3
}

class AI{
    constructor(entity){
        this.entity = entity;
        this.target = null;
        this.tolerance = this.entity.width;
        this.currentState = AI_STATE.CHASE;
    }


    move(targetPosX){
        let deltaX = targetPosX - this.entity.posX;
        
        // Check if its not on target position
        if(Math.abs(deltaX) > this.tolerance){
            if(deltaX*this.entity.facingRight < 0){
                this.entity.facingRight *=-1;
            }
            this.entity.applyForce(this.entity.facingRight*this.entity.speedX, 0);
        }

        // Is there an obstacle on the way?
        // Is it at left or right?
        let collision = this.entity.physics.collisionDir === 0 || this.entity.physics.collisionDir === 1;
        if(collision){
            this.entity.applyForce(0, -15.0);
        }
    }
    lastKnownPosX = null;

    think(){
        this.target = null;
        GameManager.allEntities.forEach(target => {
            if(target === this.entity){ return;}
            let deltaX = target.posX - this.entity.posX;

            // Overlap fix
            let isOverlapping = (
                this.entity.posX < target.posX + target.width &&
                this.entity.posX + this.entity.width > target.posX
            );
            let isInFront = (deltaX * this.entity.facingRight) >= 0;

            if(GameManager.checkVisibility(this.entity, target) && GameManager.getDistance(this.entity, target) < this.entity.visionRange && (isInFront || isOverlapping)){
                if(this.target === null){ this.target = target; return;}    
                this.target = Math.abs(this.target.posX - this.entity.posX) < Math.abs(target.posX - this.entity.posX) ? this.target : target;
            }
        });
        if(this.target !== null && GameManager.checkVisibility(this.entity, this.target)){
            this.currentState = AI_STATE.CHASE;
            this.lastKnownPosX = this.target.posX + (this.target.width / 2);
        }
        else if(this.lastKnownPosX === null){
            this.currentState = AI_STATE.RETURN;
        }
        else{
            this.currentState = AI_STATE.CHASE;
        }

    }

    act(){
        if(this.currentState === AI_STATE.ATTACK){
            
        }
        else if(this.currentState === AI_STATE.CHASE){
            if(this.target !== null){
                console.log("target");
                this.move(this.target.posX - this.entity.facingRight*(this.target.width / 2));
            }
            else if(this.lastKnownPosX !== null){
                console.log("lkpx");
                this.move(this.lastKnownPosX);
                if(Math.abs(this.lastKnownPosX - this.entity.posX - this.entity.width/2) < this.tolerance){
                    this.lastKnownPosX = null;
                }
            }
            else{
                this.currentState = AI_STATE.RETURN;
            }
        }

        else if(this.currentState === AI_STATE.PATROL){

        }
        else if(this.currentState === AI_STATE.RETURN){

        }
    }

    update(){
        this.think();
        this.act();
    }
}
class PatrolPoint extends GameObject{
    constructor(posX, posY, range){
        super("patrol", posX, posY);
        this.range = range;
    }

}