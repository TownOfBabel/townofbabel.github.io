function SuperDash(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.player = player;
    this.cooldown = 0;
    this.maxCD = 120;
    Entity.call(this, game, 150, 35);
}

SuperDash.prototype = new Entity();
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

SuperDash.prototype.draw = function (ctx) {
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

function BlingStun(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.player = player;
    this.cooldown = 0;
    this.maxCD = 180;
    Entity.call(this, game, 150, 35);
}

BlingStun.prototype = new Entity();
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
        this.cooldown = 118;
    }
    if (this.player.bling && this.player.anim.bling.isDone()) {
        this.player.anim.bling.elapsedTime = 0;
        this.player.bling = false;
        this.cooldown = this.maxCD;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.enemy) {
            if (this.player.bling && this.player.hit(ent, 120) && ent.hitCD <= 0
                && this.cooldown <= 100 && this.cooldown > 88) {
                ent.hurt = true;
                ent.health -= 10;
                ent.hitCD = 12;
                ent.stunCD = 60;
            }
        }
    }
}

BlingStun.prototype.draw = function (ctx) {
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