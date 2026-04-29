class GameManager{
    
    static current;
    
    static allGameObjects = [];
    static allEntities = [];
    static allObstacles = [];
    static allEnemies = [];

    static player;

    static addGameObject(go){
        this.allGameObjects.push(go);
    }

    static addEntity(entity){
        this.allEntities.push(entity);
    }

    static addEnemy(enemy){
        this.allEnemies.push(enemy);
    }
    
    static addObstacle(obstacle){
        this.allObstacles.push(obstacle);
    }

    
    static initScene(){
        this.player = new Player("player", 0, 0, 100, 1.5, "./assets/player/player.png");
        this.current = this.player;
        this.enemy = new Enemy("enemy", 300, 0, 100, 0.8, "./assets/enemy/enemy.png");
        new Enemy("enemy2", 500, 1, 100, 1, "./assets/enemy/enemy.png");
        
        new Obstacle(0, 600, 1280, 120);
        new Obstacle(500, 400, 500, 320);
        new Obstacle(0, 250, 200, 200);

    }

    //Checking inputs
    static checkInput(){
        if(keys.KeyR){
            for(let i=0; i<this.allEntities.length; i++){
                this.allEntities[i].rewind();
            }
            
        }
        else{
            if(keys.KeyA){
                this.current.applyForce(-1,0);
            }
            if(keys.KeyD){
                this.current.applyForce(1,0);
            }
            if(keys.KeyW){
                this.current.applyForce(0,-1);
            }
            if(keys.KeyS){
                this.current.applyForce(0,1);
            }

            for(let i=0; i<this.allEntities.length; i++){
                this.allEntities[i].saveState();
            }
            if(keys.KeyZ){
            let target = this.getClosestVisibleTarget();
            
            if(target){
                this.current = target;
            }

            keys.KeyZ = false;
        }
        }

        /* CAMERA */

        if(keys.ArrowLeft){
            console.log("CAMERA LEFT");
            Camera.move(-0.5, 0);
        }
        if(keys.ArrowRight){
            Camera.move(0.5, 0);
        }
        if(keys.ArrowUp){
            Camera.move(0, 0.5);
        }
        if(keys.ArrowDown){
            Camera.move(0, -0.5);
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

        if (this.current !== this.player) {
            possibleTargets.push(this.player);
        }
        for (let i = 0; i < this.allEnemies.length; i++) {
            if (this.current !== this.allEnemies[i]) {
                possibleTargets.push(this.allEnemies[i]);
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

    

    static drawConnectionLine(ctx) {
        let target = this.getClosestVisibleTarget();

        if (target) {
            let pX = this.current.posX + (this.current.width / 2);
            let pY = this.current.posY + (this.current.height / 2);
            let eX = target.posX + (target.width / 2);
            let eY = target.posY + (target.height / 2);

            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(eX, eY);
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    static update(ctx){
        this.checkInput();
        this.drawConnectionLine(ctx);

        /* Physics calls */

        this.allEntities.forEach(entity => {
            
            entity.physics.update();
        });
    }

    

}




