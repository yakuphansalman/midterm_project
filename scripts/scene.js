    /* Add entities in the scene */
    player = new Player("player", 0, 0, 100, 1.5, "./assets/player/player.png");
    GameManager.current = player;
    new Enemy("enemy", 300, 0, 100, 0.8, "./assets/enemy/enemy.png");
    new Enemy("enemy2", 500, 1, 100, 1, "./assets/enemy/enemy.png");
    /* Add obstacles in the scene */
    new Obstacle(0, 600, 1280, 120);