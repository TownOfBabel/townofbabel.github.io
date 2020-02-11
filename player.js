function Health(game, hp) {
    this.health = [];
    this.rotation = 0;
    for (var i = 0; i <= hp; i++) {
        this.health[i] = new Animation(ASSET_MANAGER.getAsset('./img/HealthBig.png'), 0, 400 - i*20, 200, 20, 1, 1, true, false);
    }
    this.max = hp;
    this.current = hp;
    Entity.call(this, game, 105, 15);
}

Health.prototype = new Entity();
Health.prototype.constructor = Health;

Health.prototype.update = function () {
}

Health.prototype.draw = function (ctx) {
    if (this.current < 0) this.health[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else this.health[this.current].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    Entity.prototype.draw.call(this);
}

function calcDmg(weapon) {
    switch (weapon.rarity) {
        case 0:
            weapon.damage = 20;
            break;
        case 1:
            weapon.damage = 25;
            break;
        case 2:
            weapon.damage = 40;
            break;
        case 3:
            weapon.damage = 60;
            break;
        default:
            weapon.damage = 1;
    }
}

function Weapon(game, rarity) {
    this.hidden = true;
    this.type = 'unarmed';
    this.rarity = rarity;
    this.floating = true;
    this.range = 55;
    calcDmg(this);
    this.radius = 0;

    Entity.call(this, game, 640, 360);
}

Weapon.prototype = new Entity();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Weapon.prototype.draw = function (ctx) {
    if (this.hidden) {}
    else if (this.floating) this.animated.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else ctx.drawImage(this.static, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Knife(game, rarity) {
    this.hidden = true;
    this.type = 'knife';
    this.rarity = rarity;
    this.floating = true;
    this.range = 70;
    calcDmg(this);

    this.static = ASSET_MANAGER.getAsset('./img/bat_drop.png');
    this.animated = new Animation(ASSET_MANAGER.getAsset('./img/bat_drop.png'), 0, 0, 33, 33, 1, 1, true, false);

    Entity.call(this, game, 640, 360);
}

Knife.prototype = new Weapon();
Knife.prototype.constructor = Knife;

function Bat(game, rarity) {
    this.hidden = true;
    this.type = 'bat';
    this.rarity = rarity;
    this.floating = true;
    this.range = 110;
    calcDmg(this);

    this.static = ASSET_MANAGER.getAsset('./img/bat_drop.png');
    this.animated = new Animation(ASSET_MANAGER.getAsset('./img/bat_drop.png'), 0, 0, 33, 33, 1, 1, true, false);

    Entity.call(this, game, 640, 360);
}

Bat.prototype = new Weapon();
Bat.prototype.constructor = Bat;

function Frump(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 200, 200, 200, 0.4, 2, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 0, 200, 200, 0.1, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 200, 200, 200, 0.1, 4, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1300, 200, 200, 0.1, 1, false, false);
    this.anim.dash = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1600, 200, 200, 0.05, 5, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 200, 1300, 200, 300, 0.1, 5, false, false);
    this.anim.knifeIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 600, 200, 200, 0.4, 2, true, false);
    this.anim.knifeMove = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 400, 200, 200, 0.1, 8, true, false);
    this.anim.knifeAtk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 600, 200, 200, 0.05, 4, false, false);
    this.anim.batIdle = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 1000, 200, 200, 0.4, 2, true, false);
    this.anim.batMove = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 0, 800, 200, 200, 0.1, 8, true, false);
    this.anim.batAtk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 1000, 200, 300, 0.1, 5, false, false);

    // Properties
    this.player = true;
    this.alive = true;
    this.radius = 24;
    this.faces = 20;
    this.sides = 38;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 250;
    this.weapon = new Weapon(game, 0);
    this.range = 70;
    this.damage = 20;
    this.health = new Health(game, 20);
    this.dash = false;
    this.dashCD = 0;
    this.atkCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 65, 430);
}

Frump.prototype = new Entity();
Frump.prototype.constructor = Frump;

Frump.prototype.update = function () {
    // Player faces mouse pointer
    this.rotation = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
    if (this.dashCD > 0) this.dashCD--;
    if (this.atkCD > 0) this.atkCD--;
    if (this.hitCD > 0) this.hitCD--;
    if (this.hitCD <= 0) this.hurt = false;

    // if (this.game.player.shift) {
    //     this.weapon = this.weapons[this.weaponCtr++];
    //     if (this.weaponCtr >= 3) this.weaponCtr = 0;
    // }
    if (this.game.player.space && this.dashCD <= 0) {
        if (this.attacking) {
            this.attacking = false;
            this.anim.atk.elapsedTime = 0;
            this.anim.knifeAtk.elapsedTime = 0;
            this.anim.batAtk.elapsedTime = 0;
        }
        this.dash = true;
        this.radius = 0;
        this.dashCD = 100;
        this.hitCD = 20;
        this.acceleration *= 3;
        this.maxSpeed *= 2;
    }

    // Check for attack + update range
    if (!this.dash && this.game.click && this.atkCD == 0) {
        this.attacking = true;
        if (this.weapon.type == 'knife') {
            this.atkCD = 106;
            this.range = 70;
        }
        else if (this.weapon.type == 'bat') {
            this.atkCD = 112;
            this.range = 110;
        }
        else {
            this.atkCD = 109;
            this.range = 60;
        }
    }

    // Update animations
    if (this.hurt && this.anim.hit.isDone()) {
        this.anim.hit.elapsedTime = 0;
        this.hurt = false;
    }
    if (this.dash && !this.attacking) {
        if (this.anim.dash.isDone()) {
            this.anim.dash.elapsedTime = 0;
            this.dash = false;
            this.radius = 24;
            this.dashCD = 60;
            this.acceleration /= 3;
            this.maxSpeed /= 2;
        }
    }
    else if (this.attacking) {
        if (this.weapon.type == 'unarmed' && this.anim.atk.isDone()) {
            this.anim.atk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 24;
        }
        else if (this.weapon.type == 'knife' && this.anim.knifeAtk.isDone()) {
            this.anim.knifeAtk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 9;
        }
        else if (this.weapon.type == 'bat' && this.anim.batAtk.isDone()) {
            this.anim.batAtk.elapsedTime = 0;
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
            if (this.attacking && ent.hitCD <= 0 && this.hit(ent) && this.atkCD > 88 && this.atkCD <= 100) {
                ent.hurt = true;
                ent.health -= this.weapon.damage;
                ent.hitCD = 18;
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
    else if (this.dash) this.anim.dash.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    else if (this.attacking) {
        if (this.weapon.type == 'knife') this.anim.knifeAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else if (this.weapon.type == 'bat') this.anim.batAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else {
        if (this.game.player.up || this.game.player.left || this.game.player.down || this.game.player.right) {
            if (this.weapon.type == 'knife') this.anim.knifeMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon.type == 'bat') this.anim.batMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
        else {
            if (this.weapon.type == 'knife') this.anim.knifeIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else if (this.weapon.type == 'bat') this.anim.batIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
    }
    Entity.prototype.draw.call(this);
}