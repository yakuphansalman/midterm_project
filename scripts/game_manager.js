class GameManager {

    static camera;
    static current;
    
    static allGameObjects = [];
    static allEntities = [];
    static allObstacles = [];
    static allEnemies = [];
    static allPatrolPoints = [];

    static addGameObject(go) {
        this.allGameObjects.push(go);
    }

    static addEntity(entity) {
        this.allEntities.push(entity);
    }
    static addObstacle(obstacle){
        this.allObstacles.push(obstacle);
    }

    static addPatrolPoint(patrolPoint){
        this.allPatrolPoints.push(patrolPoint);
    }

    /* LEVEL_0
    
    static initScene(){
        this.current = new Entity("player", 0, 250, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new PatrolPoint(500, 600, 200);
        new PatrolPoint(1500, 400, 250);
        new Entity("enemy", 150, 600, 100, 1.5, 1.2, 1, 5, 150,"./assets/player");
        new Entity("enemy", 1500, 550, 100, 1.5, 1.2, 1, 5, 150, "./assets/player");
        new Obstacle(0, 600, 5000, 120);
        new Obstacle(0, 250, 200, 200);

        new Obstacle(800, 550, 1000, 70);//Long Obstacle
        //new Obstacle(800, 580, 400, 20);//Short Obstacle

    }
        */

    static initScene(){
        this.current = new Entity("player", 0, 600, 100, 1.5, 10, 1, 55, 150, "./assets/player");

        new Obstacle(-500, 800, 1500, 300);
        new Obstacle(1200, 800, 800, 300);
        new Obstacle(2300, 800, 2000, 300);

        new Obstacle(800, 700, 100, 20);
        new Obstacle(950, 600, 100, 20);
        new Obstacle(1100, 500, 100, 20);

        new Obstacle(1400, 450, 500, 40);
        new Obstacle(1600, 250, 400, 40);
        new Obstacle(2000, 600, 50, 200);

        new Obstacle(2500, 550, 300, 30);
        new Obstacle(2900, 400, 300, 30);
        new Obstacle(3300, 250, 600, 50);

        new PatrolPoint(300, 800, 400);
        new PatrolPoint(1500, 800, 200);
        new PatrolPoint(1650, 450, 200);
        new PatrolPoint(1800, 250, 150);
        new PatrolPoint(2650, 550, 120);
        new PatrolPoint(3050, 400, 120);
        new PatrolPoint(3600, 250, 250);
        new PatrolPoint(3200, 800, 600);

        new Entity("enemy", 300, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 600, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 1400, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 1650, 350, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 1800, 150, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 2650, 450, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 3050, 300, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 3500, 150, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 3700, 150, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 2800, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 3400, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new Entity("enemy", 3900, 700, 100, 1.5, 10, 1, 25, 150, "./assets/player");
    }

    //Checking inputs
    static checkInput() {
        if(this.current.isDead === true){ return;}
        if (keys.KeyR) {
            for (let i = 0; i < this.allEntities.length; i++) {
                this.allEntities[i].rewind();
            }
        } else {
            if (!this.current) return;

            let currentState = this.current.currentState;
            if (currentState === "attack" || currentState === "death") {
                return;
            }

            let isMoving = false;
            /* Movement Controls */
            if (keys.KeyW) {
                this.current.applyForce(0, -1);
                isMoving = true;
            }
            if (keys.KeyS) {
                this.current.applyForce(0, 1);
                isMoving = true;
            }
            if (keys.KeyA) {
                this.current.applyForce(-1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            if (keys.KeyD) {
                this.current.applyForce(1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            if (keys.KeyE) {
                this.current.attack(10.0);
            }
            /* JumpLock prevents constant jumps 
               IsGrounded checks the current character is grounded or not
               Both condition is for jump the character */

            if (keys.Space) {
                if (this.current.physics.isGrounded && !this.current.physics.jumpLock) {
                    this.current.physics.applyForce(0, -10);
                    this.current.changeState("jump");
                    this.current.physics.isGrounded = false;
                }
                this.current.physics.jumpLock = true;
            } else if (!keys.Space) { this.current.physics.jumpLock = false; }

            if (!this.current.physics.isGrounded && currentState !== "jump") {
                this.current.changeState("jump");
            } else if (this.current.physics.isGrounded && this.current.currentState !== "attack" && !this.current.physics.moveable) {
                this.current.changeState("idle");
            }

            for (let i = 0; i < this.allEntities.length; i++) {
                this.allEntities[i].saveState();
            }
            if (keys.KeyZ) {
                let target = this.getClosestVisibleTarget();

                if (target) {
                    this.current = target;
                }

                keys.KeyZ = false;
            }
        }

    }

    static linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        let denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
        if (denominator === 0) return false;

        let ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
        let ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }

    static getDistance(ent1, ent2) {
        let dx = (ent1.posX + ent1.width / 2) - (ent2.posX + ent2.width / 2);
        let dy = (ent1.posY + ent1.height / 2) - (ent2.posY + ent2.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    //Connection Check
    static checkVisibility(ent1, ent2) {
        let pX = ent1.posX + (ent1.width / 2);
        let pY = ent1.posY + (ent1.height / 2);
        let eX = ent2.posX + (ent2.width / 2);
        let eY = ent2.posY + (ent2.height / 2);

        for (let i = 0; i < this.allObstacles.length; i++) {
            let obs = this.allObstacles[i];

            let oX = obs.x !== undefined ? obs.x : obs.posX;
            let oY = obs.y !== undefined ? obs.y : obs.posY;

            let hitTop = this.linesIntersect(pX, pY, eX, eY, oX, oY, oX + obs.width, oY);
            let hitBottom = this.linesIntersect(pX, pY, eX, eY, oX, oY + obs.height, oX + obs.width, oY + obs.height);
            let hitLeft = this.linesIntersect(pX, pY, eX, eY, oX, oY, oX, oY + obs.height);
            let hitRight = this.linesIntersect(pX, pY, eX, eY, oX + obs.width, oY, oX + obs.width, oY + obs.height);

            if (hitTop || hitBottom || hitLeft || hitRight) {
                return false; // no connection
            }
        }
        return true;  // connection
    }

    static getClosestVisibleTarget() {
        let closestTarget = null;
        let minDistance = Infinity;
        let possibleTargets = [];

        for (let i = 0; i < this.allEntities.length; i++) {
            if (this.current !== this.allEntities[i]) {
                possibleTargets.push(this.allEntities[i]);
            }
        }

        for (let i = 0; i < possibleTargets.length; i++) {
            let target = possibleTargets[i];

            if (this.checkVisibility(this.current, target)) {
                let dist = this.getDistance(this.current, target);

                if (dist < minDistance) {
                    minDistance = dist;
                    closestTarget = target;
                }
            }
        }
        return closestTarget;
    }

    static toleratedOverlap(tolerance, entity, target){
        return (this.getDistance(entity, target) < tolerance);
    }
    

    static drawConnectionLine(ctx) {
        let target = this.getClosestVisibleTarget();

        if (target) {
            let pX = this.current.posX + (this.current.width / 2);
            let pY = this.current.posY + (this.current.height / 2);
            let eX = target.posX + (target.width / 2);
            let eY = target.posY + (target.height / 2);
            pX -= Camera.posX; pY -= Camera.posY;
            eX -= Camera.posX; eY -= Camera.posY;

            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(eX, eY);
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    static update(ctx) {
        this.checkInput();
        this.drawConnectionLine(ctx);


        
        this.allEntities.forEach(entity => {
            /* Physics calls */
            entity.physics.update();
            /* AI calls */
            if(entity !== this.current){
                entity.ai.update();
            }

            if (entity.update) {
                entity.update();
            }
            if (entity.draw) {
                entity.draw(ctx);
            }
        });

        if(!this.current.isDead){
            Camera.focus(this.current);
        }
    }



}




