function Enemy(game) {
    //Properties
    this.enemy = true;
    this.rotations = [];
    this.rotation = Math.random() * (Math.PI * 2) - Math.PI;
    this.velocity = { x: 0, y: 0 };

    this.atkCD = 0;
    this.slamCD = 0;
    this.hitCD = 0;
    this.ctr = 0;

    Entity.call(this, game, Math.random() * 420 + 410, Math.random() * 620 + 50);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {

    this.ctr++;
    if (this.atkCD > 0) this.atkCD--;
    if (this.slamCD > 0) this.slamCD--;
    if (this.hitCD > 0) this.hitCD--;
    if (this.hitCD <= 0) this.hurt = false;
    if (this.hurt) this.engage = true;

    // Update animations
    if (this.hurt && this.anim.hit.isDone()) {
        this.anim.hit.elapsedTime = 0;
        this.hurt = false;
    }
    if (this.slamming) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (this.anim.slam.isDone()) {
            this.anim.slam.elapsedTime = 0;
            this.slamming = false;
            this.slamCD = 180;
        }
    }
    if (this.attacking && this.anim.atk.isDone()) {
        this.anim.atk.elapsedTime = 0;
        this.attacking = false;
        this.atkCD = this.endLag;
        if (this.weapon.type == 'bite') {
            this.acceleration = 200;
            this.maxSpeed = 200;
        }
    }

    // Boundary collisions
    if (this.caged) {
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * (1 / friction);
            if (this.collideLeft()) this.x = this.radius + 1150;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * (1 / friction);
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 150 - this.radius;
        }
    }
    else {
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * (1 / friction);
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * (1 / friction);
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 720 - this.radius;
        }
    }

    // Wall and Player/Enemy collisions
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.wall) {
            if (this.collide(ent)) {
                if (this.side == 'left' || this.side == 'right') {
                    this.velocity.x = -this.velocity.x * (1 / friction);
                    if (this.side == 'left') this.x = ent.x - this.radius;
                    else this.x = ent.x + ent.w + this.radius;
                }
                else if (this.side == 'top' || this.side == 'bottom') {
                    this.velocity.y = -this.velocity.y * (1 / friction);
                    if (this.side == 'top') this.y = ent.y - this.radius;
                    else this.y = ent.y + ent.h + this.radius;
                }
            }
        }
        else if (ent.enemy) {
            var difX = Math.cos(this.rotation);
            var difY = Math.sin(this.rotation);
            var delta = this.radius + ent.radius - distance(this, ent);
            if (this.collide(ent)) {
                this.velocity.x = -this.velocity.x * (1 / friction);
                this.velocity.y = -this.velocity.y * (1 / friction);
                this.x -= difX * delta / 2;
                this.y -= difY * delta / 2;
                ent.x += difX * delta / 2;
                ent.y += difY * delta / 2;
            }
        }
        else if (ent.player && ent.alive) {
            var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
            var rotationDif = Math.abs(this.rotation - atan);
            if (rotationDif > Math.PI) rotationDif = (Math.PI * 2) - rotationDif;

            if ((distance(this, ent) < this.sight && rotationDif <= this.fov)
                || distance(this, ent) < (this.range + ent.radius + 50) || this.engage) {
                this.engage = true;
                // Determine rotation
                if (rotationDif < Math.PI / 32 || this.rotations.length > (this.rotationLag * 10)) {
                    for (var j = this.rotations.length - 1; j >= 0; j -= 2) {
                        this.rotations.splice(j, 1);
                    }
                }
                this.rotations.push(atan);
                if (this.ctr % this.rotationLag == 0) this.rotation = this.rotations.shift();

                var difX = Math.cos(this.rotation);
                var difY = Math.sin(this.rotation);
                var delta = this.radius + ent.radius - distance(this, ent);
                if (this.collide(ent) && !ent.dash) {
                    this.velocity.x = -this.velocity.x * (1 / friction);
                    this.velocity.y = -this.velocity.y * (1 / friction);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
                else {
                    this.velocity.x += difX * this.acceleration;
                    this.velocity.y += difY * this.acceleration;
                }
                // Attack calculations
                if (this.weapon.type == 'swing' && distance(this, ent) < 220 && this.slamCD <= 0) {
                    this.slamming = true;
                    this.slamCD = 150;
                }
                else if (distance(this, ent) < (this.range + ent.radius / 2) && this.atkCD <= 0) {
                    this.attacking = true;
                    this.atkCD = this.begLag;
                }
                else if (this.weapon.type == 'bite' && this.atkCD <= 0
                    && distance(this, ent) < (this.range * 3 / 2 + ent.range)) {
                    this.attacking = true;
                    this.atkCD = this.begLag;
                    this.acceleration = 400;
                    this.maxSpeed = 400;
                }
                if (this.slamming && ent.hitCD <= 0 && this.hit(ent, 200)
                    && this.slamCD > 91 && this.slamCD <= 100) {
                    ent.hurt = true;
                    ent.health.current--;
                    ent.hitCD = 9;
                    ent.stunCD = 45;
                }
                if (this.attacking && ent.hitCD <= 0 && this.hit(ent)
                    && this.atkCD > (100 - this.hitDur) && this.atkCD <= 100) {
                    ent.hurt = true;
                    ent.health.current -= this.dmg;
                    ent.hitCD = this.hitDur;
                }
            }
        }
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
}

Enemy.prototype.draw = function (ctx) {
    if (this.hurt)
        this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.slamming)
        this.anim.slam.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attacking)
        this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
}

function MiniBoss(game, dogs) {
    // animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 0.15, 1, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 200, 200, 200, 0.6, 1, false, false);
    this.anim.sht = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 0.7, 1, false, false);
    this.anim.wsl = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 0.5, 1, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 0.15, 1, false, false);

    // properties
    this.enemy = true;
    this.dogs = dogs;
    this.radius = 38;
    this.faces = 42;
    this.sides = 42;
    this.rotation = Math.PI / 2;
    this.acceleration = 60;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 85;
    this.weapon = {};
    this.weapon.type = 'bat';
    this.range = 100;
    this.health = 200;

    this.atkCD = 0;
    this.shtCD = 0;
    this.wslCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 640, 300);
}

MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {

    if (this.atkCD > 0) this.atkCD--;
    if (this.shtCD > 0) this.shtCD--;
    if (this.wslCD > 0) this.wslCD--;
    if (this.hitCD > 0) this.hitCD--;
    else this.hurt = false;

    // animation control
    if (this.hurt && this.anim.hit.isDone()) {
        this.anim.hit.elapsedTime = 0;
        this.hurt = false;
    }
    if (this.whistle || this.shoot) {
        this.velocity.x *= (4 / 7);
        this.velocity.y *= (4 / 7);
        if (this.anim.wsl.isDone()) {
            this.anim.wsl.elapsedTime = 0;
            this.whistle = false;
            this.wslCD = 480;
        }
        if (this.anim.sht.isDone()) {
            this.anim.sht.elapsedTime = 0;
            this.shoot = false;
            this.shtCD = 90;
        }
    }
    if (this.attack && this.anim.atk.isDone()) {
        this.anim.atk.elapsedTime = 0;
        this.attack = false;
        this.atkCD = 30;
    }

    // boundary collisions
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * (1 / friction);
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 1280 - this.radius;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * (1 / friction);
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 720 - this.radius;
    }

    // entity collisions
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.wall) {
            if (this.collide(ent)) {
                if (this.side == 'left' || this.side == 'right') {
                    this.velocity.x = -this.velocity.x * (1 / friction);
                    if (this.side == 'left') this.x = ent.x - this.radius;
                    else this.x = ent.x + ent.w + this.radius;
                }
                else if (this.side == 'top' || this.side == 'bottom') {
                    this.velocity.y = -this.velocity.y * (1 / friction);
                    if (this.side == 'top') this.y = ent.y - this.radius;
                    else this.y = ent.y + ent.h + this.radius;
                }
            }
        }
        else if (ent.player && ent.alive) {
            this.rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
            var difX = Math.cos(this.rotation);
            var difY = Math.sin(this.rotation);
            var delta = this.radius + ent.radius - distance(this, ent);
            if (this.collide(ent) && !ent.dash) {
                this.velocity.x = -this.velocity.x * (1 / friction);
                this.velocity.y = -this.velocity.y * (1 / friction);
                this.x -= difX * delta / 2;
                this.y -= difY * delta / 2;
                ent.x += difX * delta / 2;
                ent.y += difY * delta / 2;
            }
            else {
                this.velocity.x += difX * this.acceleration;
                this.velocity.y += difY * this.acceleration;
            }
            var dist = distance(this, ent);
            if (this.wslCD <= 0 && this.dogs.length > 0) {
                this.whistle = true;
                this.dogs.pop().caged = false;
                this.wslCD = 480;
            }
            else if (dist < 110 && this.atkCD <= 0) {
                this.attack = true;
                this.atkCD = 112;
            }
            else if (this.shtCD <= 0) {
                this.shoot = true;
                var difX = Math.cos(this.rotation) * 45;
                var difY = Math.sin(this.rotation) * 45;
                this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 5, 1));
                this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 6, 1));
                this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 6, 1));
                this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 5, 1));
                this.shtCD = 90;
            }
            if (this.attack && ent.hitCD <= 0 && this.hit(ent)
                && this.atkCD > 76 && this.atkCD <= 100) {
                ent.hurt = true;
                ent.health.current -= 3;
                ent.hitCD = 24;
            }
        }
    }

    // speed control
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

MiniBoss.prototype.draw = function (ctx) {
    if (this.hurt)
        this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.whistle)
        this.anim.wsl.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attack)
        this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.shoot)
        this.anim.sht.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
}

function Mailbox(game, timer) {
    this.image = './img/Mailbox.png';
    this.timer = timer;
    this.radius = 15;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 875 / (timer * 60);
    Entity.call(this, game, 940, 430);
}

Mailbox.prototype = new Entity();
Mailbox.prototype.constructor = Mailbox;

Mailbox.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.player && ent.alive) {
            var rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
            var difX = Math.cos(rotation);
            var difY = Math.sin(rotation);
            // var delta = this.radius + ent.radius - distance(this, ent.x, ent.y);
            // if (this.collide(ent)) {
            //     this.velocity.x = -this.velocity.x * (1/friction);
            //     this.velocity.y = -this.velocity.y * (1/friction);
            //     this.x -= difX * delta/2;
            //     this.y -= difY * delta/2;
            //     ent.x += difX * delta/2;
            //     ent.y += difY * delta/2;

            // }
            // else {
            this.velocity.x += difX * this.acceleration;
            this.velocity.y += difY * this.acceleration;
            // }
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
}

Mailbox.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
}

function Dog(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 200, 200, 200, 0.1, 6, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 600, 200, 200, 0.05, 5, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 1000, 0, 200, 200, 0.15, 1, false, false);

    // Properties
    this.radius = 20;
    this.faces = 42;
    this.sides = 18;
    this.rotationLag = 1;
    this.acceleration = 200;
    this.maxSpeed = 200;
    this.weapon = {};
    this.weapon.type = 'bite';
    this.begLag = 109;
    this.endLag = 75;
    this.hitDur = 6;
    this.range = 70;
    this.sight = 450;
    this.fov = Math.PI;
    this.health = 60;
    this.dmg = 2;

    Enemy.call(this, game);
}

Dog.prototype = new Enemy();
Dog.prototype.constructor = Dog;

function Thug(game, weapon) {
    // Weapons & Animations
    this.anim = {};
    this.weapon = {};
    if (weapon == 0) {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 200, 200, 200, 0.1, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 400, 200, 200, 0.15, 1, false, false);
        this.weapon.type = 'knife';
        this.begLag = 110;
        this.endLag = 45;
        this.hitDur = 14;
        this.range = 85;
    }
    else {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 200, 200, 300, 0.15, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 500, 200, 200, 0.15, 1, false, false);
        this.weapon.type = 'bat';
        this.begLag = 116;
        this.endLag = 65;
        this.hitDur = 20;
        this.range = 110;
    }

    // Properties
    this.radius = 24;
    this.faces = 28;
    this.sides = 38;
    this.rotationLag = 2;
    this.acceleration = 100;
    this.maxSpeed = 150;
    this.sight = 250;
    this.fov = Math.PI * 2 / 5;
    this.health = 100;
    this.dmg = 1;

    Enemy.call(this, game);
}

Thug.prototype = new Enemy();
Thug.prototype.constructor = Thug;

function Bodyguard(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 0.15, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 200, 200, 200, 0.14, 5, false, false);
    this.anim.slam = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 400, 200, 200, 0.14, 7, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 1400, 400, 200, 200, 0.15, 1, false, false);

    // Properties
    this.radius = 26;
    this.faces = 30;
    this.sides = 48;
    this.rotationLag = 3;
    this.acceleration = 75;
    this.maxSpeed = 100;
    this.weapon = {};
    this.weapon.type = 'swing';
    this.begLag = 114;
    this.endLag = 85;
    this.hitDur = 12;
    this.range = 60;
    this.sight = 200;
    this.fov = Math.PI * 4 / 9;
    this.health = 140;
    this.dmg = 3;

    Enemy.call(this, game);
}

Bodyguard.prototype = new Enemy();
Bodyguard.prototype.constructor = Bodyguard;