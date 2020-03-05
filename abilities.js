function Ability(game, player) {
    this.player = player;
    this.cooldown = 0;
    Entity.call(this, game, 150, 35);
}

Ability.prototype = new Entity();
Ability.prototype.constructor = Ability;

Ability.prototype.update = function () {
}

Ability.prototype.draw = function (ctx) {
    if (this.cooldown <= 0)
        ctx.drawImage(this.icon, 240, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.cooldown <= this.maxCD / 4)
        ctx.drawImage(this.icon, 180, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.cooldown <= this.maxCD / 2)
        ctx.drawImage(this.icon, 120, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.cooldown <= (this.maxCD * 3 / 4))
        ctx.drawImage(this.icon, 60, 0, 60, 60, this.x, this.y, 40, 40);
    else
        ctx.drawImage(this.icon, 0, 0, 60, 60, this.x, this.y, 40, 40);
}

function SuperDash(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 120;
    Ability.call(this, game, player);
}

SuperDash.prototype = new Ability();
SuperDash.prototype.constructor = SuperDash;

SuperDash.prototype.update = function () {
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.dash && this.player.supDash) {
        this.player.supDash = false;
        this.player.anim.supDash.elapsedTime = 0;
        this.cooldown = this.maxCD;
    }
    if (this.game.shift && this.cooldown <= 0
        && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
        }
        this.player.supDash = true;
        this.player.hitCD = 30;
        this.cooldown = this.maxCD;
        this.player.acceleration = 400;
        this.player.maxSpeed = 1000;
    }
    if (this.player.supDash && this.player.anim.supDash.isDone()) {
        this.player.anim.supDash.elapsedTime = 0;
        this.player.supDash = false;
        this.player.acceleration = 100;
        this.player.maxSpeed = 250;
        this.cooldown = this.maxCD;
    }
}

function BlingStun(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 240;
    Ability.call(this, game, player);
}

BlingStun.prototype = new Ability();
BlingStun.prototype.constructor = BlingStun;

BlingStun.prototype.update = function () {
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.dash && this.player.bling) {
        this.player.bling = false;
        this.player.anim.bling.elapsedTime = 0;
        this.cooldown = this.maxCD;
    }
    if (this.game.shift && this.cooldown <= 0
        && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
        }
        this.player.bling = true;
        this.cooldown = 109;
    }
    if (this.player.bling && this.player.anim.bling.isDone()) {
        this.player.anim.bling.elapsedTime = 0;
        this.player.bling = false;
        this.cooldown = this.maxCD;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.enemy) {
            if (this.player.bling && this.player.hit(ent, 150) && ent.hitCD <= 0
                && this.cooldown <= 100 && this.cooldown > 82) {
                ent.hurt = true;
                ent.health -= 10;
                ent.hitCD = 18;
                ent.stunCD = 60;
            }
        }
    }
}

function BoomSpeaker(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 330;
    Ability.call(this, game, player);
}

BoomSpeaker.prototype = new Ability();
BoomSpeaker.prototype.constructor = BoomSpeaker;

BoomSpeaker.prototype.update = function () {

}

function Lunge(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 390;
    Ability.call(this, game, player);
}

Lunge.prototype = new Ability();
Lunge.prototype.constructor = Lunge;

Lunge.prototype.update = function () {

}

function FruitShot(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 360;
    Ability.call(this, game, player);
}

FruitShot.prototype = new Ability();
FruitShot.prototype.constructor = FruitShot;

FruitShot.prototype.update = function () {

}

function Laser(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 420;
    Ability.call(this, game, player);
}

Laser.prototype = new Ability();
Laser.prototype.constructor = Laser;

Laser.prototype.update = function () {
    
}