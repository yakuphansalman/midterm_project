class Camera{

    static move(dx, dy){
        GameManager.allGameObjects.forEach(go => {
            go.move(-dx,-dy);
        });

    }
}