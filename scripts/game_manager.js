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
        // Player: name, posX, posY, health, speedX, damage, attackSpeed, attackRange, visionRange, src
        this.current = new Entity("player", 0, 700, 100, 1.5, 10, 1.0, 10, 150, "./assets/entity/knight");

        // ================= ZEMİN =================
        // Oyuncunun ve düşmanların üzerinde koşacağı tek parça devasa zemin
        new Obstacle(-500, 800, 5000, 300);

        // ================= BÖLGE 1: Parkur ve Küçük Engeller =================
        // Düşmanların sana koşarken çarpıp üstünden zıplayacağı (maksimum 40-60 birimlik) engeller
        new Obstacle(400, 760, 50, 40); // Kısa engel
        new Obstacle(700, 720, 60, 80); // Orta boy basamak
        new Obstacle(760, 760, 150, 40); // Basamağın uzantısı

        // ================= BÖLGE 2: Arena =================
        // Düşmanların devriye atacağı geniş ve düz savaş alanı
        new PatrolPoint(1200, 800, 200); 

        // ================= BÖLGE 3: Düşük Zıplama Terasları =================
        // Karakterlerin az zıplayabildiğini bildiğimiz için aralarındaki yükseklik farkı sadece 80-100 piksel olan platformlar
        new Obstacle(1700, 700, 250, 20); 
        new Obstacle(1850, 600, 250, 20);
        new Obstacle(1700, 500, 250, 20);
        new Obstacle(2000, 420, 350, 20); // Keskin nişancı tepesi (Zirve)

        // ================= BÖLGE 4: Siperler (Trenches) =================
        // Düşmanların arasına saklanacağı ve üstünden zıplayarak sana saldıracağı kısa duvarlar
        new Obstacle(2600, 740, 40, 60);
        new Obstacle(2900, 740, 40, 60);

        // ================= DEVRİYE NOKTALARI =================
        new PatrolPoint(600, 720, 100); // Basamak üstü devriyesi
        new PatrolPoint(1800, 700, 100); // 1. Teras devriyesi
        new PatrolPoint(2150, 420, 150); // Tepe devriyesi
        new PatrolPoint(2750, 800, 100); // İki siper arası devriye

        // ================= DÜŞMANLAR =================
        // ŞARTLAR SAĞLANDI: Tüm düşmanlarda speedX = 1.5 ve attackRange = 10
        // Çeşitlilik için sadece Can, Hasar, Saldırı Hızı ve Görüş Mesafeleri değiştirildi.
        
        // 1. Engel Atlayanlar (Bölge 1 - Engellerin üstünden zıplayarak gelecekler)
        new Entity("enemy", 500, 700, 80, 1.2, 10, 1.0, 10, 300, "./assets/entity/knight");
        
        // 2. Arena Muhafızları (Bölge 2 - Birlikte takılan ikili)
        //new Entity("enemy", 1100, 700, 100, 1.2, 12, 1.2, 10, 200, "./assets/player");
        //new Entity("enemy", 1300, 700, 100, 1.2, 12, 1.2, 10, 200, "./assets/player");

        // 3. Teras Savunmacıları (Bölge 3 - Yüksekten atlayanlar)
        //new Entity("enemy", 1750, 600, 120, 1.2, 15, 0.8, 10, 150, "./assets/player"); // Alt teras
        //new Entity("enemy", 2150, 300, 150, 1.2, 20, 0.5, 10, 450, "./assets/player"); // Tepe (Seni uzaktan görüp merdivenlerden aşağı zıplayarak inecek)

        // 4. Siper Askerleri (Bölge 4 - Siper duvarlarına çarpıp havadan kılıç indirecekler)
        //new Entity("enemy", 2750, 700, 80, 1.2, 15, 1.5, 10, 150, "./assets/player");
        //new Entity("enemy", 3000, 700, 80, 1.2, 15, 1.5, 10, 200, "./assets/player");

        // 5. Boss / Bölüm Sonu Canavarı (Canı çok yüksek, vuruş hızı yavaş ama affetmez)
        //new Entity("enemy", 3400, 700, 400, 1.2, 30, 0.6, 10, 250, "./assets/player");
    }
/*  AI JUMP TEST SCENE*//*
    static initScene(){
        this.current = new Entity("player", 350, 625, 100, 1.5, 10, 1.5, 10, 150, "./assets/player");
        new Entity("player", 350, 700, 100, 1.5, 10, 1.0, 10, 150, "./assets/player");
        new PatrolPoint(350, 700, 250);

        new Obstacle(0, 700, 1000, 20);
        new Obstacle(350, 625, 150, 20);
    }
*/
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




