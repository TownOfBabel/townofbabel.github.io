function Background(game, image, lvl) {
    this.game = game;
    this.image = image;
    this.level = lvl;
    this.walls = [];
    this.enemies = [];
    this.neighbors = [];
    this.numEnemies = 0;
    this.radius = 0;
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}
 
Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), 0, 0);
    Entity.prototype.draw.call(this);
}

function Wall(game, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.wall = true;
    Entity.call(this, game, x, y);
}

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;

Wall.prototype.update = function () {
}

Wall.prototype.draw = function (ctx) {
}

function Level(game) {
    this.game = game;
    this.streets = [];
    this.houses = [];
    //Entity.call(this, game, 0, 0);
}

Level.prototype = new Entity();
Level.prototype.constructor = Level;

Level.prototype.update = function () {
}

Level.prototype.draw = function (ctx) {
}

function SceneManager(game) {
    this.game = game;
    this.levels = [];
    this.player = new Frump(game);

    for (var i = 0; i < 4; i++) this.buildLevel(i);
    for (var i = 0; i < 4; i++) {
        this.levels[i].streets[4].neighbors[1] = this.levels[(((i+1)%4)+4)%4].streets[0];
        this.levels[i].streets[0].neighbors[2] = this.levels[(((i-1)%4)+4)%4].streets[4];
    }
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 0, 240, 180));
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 180, 14, 310));
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 607, 14, 113));
    this.levels[0].streets[0].walls.push(new Wall(game, 145, 607, 81, 10));
    this.levels[0].streets[0].walls.push(new Mailbox(game, 200));
    this.levels[0].streets[0].enemies.push(new Thug(game));
    //this.levels[0].streets[0].enemies.push(new Thug(game));

    this.activeBG = this.levels[0].streets[0];
    this.start = true;

    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function () {
    if (this.changedBG) {
        this.activeBG.removeFromWorld = false;
        for (var i = 0; i < this.activeBG.walls.length; i++) {
            this.activeBG.walls[i].removeFromWorld = false;
        }
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.activeBG.enemies[i].removeFromWorld = false;
        this.player.removeFromWorld = false;
        this.activeBG = this.nextBG;
        this.game.addEntity(this.activeBG);
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.game.addEntity(this.activeBG.walls[i]);
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
        this.game.addEntity(this.player);
        this.changedBG = false;
    }
    if (this.start) {
        this.game.addEntity(this.activeBG);
        for (var i = 0; i < this.levels[0].streets[0].walls.length; i++)
            this.game.addEntity(this.levels[0].streets[0].walls[i]);
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
        this.game.addEntity(this.player);
        this.player.alive = true;
        this.start = false;
    }
    this.checkBounds();
    Entity.prototype.update.call(this);
}

SceneManager.prototype.checkBounds = function () {
    if (this.player.collideLeft() || this.player.collideRight()) {
        if (this.activeBG.numEnemies == 0) {
            if (this.player.collideRight() && this.activeBG.image == './img/Backgrounds/street'+this.activeBG.level+'5.jpg') {
                this.changeBackground(this.activeBG.neighbors[1]);
                this.player.x = this.player.y * (16/9);
                this.player.y = 720 - this.player.radius*3;
            }
            else if (this.player.collideLeft() && this.activeBG.neighbors[3]) {
                this.changeBackground(this.activeBG.neighbors[3]);
                this.player.x = 1280 - this.player.radius;
            }
            else if (this.player.collideRight() && this.activeBG.neighbors[1]) {
                this.changeBackground(this.activeBG.neighbors[1]);
                this.player.x = this.player.radius;
            }
        }
        // else {
        //     this.player.velocity.x = -this.player.velocity.x * (1/friction);
        //     if (this.player.collideLeft()) this.player.x = this.player.radius;
        //     else this.player.x = 1280 - this.player.radius;
        // }
    }
    else if (this.player.collideTop() || this.player.collideBottom()) {
        if (this.activeBG.numEnemies == 0) {
            if (this.player.collideBottom() && this.activeBG.image == './img/Backgrounds/street1.png') {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.x * (9/16);
                this.player.x = 1280 - this.player.radius*3;
            }
            else if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                this.changeBackground(this.activeBG.neighbors[0]);
                this.player.y = 720 - this.player.radius;
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius;
            }
        }
        // else {
        //     this.player.velocity.y = -this.player.velocity.y * (1/friction);
        //     if (this.player.collideTop()) this.player.y = this.player.radius;
        //     else this.player.y = 720 - this.player.radius;
        // }
    }
}

SceneManager.prototype.changeBackground = function (nextBG) {
    this.nextBG = nextBG;
    for (var i = 0; i < this.activeBG.walls.length; i++)
        this.activeBG.walls[i].removeFromWorld = true;
    for (var i = 0; i < this.activeBG.enemies.length; i++)
        this.activeBG.enemies[i].removeFromWorld = true;
    this.activeBG.removeFromWorld = true;
    this.player.removeFromWorld = true;
    this.changedBG = true;
}

SceneManager.prototype.buildLevel = function (lvl) {
    this.levels[lvl] = new Level(this.game);

    this.levels[lvl].streets[0] = new Background(this.game, './img/Backgrounds/street1.png', lvl);
    this.levels[lvl].streets[1] = new Background(this.game, './img/Backgrounds/street2.jpg', lvl);
    this.levels[lvl].streets[2] = new Background(this.game, './img/Backgrounds/street3.jpg', lvl);
    this.levels[lvl].streets[3] = new Background(this.game, './img/Backgrounds/street4.jpg', lvl);
    this.levels[lvl].streets[4] = new Background(this.game, ('./img/Backgrounds/street' + lvl + '5.jpg'), lvl);

    this.levels[lvl].houses[0] = new Background(this.game, './img/Backgrounds/house1.jpg', lvl);
    this.levels[lvl].houses[1] = new Background(this.game, './img/Backgrounds/house2.jpg', lvl);
    this.levels[lvl].houses[2] = new Background(this.game, './img/Backgrounds/house3.jpg', lvl);
    this.levels[lvl].houses[3] = new Background(this.game, './img/Backgrounds/house4.jpg', lvl);
    this.levels[lvl].houses[4] = new Background(this.game, './img/Backgrounds/house5.jpg', lvl);

    this.levels[lvl].streets[0].neighbors[0] = this.levels[lvl].streets[1];
    this.levels[lvl].streets[0].neighbors[1] = this.levels[lvl].houses[0];
    this.levels[lvl].houses[0].neighbors[3] = this.levels[lvl].streets[0];
    for (var i = 1; i < 4; i++) {
        this.levels[lvl].streets[i].neighbors[0] = this.levels[lvl].streets[(i+1)];
        this.levels[lvl].streets[i].neighbors[2] = this.levels[lvl].streets[(i-1)];
        if (i == 2) {
            this.levels[lvl].streets[i].neighbors[1] = this.levels[lvl].houses[i];
            this.levels[lvl].houses[i].neighbors[3] = this.levels[lvl].streets[i];
        }
        else {
            this.levels[lvl].streets[i].neighbors[3] = this.levels[lvl].houses[i];
            this.levels[lvl].houses[i].neighbors[1] = this.levels[lvl].streets[i];
        }
    }
    this.levels[lvl].streets[4].neighbors[0] = this.levels[lvl].houses[4];
    this.levels[lvl].streets[4].neighbors[2] = this.levels[lvl].streets[3];
    this.levels[lvl].houses[4].neighbors[2] = this.levels[lvl].streets[4];
}

SceneManager.prototype.draw = function(ctx) {
}