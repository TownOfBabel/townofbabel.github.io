function Frump(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 200, 200, 200, 0.4, 2, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 0, 200, 200, 0.1, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 200, 200, 200, 0.1, 4, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1300, 200, 200, 0.1, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 200, 1300, 200, 300, 0.1, 5, false, false);
    this.anim.knifeIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 600, 200, 200, 0.4, 2, true, false);
    this.anim.knifeMove = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 400, 200, 200, 0.1, 8, true, false);
    this.anim.knifeAtk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 600, 200, 200, 0.05, 4, false, false);
    this.anim.swordIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1000, 200, 200, 0.4, 2, true, false);
    this.anim.swordMove = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 800, 200, 200, 0.1, 8, true, false);
    this.anim.swordAtk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 1000, 200, 300, 0.1, 5, false, false);

    // Properties
    this.player = true;
    this.alive = true;
    this.radius = 24;
    this.faces = 20;
    this.sides = 38;
    this.range = 50;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 500;
    this.weapon = 'unarmed';
    this.health = 10;
    this.atkCD = 0;
    this.hitTime = 0;
    this.canBeHit = 0;

    Entity.call(this, game, 65, 430);
}

Frump.prototype = new Entity();
Frump.prototype.constructor = Frump;

Frump.prototype.update = function () {
    // Player faces mouse pointer
    this.rotation = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);

    if (this.atkCD > 0) this.atkCD--;
    if (this.hitTime > 0) this.hitTime--;
    if (this.canBeHit > 0) this.canBeHit--;

    // Determines current weapon (will be replaced)
    if (this.game.player.shift && this.game.player.space) {
        this.game.player.shift = false;
        this.game.player.space = false;
    }
    if (this.game.player.shift) this.weapon = 'knife';
    else if (this.game.player.space) this.weapon = 'sword';
    else this.weapon = 'unarmed';

    // Check for attack + update range
    if (this.game.click && this.atkCD == 0) {
        this.attacking = true;
        if (this.weapon == 'knife') {
            this.hitTime = 18;
            this.range = 70;
        }
        else if (this.weapon == 'sword') {
            this.hitTime = 24;
            this.range = 110;
        }
        else {
            this.hitTime = 21;
            this.range = 50;
        }
    }

    // Update animations
    if (this.hurt && this.anim.hit.isDone()) {
        this.anim.hit.elapsedTime = 0;
        this.hurt = false;
    }
    if (this.attacking) {
        if (this.weapon == 'unarmed' && this.anim.atk.isDone()) {
            this.anim.atk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 30;
        }
        else if (this.weapon == 'knife' && this.anim.knifeAtk.isDone()) {
            this.anim.knifeAtk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 9;
        }
        else if (this.weapon == 'sword' && this.anim.swordAtk.isDone()) {
            this.anim.swordAtk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 18;
        }
    }

    // Wall collisions and enemy hurtbox collisions
    // - normal collisions with enemy controlled by enemy
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
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
        else if (ent.enemy) {
            if (this.attacking && ent.canBeHit <= 0 && this.hit(ent) && this.hitTime > 0 && this.hitTime <= 12) {
                ent.hurt = true;
                ent.health--;
                ent.canBeHit = 18;
            }
        }
    }

    // User control
    if (this.game.player.up) this.velocity.y -= this.acceleration;
    if (this.game.player.down) this.velocity.y += this.acceleration;
    if (this.game.player.left) this.velocity.x -= this.acceleration;
    if (this.game.player.right) this.velocity.x += this.acceleration;

    // Boundary collisions
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

    // Speed control
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

Frump.prototype.draw = function (ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    else if (this.attacking) {
        if (this.weapon == 'knife') this.anim.knifeAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.weapon == 'sword') this.anim.swordAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else {
        if (this.game.player.up || this.game.player.left || this.game.player.down || this.game.player.right) {
            if (this.weapon == 'knife') this.anim.knifeMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'sword') this.anim.swordMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
        else {
            if (this.weapon == 'knife') this.anim.knifeIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon == 'sword') this.anim.swordIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
    }
    Entity.prototype.draw.call(this);
}

Frump.prototype.hit = function (other) {
    var rotdif = 0;
    if (other.rotation < this.rotation) rotdif = this.rotation - other.rotation;
    else rotdif = other.rotation - this.rotation;

    if (this.weapon == 'sword' && rotdif > Math.PI/2 && rotdif < Math.PI*3/4)
        return distance(this, other) < this.range + other.faces;
    else if (rotdif > Math.PI*3/4 && rotdif < Math.PI*5/4)
        return distance(this, other) < this.range + other.faces;
    else
        return false;
}