var player = new Player("player", 0, 0, 100);
var current = player;

if(keys.A){
    current.move(-1, 0);
}
if(keys.D){
    current.move(1, 0);
}

player.draw();