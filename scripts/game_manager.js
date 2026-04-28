class GameManager{
    
    player = new Player("player", 0, 0, 100, "./assets/player/player.png");
    current = this.player;

    enemy = new Enemy("enemy", 300, 0, 100, "");

    allEntity = [this.player, this.enemy];

    //Checking inputs
    checkInput(){
        if(keys.KeyR){
            for(let i=0; i<this.allEntity; i++){
                this.allEntity[i].rewind();
                console.log("rewind");
            }
        }
        else{
            if(keys.KeyA){
                this.current.move(-1, 0);
                console.log("left");
            }
            if(keys.KeyD){
                this.current.move(1, 0);
                console.log("right");
            }

            for(let i=0; i<this.allEntity.length; i++){
                this.allEntity[i].saveState();
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

    update(){
        this.checkInput();

    }

    

}




