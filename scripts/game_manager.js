class GameManager{
    
    static current;
    
    static allEntities = [];

    static allObstacles = [];

    static addEntity(entity){
        this.allEntities.push(entity);
    }

    
    static addObstacle(obstacle){
        this.allObstacles.push(obstacle);
    }

    //Checking inputs
    static checkInput(){
        if(keys.KeyR){
            for(let i=0; i<this.allEntities.length; i++){
                this.allEntities[i].rewind();
            }
            console.log("rewind");
            
        }
        else{
            if(keys.KeyA){
                this.current.applyForce(-1,0);
                //this.current.move(-1, 0);
                console.log(this.current.posX);
            }
            if(keys.KeyD){
                this.current.applyForce(1,0);
                //this.current.move(1, 0);
                console.log(this.current.posX);
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
        }

        if(keys.KeyZ){
            if(this.checkConnection()){
                if(this.current === this.player){
                    // Current player to enemy
                    this.current = this.enemy;
                }
                else{ // Current enemy to player
                    this.current = this.player;
                }
            }

            // Force the key state to "unpressed" after the action is completed.
            // This prevents the code from running repeatedly until the player releases and presses the key again.
            keys.KeyZ = false;
        }

    }

    linesIntersect(pX, pY, eX, eY, obsX, obsY, obsXe, obsYe) {
        let det = (eX - pX) * (obsYe - obsY) - (obsXe - obsX) * (eY - pY);
        if (det === 0) return false;
        let lambda = ((obsYe - obsY) * (obsXe - pX) + (obsX - obsXe) * (obsYe - pY)) / det;
        let gamma = ((pY - eY) * (obsXe - pX) + (eX - pX) * (obsYe - pY)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }

    //Connection Check
    checkConnection(){
        // Center points of characters
        let pX = this.player.posX + (this.player.width / 2);
        let pY = this.player.posY + (this.player.height / 2);
        let eX = this.enemy.posX + (this.enemy.width / 2);
        let eY = this.enemy.posY + (this.enemy.height / 2);        

        for(let i=0; i<this.obstacles.length; i++){
            let obs = this.obstacles[i];

            //Obstacle edge checks
            let hitTop = this.linesIntersect(pX, pY, eX, eY, obs.x, obs.y, obs.x + obs.width, obs.y);
            let hitBottom = this.linesIntersect(pX, pY, eX, eY, obs.x, obs.y + obs.height, obs.x + obs.width, obs.y + obs.height);
            let hitLeft = this.linesIntersect(pX, pY, eX, eY, obs.x, obs.y, obs.x, obs.y + obs.height);
            let hitRight = this.linesIntersect(pX, pY, eX, eY, obs.x + obs.width, obs.y, obs.x + obs.width, obs.y + obs.height);

            if (hitTop || hitBottom || hitLeft || hitRight){
            return false; // No connection
            }
        }

        
        return true;  // Conneciton
        
    }

    static update(){
        this.checkInput();
        
        /* Physics calls */

        this.allEntities.forEach(entity => {
            entity.physics.update();
        });
    }

    

}




