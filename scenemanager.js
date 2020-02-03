function Background(game, image, lvl) {
    this.game = game;
    this.image = image;
    this.level = lvl;
    this.neighbors = [];
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

    for (var i = 0; i < 5; i++) this.buildLevel(i);
    for (var i = 0; i < 5; i++) {
        this.levels[i].streets[4].neighbors[1] = this.levels[(((i+1)%5)+5)%5].streets[0];
        this.levels[i].streets[0].neighbors[2] = this.levels[(((i-1)%5)+5)%5].streets[4];
    }

    this.activeBG = this.levels[0].streets[0];
    this.start = true;
    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function () {
    if (this.activeBG.removeFromWorld) {
        this.activeBG.removeFromWorld = false;
        this.activeBG = this.nextBG;
        this.game.addEntity(this.activeBG);
        console.log('lvl: ' + (this.activeBG.level + 1));
    }
    if (this.player.removeFromWorld) {
        this.player.removeFromWorld = false;
        this.game.addEntity(this.player);
    }
    if (this.start) {
        this.game.addEntity(this.activeBG);
        this.game.addEntity(this.player);
        this.player.alive = true;
        this.start = false;
    }
    this.checkBounds();
    Entity.prototype.update.call(this);
}

SceneManager.prototype.checkBounds = function () {
    if (this.player.collideLeft() || this.player.collideRight()) {
        if (this.player.collideRight() && this.activeBG.image == './img/Backgrounds/street5.jpg') {
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
        else {
            this.player.velocity.x = -this.player.velocity.x * (1/friction);
            if (this.player.collideLeft()) this.player.x = this.player.radius;
            else this.player.x = 1280 - this.player.radius;
        }
    }
    else if (this.player.collideTop() || this.player.collideBottom()) {
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
        else {
            this.player.velocity.y = -this.player.velocity.y * (1/friction);
            if (this.player.collideTop()) this.player.y = this.player.radius;
            else this.player.y = 720 - this.player.radius;
        }
    }
}

SceneManager.prototype.changeBackground = function (nextBG) {
    this.nextBG = nextBG;
    this.activeBG.removeFromWorld = true;
    this.player.removeFromWorld = true;
}

SceneManager.prototype.buildLevel = function (lvl) {
    this.levels[lvl] = new Level(this.game);

    this.levels[lvl].streets[0] = new Background(this.game, './img/Backgrounds/street1.png', lvl);
    this.levels[lvl].streets[1] = new Background(this.game, './img/Backgrounds/street2.jpg', lvl);
    this.levels[lvl].streets[2] = new Background(this.game, './img/Backgrounds/street3.jpg', lvl);
    this.levels[lvl].streets[3] = new Background(this.game, './img/Backgrounds/street4.jpg', lvl);
    this.levels[lvl].streets[4] = new Background(this.game, './img/Backgrounds/street5.jpg', lvl);

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