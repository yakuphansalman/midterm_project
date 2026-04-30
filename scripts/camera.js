class Camera{

    static offsetX = 640.0; 
    static offsetY = 350.0;

    static move(dx, dy){
        GameManager.allGameObjects.forEach(go => {
            go.move(-dx,-dy);
        });

    }
    static focus(entity){
        let posX = entity.posX - this.offsetX;
        let posY = entity.posY - this.offsetY;
        console.log(posX);
        this.move(posX, posY);
    }
}