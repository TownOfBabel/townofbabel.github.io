function Background(game, image) {
    this.image = ASSET_MANAGER.getAsset(image);
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0);
    Entity.prototype.draw.call(this);
}

function Health(game, hp) {
    this.heart = ASSET_MANAGER.getAsset('./img/Health.png');
    this.max = hp;
    this.current = hp;
    Entity.call(this, game, 0, 0);
}

Health.prototype = new Entity();
Health.prototype.constructor = Health;

Health.prototype.update = function () {

    Entity.prototype.update.call(this);
}

Health.prototype.draw = function (ctx) {

    Entity.prototype.draw.call(this);
}

function Frump(game) {
    this.idle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 200, 200, 200, 0.4, 2, true, false);
    this.walk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 0, 200, 200, 0.1, 8, true, false);
    this.hurting = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1300, 200, 200, 0.1, 1, false, false);
    this.attack = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 200, 200, 200, 0.1, 4, false, false);
    this.deathAnim = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 200, 1300, 200, 300, 0.1, 5, false, false);
    this.knifeWalk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 400, 200, 200, 0.1, 8, true, false);
    this.knifeIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 600, 200, 200, 0.4, 2, true, false);
    this.knifeAttack = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 600, 200, 200, 0.05, 4, false, false);
    this.swordWalk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 800, 200, 200, 0.1, 8, true, false);
    this.swordIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1000, 200, 200, 0.4, 2, true, false);
    this.swordAttack = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 1000, 200, 300, 0.1, 5, false, false);

    this.sides = 38;
    this.faces = 20;
    this.radius = 24;
    this.range = 58;
    this.player = true;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 100;
    this.maxSpeed = 250;
    this.attackTimer = 0;
    this.hitTimer = 0;
    this.hit = false;

    //new stuff
    this.alive = false;
    this.health = new Health(game, 5);
    game.addEntity(this.health);
    this.weapon = 'unarmed';
    this.start = new Background(game, './img/Start.png');
    this.victory = new Background(game, './img/Victory.png');
    this.gameover = new Background(game, './img/GameOver.png');
    this.start.show = true;
    Entity.call(this, game, 65, 430);
}

Frump.prototype = new Entity();
Frump.prototype.constructor = Frump;

Frump.prototype.update = function () {
    if (!this.alive && this.start.show) {
        this.game.addEntity(this.start);
        this.start.show = false;
    }
    if (!this.alive && this.game.clickmouse) {
        this.alive = true;
        this.start.removeFromWorld = true;
        this.victory.removeFromWorld = true;
        this.gameover.removeFromWorld = true;
    }
    // console.log('P: ' + this.health);
    if (this.alive) {
        console.log(this.health.current);
        if (this.health.current <= 0) {
            this.dying = true;
            this.health.current = 5;
        }
        if (this.winTimer > 0) this.winTimer--;
        if (this.attackTimer > 0) this.attackTimer--;
        if (this.hitTimer > 0) this.hitTimer--;
        if (this.hitTimer == 0) this.hit = false;
        if (this.game.shift && this.game.space) {
            this.game.shift = false;
            this.game.space = false;
        }
        if (this.game.shift) this.weapon = 'knife';
        if (this.game.space) this.weapon = 'sword';
        if (!this.game.shift & !this.game.space) this.weapon = 'unarmed';
        if (this.game.clickmouse && this.attackTimer == 0) {
            this.attacking = true;
            if (this.weapon == 'unarmed') this.attackTimer = 109;
            else if (this.weapon = 'knife') this.attackTimer = 106;
            else this.attackTimer = 112;
        }
        if (this.winTimer == 0 && this.win) {
            this.alive = false;
            this.weapon = 'unarmed';
            this.x = 65;
            this.y = 430;
            var enemies = Math.floor(Math.random()*2+1);
            for (var j = 0; j < enemies; j++) this.game.addEntity(new Enemy(this.game));
            this.victory.removeFromWorld = false;
            this.game.addEntity(this.victory);
            this.win = false;
        }
        if (this.dying) {
            if (this.deathAnim.isDone()) {
                this.deathAnim.elapsedTime = 0;
                this.gameover.show = true;
                this.alive = false;
                this.dying = false;
                this.x = 65;
                this.y = 430;
                this.weapon = 'unarmed';
                for (var i = 0; i < this.game.entities.length; i++) {
                    var ent = this.game.entities[i];
                    if (ent.enemy) ent.removeFromWorld = true;
                }
                var enemies = Math.floor(Math.random()*2+1);
                for (var j = 0; j < enemies; j++) this.game.addEntity(new Enemy(this.game));
                this.gameover.removeFromWorld = false;
                this.game.addEntity(this.gameover);
            }
        }
        if (this.hit) {
            if (this.hurting.isDone()) {
                this.hurting.elapsedTime = 0;
                this.hit = false;
            }
        }
        if (this.attacking) {
            if(this.weapon == 'unarmed') {
                this.range = 50;
                if (this.attack.isDone()) {
                    this.attack.elapsedTime = 0;
                    this.attacking = false;
                    this.attackTimer = 30;
                }
            }
            if(this.weapon == 'knife') {
                this.range = 70;
                if (this.knifeAttack.isDone()) {
                    this.knifeAttack.elapsedTime = 0;
                    this.attacking = false;
                    this.attackTimer = 9;
                }
            }
            if(this.weapon == 'sword') {
                this.range = 110;
                if (this.swordAttack.isDone()) {
                    this.swordAttack.elapsedTime = 0;
                    this.attacking = false;
                    this.attackTimer = 18;
                }
            }        
        }

        if (this.game.up) this.velocity.y -= this.acceleration;
        if (this.game.down) this.velocity.y += this.acceleration;
        if (this.game.left) this.velocity.x -= this.acceleration;
        if (this.game.right) this.velocity.x += this.acceleration;

        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * (1/friction);
            if (this.collideLeft()) this.x = this.radius;
            else this.x = 1280 - this.radius;
        }
        else if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * (1/friction);
            if (this.collideTop()) this.y = this.radius;
            else this.y = 720 - this.radius;
        }

        var enemies = 0;
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.enemy) {
                enemies++;
                if (this.attacking && this.hurt(ent) && this.attackTimer <= 100 && this.attackTimer >= 88 && ent.hitTimer == 0) {
                    ent.health--;
                    ent.hit = true;
                    if (this.weapon == 'knife') ent.hitTimer = 12;
                    else if (this.weapon == 'unarmed') ent.hitTimer = 30;
                    else ent.hitTimer = 32;
                }
            }
            if (ent.wall) {
                if (this.collide(ent)) {
                    if (this.side == 'left' || this.side == 'right') {
                        this.velocity.x = -this.velocity.x * (1/friction);
                        if (this.side == 'left') this.x = ent.x - this.radius;
                        else this.x = ent.x+ent.w + this.radius;
                    }
                    else if (this.side == 'top' || this.side == 'bottom') {
                        this.velocity.y = -this.velocity.y * (1/friction);
                        if (this.side == 'top') this.y = ent.y - this.radius;
                        else this.y = ent.y+ent.h + this.radius;
                    }
                }
            }
        }
        if (enemies == 0 && !this.win) {
            this.winTimer = 90;
            this.win = true;
        }

        var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        this.velocity.x -= friction * this.game.clockTick * this.velocity.x;
        this.velocity.y -= friction * this.game.clockTick * this.velocity.y;
    }
    Entity.prototype.update.call(this);
}

Frump.prototype.draw = function (ctx) {
    if (this.alive) {
        this.rotation = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
        if (this.dying) this.deathAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.hit) this.hurting.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.attacking) {
            if (this.weapon == 'unarmed') this.attack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'knife') this.knifeAttack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'sword') this.swordAttack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
        else {
            if (this.game.up || this.game.left || this.game.down || this.game.right) {
                if (this.weapon == 'unarmed') this.walk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
                else if (this.weapon == 'knife') this.knifeWalk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
                else if (this.weapon == 'sword') this.swordWalk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            }
            else {
                if (this.weapon == 'unarmed') this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
                else if (this.weapon == 'sword') this.swordIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
                else if (this.weapon == 'knife') this.knifeIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            }
        }
    }
    Entity.prototype.draw.call(this);
}
