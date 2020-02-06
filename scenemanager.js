function Background(game, image, lvl) {
    this.game = game;
    this.image = image;
    if (lvl === undefined) this.level = -1;
    else this.level = lvl;
    this.walls = [];
    this.enemies = [];
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

function Arrow(game, manager) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/Arrow.png'), 0, 0, 100, 100, 0.25, 4, true, false);
    this.manager = manager;
    this.rotation = 0;
    Entity.call(this, game, 640, 360);
}

Arrow.prototype = new Entity();
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function () {
    if (this.manager.level.clear) {
        // if (this.manager.activeBG.image == './img/backgrounds/street' + this.manager.level.current + '5.jpg'
        //     || this.manager.activeBG.image == './img/backgrounds/house2.jpg'
        //     || this.manager.activeBG.image == './img/backgrounds/house4.jpg') {
        if (this.manager.activeBG === this.manager.levels[this.manager.level.current].streets[4]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[1]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[3]) {
            this.x = 1200;
            this.y = 360;
            this.rotation = 0;
        }
        // else if (this.manager.activeBG.image == './img/backgrounds/house5.jpg') {
        else if (this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[4]) {
            this.x = 640;
            this.y = 640;
            this.rotation = Math.PI/2;
        }
        // else if (this.manager.activeBG.image == './img/backgrounds/house1.jpg'
        //     || this.manager.activeBG.image == './img/backgrounds/house3.jpg') {
        else if (this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[0]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[2]) {
            this.x = 80;
            this.y = 360;
            this.rotation = Math.PI;
        }
        else {
            this.x = 640;
            this.y = 80;
            this.rotation = -Math.PI/2;
        }
    }
    Entity.prototype.update.call(this);
}

Arrow.prototype.draw = function (ctx) {
    if (this.manager.level.clear)
        this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    Entity.prototype.draw.call(this);
}

function SceneManager(game) {
    this.game = game;
    this.levels = [];
    this.level = { current: 0, clear: false};
    this.menus = {};
    this.player = new Frump(game);
    this.arrow = new Arrow(game, this);

    this.menus.start = new Background(game, './img/Start.png');
    this.menus.win = new Background(game, './img/Victory.png');
    this.menus.lose = new Background(game, './img/GameOver.png');

    for (var i = 0; i < 4; i++) this.buildLevel(i);
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 0, 240, 180));
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 180, 14, 310));
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 607, 14, 113));
    this.levels[0].streets[0].walls.push(new Wall(game, 145, 607, 81, 10));
    this.levels[0].streets[0].walls.push(new Mailbox(game, 200));
    // for (var i = 0; i < this.levels.length; i++) {
    //     for (var j = 0; j < this.levels[i].streets.length; j++) {
    //         for (var k = 0; k < Math.floor(Math.random()*2)+1; k++)
    //             this.levels[i].streets[j].enemies.push(new Thug(this.game, Math.floor(Math.random()*2)));
    //     }
    // }

    this.activeBG = this.menus.start;
    this.start = true;

    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function () {
    if (this.changedBG) this.updateBackground();
    if (this.start) this.startGame();
    if (this.activeBG.level == -1 && this.game.click)
        this.changeBackground(this.levels[0].streets[0]);
    for (var i = this.activeBG.enemies.length - 1; i >= 0; --i) {
        if (this.activeBG.enemies[i].health <= 0) {
            this.activeBG.enemies[i].removeFromWorld = true;
            this.activeBG.enemies.splice(i, 1);
        }
    }
    if (this.levels[this.level.current].houses[4].enemies.length == 0)
        this.level.clear = true;
    if (this.level.clear) {

    }
    this.checkBounds();
    // if (this.player.health.current <= 0) {
    //     for (var i = 0; i < this.activeBG.enemies.length; i++)
    //         this.activeBG.enemies[i].removeFromWorld = true;
    //     this.activeBG.enemies = [];
    //     for (var i = 0; i < Math.floor(Math.random()*2); i++)
    //         this.activeBG.enemies.push(new Thug(this.game));
    //     this.player.x = 65;
    //     this.player.y = 430;
    //     this.player.health.current = this.player.health.max;
    //     this.changeBackground(this.menus.lose);
    // }
    // else if (this.activeBG.enemies.length == 0 && this.activeBG.level != -1) {
    //     for (var i = 0; i < Math.floor(Math.random()*2); i++)
    //         this.activeBG.enemies.push(new Thug(this.game));
    //     this.player.x = 65;
    //     this.player.y = 430;
    //     this.changeBackground(this.menus.win);
    // }
    Entity.prototype.update.call(this);
}

SceneManager.prototype.draw = function(ctx) {
}

SceneManager.prototype.updateBackground = function () {
    // reset entities to NOT remove from world
    this.prevBG.removeFromWorld = false;
    for (var i = 0; i < this.prevBG.walls.length; i++)
        this.prevBG.walls[i].removeFromWorld = false;
    for (var i = 0; i < this.prevBG.enemies.length; i++)
        this.prevBG.enemies[i].removeFromWorld = false;
    this.arrow.removeFromWorld = false;
    this.player.removeFromWorld = false;
    this.player.health.removeFromWorld = false;

    // add entities back into game engine
    this.game.addEntity(this.player);
    if (this.level.clear) this.game.addEntity(this.arrow);
    this.game.addEntity(this.player.health);
    this.changedBG = false;
}

SceneManager.prototype.startGame = function () {
    this.game.addEntity(this.activeBG);
    this.start = false;
}

SceneManager.prototype.checkBounds = function () {
    if (this.player.collideLeft() || this.player.collideRight()) {
        if (this.activeBG.enemies.length == 0) {
            if (this.player.collideRight() && this.level.clear && this.activeBG === this.levels[this.level.current].streets[4]) {
                this.changeBackground(this.levels[this.level.current + 1].streets[0]);
                this.level.current++;
                this.player.x = this.player.y * (16/9);
                this.player.y = 720 - this.player.radius*3;
                var vel = this.player.velocity.x;
                this.player.velocity.x = this.player.velocity.y;
                this.player.velocity.y = -vel;
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
    }
    else if (this.player.collideTop() || this.player.collideBottom()) {
        if (this.activeBG.enemies.length == 0) {
            if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                this.changeBackground(this.activeBG.neighbors[0]);
                this.player.y = 720 - this.player.radius;
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius;
            }
        }
    }
}

SceneManager.prototype.changeBackground = function (nextBG) {
    // remove entities from game engine
    this.prevBG = this.activeBG;
    for (var i = 0; i < this.activeBG.walls.length; i++)
        this.activeBG.walls[i].removeFromWorld = true;
    for (var i = 0; i < this.activeBG.enemies.length; i++)
        this.activeBG.enemies[i].removeFromWorld = true;
    this.activeBG.removeFromWorld = true;
    this.arrow.removeFromWorld = true;
    this.player.removeFromWorld = true;
    this.player.health.removeFromWorld = true;
    this.activeBG = nextBG;

    // add new entities to game engine
    this.game.addEntity(this.activeBG);
    if (this.activeBG.level != -1) {
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.game.addEntity(this.activeBG.walls[i]);
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
    }
    this.changedBG = true;
}

SceneManager.prototype.buildLevel = function (lvl) {
    this.levels[lvl] = { streets: [], houses: [] };

    for (var i = 0; i < 5; i++) {
        this.levels[lvl].streets[i] = new Background(this.game, ('./img/backgrounds/street' + lvl + (Math.floor(Math.random()*3)+1) + '.jpg'), lvl);
        this.levels[lvl].houses[i] = new Background(this.game, ('./img/backgrounds/house' + lvl + (Math.floor(Math.random()*3)+1) + '.jpg'), lvl);
    }

    // this.levels[lvl].streets[0] = new Background(this.game, './img/backgrounds/street1.png', lvl);
    // this.levels[lvl].streets[1] = new Background(this.game, './img/backgrounds/street2.jpg', lvl);
    // this.levels[lvl].streets[2] = new Background(this.game, './img/backgrounds/street3.jpg', lvl);
    // this.levels[lvl].streets[3] = new Background(this.game, './img/backgrounds/street4.jpg', lvl);
    // this.levels[lvl].streets[4] = new Background(this.game, ('./img/backgrounds/street' + lvl + '5.jpg'), lvl);

    // this.levels[lvl].houses[0] = new Background(this.game, './img/backgrounds/house1.jpg', lvl);
    // this.levels[lvl].houses[1] = new Background(this.game, './img/backgrounds/house2.jpg', lvl);
    // this.levels[lvl].houses[2] = new Background(this.game, './img/backgrounds/house3.jpg', lvl);
    // this.levels[lvl].houses[3] = new Background(this.game, './img/backgrounds/house4.jpg', lvl);
    // this.levels[lvl].houses[4] = new Background(this.game, './img/backgrounds/house5.jpg', lvl);

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