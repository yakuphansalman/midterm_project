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
        this.tolerance = this.entity.width/2;
        this.currentState = AI_STATE.CHASE;
    }

    getClosestPatrolPoint(){
        if(GameManager.allPatrolPoints.length === 0){ return null;}
        let closestValue = Infinity;
        let closest = GameManager.allPatrolPoints[0];
        GameManager.allPatrolPoints.forEach(point => {
            let delta = Math.abs(point.posX - this.entity.posX);
            if(delta < closestValue){ closest = point; closestValue = delta;}
        });
        return closest;
    }


    move(targetPosX){
        let deltaX = targetPosX - this.center;
        
        // Check if its not on target position
        if(Math.abs(deltaX) > this.tolerance){
            if(deltaX*this.entity.facingRight < 0){
                this.entity.facingRight *=-1;
            }
            this.entity.changeState("run");
            this.entity.applyForce(this.entity.facingRight*this.entity.speedX, 0);
        }

        if(this.currentState === AI_STATE.PATROL){ return;}
        let collision = this.entity.physics.collisionDir === 0 || this.entity.physics.collisionDir === 1;// Collided by left or right?
        if(collision && this.entity.physics.isGrounded){
            this.entity.changeState("jump");
            this.entity.applyForce(0, -2.0);
        }

    }
    lastKnownPosX = null;

    think(){
        // Align the position
        this.center = this.entity.posX + (this.entity.width/2);
        // Target has to be null every frame, so if there's no target in the scene or in the sight, this entity will try to chase the unseen
        this.target = null;
        // Get closest patrol point
        let closestPatrolPoint = this.getClosestPatrolPoint();
        // Is enemy object visible?
        GameManager.allEntities.forEach(target => {
            if(target === this.entity){ return;}
            let deltaX = target.posX - this.entity.posX;

            // Overlap fix
            let isOverlapping = (
                this.entity.posX < target.posX + target.width &&
                this.entity.posX + this.entity.width > target.posX
            );
            // There might be more than one objects in the sight, target should be the closest
            let isInFront = (deltaX * this.entity.facingRight) >= 0;
            if(GameManager.checkVisibility(this.entity, target) && GameManager.getDistance(this.entity, target) < this.entity.visionRange && (isInFront || isOverlapping)){
                if(this.target === null){ this.target = target; return;}    
                this.target = Math.abs(this.target.posX - this.entity.posX) < Math.abs(target.posX - this.entity.posX) ? this.target : target;
            }
        });
        // Chase and Attack
        if(this.target !== null && GameManager.checkVisibility(this.entity, this.target)){
            this.currentState = AI_STATE.CHASE;
            this.lastKnownPosX = this.target.posX + (this.target.width / 2); // Save last known position
            if(GameManager.toleratedOverlap(this.entity.attackRange + this.entity.width, this.entity, this.target)){
                let directionToTarget = this.target.posX - this.entity.posX;
                this.entity.facingRight = directionToTarget < 0 ? -1: 1;
                this.currentState = AI_STATE.ATTACK;
            }
        }
        else if(this.lastKnownPosX !== null){
            this.currentState = AI_STATE.CHASE;
        }
        // Return and Patrol 
        else if(closestPatrolPoint !== null){
            let patrolBoundRight = closestPatrolPoint.posX + closestPatrolPoint.range;
            let patrolBoundLeft = closestPatrolPoint.posX - closestPatrolPoint.range;

            if(this.center < patrolBoundLeft || this.center > patrolBoundRight){
                this.currentState = AI_STATE.RETURN;
            }
            else{
                this.currentState = AI_STATE.PATROL;
            }
        }
        else{
            this.currentState = AI_STATE.RETURN;
        }
    }

    act(){
        let closestPoint = this.getClosestPatrolPoint();
        if(this.currentState === AI_STATE.ATTACK){
            this.entity.attack();
        }
        else if(this.currentState === AI_STATE.CHASE){
            if(this.target !== null){
                this.move(this.target.posX - this.entity.facingRight*(this.target.width / 2));// Is there an obstacle on the way?
            }
            else if(this.lastKnownPosX !== null){
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
            let point = this.getClosestPatrolPoint();
            let rightBound = point.posX + point.range;
            let leftBound = point.posX - point.range;

            if(this.entity.facingRight === 1 && rightBound - this.center <= this.tolerance){
                this.entity.facingRight = -1; 
            }
            else if(this.entity.facingRight === -1 && this.center - leftBound <= this.tolerance){
                this.entity.facingRight = 1;  
            }

            let targetEdge = this.entity.facingRight === 1 ? rightBound : leftBound;
            this.move(targetEdge);
        }
        else if(this.currentState === AI_STATE.RETURN){
            this.move(closestPoint.posX);
        }
    }

    update(){
        if(this.entity.isDead){ return;}
        this.think();
        this.act();
    }
}
class PatrolPoint extends GameObject{
    constructor(posX, posY, range){
        super("patrol", posX, posY);
        this.range = range;
        GameManager.addPatrolPoint(this);
    }

}