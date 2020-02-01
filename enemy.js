function Enemy(game) {
    this.walk = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 0, 200, 200, 0.12, 8, true, false);
    this.idle = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 0, 200, 200, 0.12, 1, true, false);
    this.hurting = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 700, 200, 200, 0.1, 1, false, false);
    this.knifeAttack = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 600, 200, 200, 0.1, 4, false, false);
    this.swordIdle = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 200, 200, 200, 0.12, 1, true, false);
    this.swordWalk = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 200, 200, 200, 0.12, 8, true, false);
    this.swordAttack = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 400, 200, 300, 0.15, 5, false, false);
    this.swordHurt = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 200, 700, 200, 200, 0.1, 1, false, false);

    var weapon = ['knife', 'sword'];
    this.weapon = weapon[Math.floor(Math.random()*weapon.length)];
    if (this.weapon == 'knife') this.faces = 20;
    else if (this.weapon == 'sword') this.faces = 28;
    this.sides = 38;
    this.radius = 24;
    this.rotation = Math.random()*(2*Math.PI)-Math.PI;
    this.range = 70;
    this.hit = false;
    this.attackTimer = 0;
    this.hitTimer = 0;
    this.enemy = true;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 100;
    this.maxSpeed = 125;
    this.health = 5;

    
    Entity.call(this, game, Math.random()*(830-410)+410, Math.random()*(670-50)+50);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    // console.log('E: ' + this.health);
    if (this.health <= 0) {
        this.removeFromWorld = true;
    }
    if (this.attackTimer > 0) this.attackTimer--;
    if (this.hitTimer > 0) this.hitTimer--;
    if (this.hitTimer == 0) this.hit = false;
    if (this.hit) {
        if (this.weapon == 'knife' && this.hurting.isDone()) {
            this.hurting.elapsedTime = 0;
            this.hit = false;
        }
        if (this.weapon == 'sword' && this.swordHurt.isDone()) {
            this.swordHurt.elapsedTime = 0;
            this.hit = false;
        }
    }
    if (this.attacking) {
        if (this.weapon == 'knife') {
            this.range = 70;
            if (this.knifeAttack.isDone()) {
                this.knifeAttack.elapsedTime = 0;
                this.attacking = false;
                this.attackTimer = 60;
            }
        }
        else if (this.weapon == 'sword') {
            this.range = 110;
            if (this.swordAttack.isDone()) {
                this.swordAttack.elapsedTime = 0;
                this.attacking = false;
                this.attackTimer = 90;
            }
        }
    }

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * (1/friction);
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 1280 - this.radius;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * (1/friction);
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 720 - this.radius;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.player && ent.alive) {
            if (distance(this, ent.x, ent.y) < 250) {
                this.rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
                var difX = Math.cos(this.rotation);
                var difY = Math.sin(this.rotation);
                var delta = this.radius + ent.radius - distance(this, ent.x, ent.y);
                if (this.collide(ent)) {
                    this.velocity.x = -this.velocity.x * (1/friction);
                    this.velocity.y = -this.velocity.y * (1/friction);
                    this.x -= difX * delta/2;
                    this.y -= difY * delta/2;
                    ent.x += difX * delta/2;
                    ent.y += difY * delta/2;

                }
                else {
                    this.velocity.x += difX * this.acceleration;
                    this.velocity.y += difY * this.acceleration;
                }
                if (this.weapon == 'knife' && distance(this, ent.x, ent.y) < 80 && this.attackTimer == 0) {
                    this.attacking = true;
                    this.attackTimer = 112;
                }
                else if (this.weapon == 'sword' && distance(this, ent.x, ent.y) < 120 && this.attackTimer == 0) {
                    this.attacking = true;
                    this.attackTimer = 118;
                }
                if (this.attacking && this.hurt(ent) && this.attackTimer <= 100 && this.attackTimer >= 88 && ent.hitTimer == 0) {
                    ent.health.current--;
                    ent.hit = true;
                    ent.hitTimer = 15;
                }
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

    Entity.prototype.update.call(this);
}

Enemy.prototype.draw = function (ctx) {
    if (this.hit) {
        if (this.weapon == 'knife') this.hurting.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.weapon == 'sword') this.swordHurt.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else if (this.attacking) {
        if (this.weapon == 'knife') this.knifeAttack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.weapon == 'sword') this.swordAttack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5) {
            if (this.weapon == 'knife') this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'sword') this.swordIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
        else {
            if (this.weapon == 'knife') this.walk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'sword') this.swordWalk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
    }
    Entity.prototype.draw.call(this);
}