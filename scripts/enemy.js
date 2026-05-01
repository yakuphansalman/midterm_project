const AI_STATE = {
    PATROL: 'PATROL',
    RETURN: 'RETURN'
};

class Enemy extends Entity{
    constructor(name, x, y, health, speedX, patrolRange, src){
        super(name, x, y, health, speedX);
        this.img.src = src;
        this.width = 40;
        this.height = 43;
        GameManager.addGameObject(this);
        GameManager.addEntity(this);
        GameManager.addEnemy(this);
        
        // Constructor sets posY same as obstacles so this line aligns the object.
        this.posY -= this.height;
        this.patrolPoint = new PatrolPoint("enemy_pp", this.posX, this.posY);
        this.patrolRange = patrolRange;

        this.currentState = AI_STATE.PATROL;
        this.stuckTimer = 0; 
        this.stuckCounter = 0;
    }

    // AI

    // Except exact position control, tolerated control runs smooth
    checkPosToleratad(tol, position){
        if(this.posX < (position + tol) && this.posX > (position - tol)){
            return true;
        }
        return false;
    }
    patrolPoint;
    betweenPatrolPoints(){
        if(this.posX < this.patrolPoint.posX + this.patrolRange && this.posX > this.patrolPoint.posX - this.patrolRange){
            return true;
        }
        return false;
    }
    changePatrolPoint(){
        let deltas = [];
        for(let i = 0;i < GameManager.allPatrolPoints.length; i++){
            let point = GameManager.allPatrolPoints[i];
            let delta = Math.abs((point.posX - this.posX)**2 + (point.posY - this.posY)**2);
            deltas[i] = delta;
        }
        
        let minIndex = Math.min(...deltas);
        this.patrolPoint = GameManager.allPatrolPoints[minIndex];
    }

    // Patrol: state_0
    patrol(){
        this.stuckCounter = 0;
        if(this.checkPosToleratad(1.0, this.patrolPoint.posX + this.facingRight*this.patrolRange)){
            this.facingRight *=-1;
        }
    }


    // BackToPatrol: state_1
    backToPatrol(){
        // Change direction to patrolPos
        let delta = this.patrolPoint.posX - this.posX;
        if(delta*this.facingRight < 0){ this.facingRight*=-1; }

        // This block checks the entity is stuck or not
        let duration = 3000;
        let stuck = Date.now() > this.stuckPoint + duration;

        // Is there an obstacle on the way?
        // Is it at left or right?
        let collision = this.physics.collisionDir === 0 || this.physics.collisionDir === 1;
        if(collision && stuck){
            this.applyForce(0, -15.0);
            this.stuckPoint = Date.now();
            this.stuckCounter++;
        }
        console.log(this.stuckCounter);

        // If counter reach the limit change the patrol point
        let stuckLimit = 3;
        if(this.stuckCounter >= 3){
            this.changePatrolPoint();
        }
    }

    // Enemies have not input events, so we have to update
    update(){
        if(this === GameManager.current){ this.currentState = -1; return;}
        this.applyForce(this.speedX*this.facingRight, 0);

        //else
        if(this.checkPosToleratad(2.0, this.patrolPoint.posX)){
            this.currentState = 0;
        }
        
        //else
        if(!this.betweenPatrolPoints()){
            this.currentState = -1;
        }


        if(this.currentState === 0){
            this.patrol(50.0);
        }
        else if(this.currentState === -1){
            this.backToPatrol();
        }
    }
}

class PatrolPoint extends GameObject{
    constructor(name, x, y){
        super(name, x, y);
        GameManager.addPatrolPoint(this);
    }
}