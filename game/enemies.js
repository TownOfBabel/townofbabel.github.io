function HealthDrop(game, x, y, heal) {
    this.healOne = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 0, 40, 40, 0.2, 4, true, false);
    this.healTwo = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 40, 40, 40, 0.2, 4, true, false);
    this.healThree = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 80, 40, 40, 0.2, 4, true, false);
    this.sound = new Audio('./sound/eating.wav');
    this.sound.volume = 0.2;
    this.heal = heal;
    this.radius = 20;
    Entity.call(this, game, x, y);
}

HealthDrop.prototype = new Entity();
HealthDrop.prototype.constructor = HealthDrop;

HealthDrop.prototype.update = function() {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.player) {
            if (ent.removeFromWorld) this.removeFromWorld = true;
            else if (this.collide(ent)) {
                ent.health.current += (this.heal * 2);
                if (ent.health.current > ent.health.max)
                    ent.health.current = ent.health.max;
                this.removeFromWorld = true;
                this.sound.play();
            }
        }
    }
};

HealthDrop.prototype.draw = function(ctx) {
    if (this.heal == 1)
        this.healOne.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation, 1.5);
    else if (this.heal == 2)
        this.healTwo.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation, 1.5);
    else if (this.heal == 3)
        this.healThree.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation, 1.5);
};

function Enemy(game, x, y) {
    //Properties
    this.alive = true;
    this.enemy = true;
    this.rotation = Math.random() * (Math.PI * 2) - Math.PI;
    this.velocity = { x: 0, y: 0 };

    // Sounds
    if (this.sound === undefined) this.sound = {};
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.15;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.15;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.15;

    this.atkCD = Math.floor(Math.random() * 20) + 15;
    this.slamCD = Math.floor(Math.random() * 20) + 30;
    this.stunCD = 0;
    this.knockBack = 0;
    this.knocked = false;
    this.barkCD = Math.floor(Math.random() * 45) + 45;
    this.hitCD = 0;
    this.ctr = 0;

    Entity.call(this, game, x, y);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    if (Number.isNaN(this.health)) {
        this.health = this.initHP;
    }

    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        if (Math.floor(Math.random() * 3) == 0)
            this.game.addEntity(new HealthDrop(this.game, this.x, this.y, this.hpDrop));
        this.die = false;
    }
    if (this.alive && !this.die) {
        this.ctr++;
        if (this.atkCD > 0) this.atkCD--;
        if (this.slamCD > 0) this.slamCD--;
        if (this.stunCD > 0) this.stunCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.hurt) this.engage = true;
        if (this.knockBack > 0) this.knockBack--;
        else if (this.knocked) {
            this.maxSpeed = this.mSpeed_init;
            this.knocked = false;
        }
        if (this.barkCD > 0) this.barkCD--;
        else if (this.sound.bark) {
            this.sound.bark.load();
            this.sound.bark.play();
            this.barkCD = Math.floor(Math.random() * 60) + 120;
        }

        // Update animations
        if (this.hurt && this.anim.hit.isDone()) {
            this.sound.hit1.pause();
            this.sound.hit1.load();
            this.sound.hit2.pause();
            this.sound.hit2.load();
            this.sound.hit3.pause();
            this.sound.hit3.load();
            this.anim.hit.elapsedTime = 0;
            this.hurt = false;
        }
        if (this.slamming) {
            this.maxSpeed = 10;
            if (this.anim.slam.isDone()) {
                this.anim.slam.elapsedTime = 0;
                this.slamming = false;
                this.slamCD = 180;
                this.maxSpeed = this.mSpeed_init;
            }
        }
        if (this.attacking) {
            if (this.anim.atk.isDone() || this.stunCD > 0) {
                this.sound.atk.pause();
                this.sound.atk.load();
                this.anim.atk.elapsedTime = 0;
                this.attacking = false;
                this.atkCD = this.endLag;
                if (this.weapon.type == 'bite') {
                    this.acceleration = 120;
                    this.maxSpeed = this.mSpeed_init;
                }
            }
        }

        // Boundary collisions
        if (this.caged) {
            if (this.collideLeft() || this.collideRight()) {
                this.velocity.x = -this.velocity.x * (1 / friction);
                if (this.collideLeft()) this.x = this.radius + 1075;
                if (this.collideRight()) this.x = 1235 - this.radius;
            }
            if (this.collideTop() || this.collideBottom()) {
                this.velocity.y = -this.velocity.y * (1 / friction);
                if (this.collideTop()) this.y = this.radius + 40;
                if (this.collideBottom()) this.y = 200 - this.radius;
            }
        } else {
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
            if (this.dog && ent.enemy) {
                if (ent.engage && distance(this, ent) < this.sight * 1.5)
                    this.engage = true;
                if (!ent.boss && this.caged && this.collide(ent)) {
                    var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                    var difX = Math.cos(atan);
                    var difY = Math.sin(atan);
                    var delta = this.radius + ent.radius - distance(this, ent);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
            } else if (ent.enemy) {
                if (ent.engage && distance(this, ent) < this.sight * 1.5)
                    this.engage = true;
                if (!ent.boss && !ent.dog && this.collide(ent)) {
                    var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                    var difX = Math.cos(atan);
                    var difY = Math.sin(atan);
                    var delta = this.radius + ent.radius - distance(this, ent);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
            } else if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                var rotationDif = Math.abs(this.rotation - atan);
                if (rotationDif > Math.PI) rotationDif = (Math.PI * 2) - rotationDif;
                if ((distance(this, ent) < this.sight && rotationDif <= this.fov) ||
                    distance(this, ent) < (this.range + ent.radius + 50) || this.engage) {
                    this.engage = true;
                    // Determine rotation
                    if (this.rotation > atan) {
                        var rotdif = this.rotation - atan;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation += rotdif / this.rotationLag;
                        } else this.rotation -= rotdif / this.rotationLag;
                    } else {
                        var rotdif = atan - this.rotation;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation -= rotdif / this.rotationLag;
                        } else this.rotation += rotdif / this.rotationLag;
                    }
                    var difX = Math.cos(atan);
                    var difY = Math.sin(atan);
                    var delta = this.radius + ent.radius - distance(this, ent);
                    if (this.collide(ent) && !ent.dash && !ent.supDash && !ent.lunge) {
                        this.velocity.x = -this.velocity.x / friction;
                        this.velocity.y = -this.velocity.y / friction;
                        this.x -= difX * delta / 2;
                        this.y -= difY * delta / 2;
                        ent.x += difX * delta / 2;
                        ent.y += difY * delta / 2;
                    } else {
                        if (this.knockBack > 0) {
                            this.knocked = true;
                            this.velocity.x -= (Math.cos(atan) + 0.01) * this.acceleration * 5;
                            this.velocity.y -= (Math.sin(atan) + 0.01) * this.acceleration * 5;
                            this.maxSpeed *= 1.3;
                        } else {
                            if (this.weapon.type == 'bite' && this.attacking) {
                                this.velocity.x += Math.cos(this.rotation) * this.acceleration * 5;
                                this.velocity.y += Math.sin(this.rotation) * this.acceleration * 5;
                            } else if (distance(this, ent) < this.ideal - 5) {
                                this.velocity.x -= Math.cos(this.rotation) * this.acceleration * 0.4;
                                this.velocity.y -= Math.sin(this.rotation) * this.acceleration * 0.4;
                            } else if (distance(this, ent) > this.ideal + 15) {
                                this.velocity.x += Math.cos(this.rotation) * this.acceleration;
                                this.velocity.y += Math.sin(this.rotation) * this.acceleration;
                            }
                        }
                    }
                    // Attack calculations
                    if (this.weapon.type == 'swing' && distance(this, ent) < 140 && this.slamCD <= 0 && !this.attacking) {
                        this.landedBlow = false;
                        this.sound.slam.play();
                        this.slamming = true;
                        this.slamCD = 142;
                        this.storedRot = this.rotation;
                    } else if (this.weapon.type == 'bite' && this.atkCD <= 0 &&
                        distance(this, ent) < (this.ideal + ent.radius + 10)) {
                        this.landedBlow = false;
                        this.sound.atk.play();
                        this.attacking = true;
                        this.atkCD = this.begLag;
                        this.acceleration = 250;
                        this.maxSpeed = 425;
                    } else if (distance(this, ent) < (this.ideal + ent.radius) && this.atkCD <= 0 && !this.slamming) {
                        this.landedBlow = false;
                        this.sound.atk.play();
                        this.attacking = true;
                        this.atkCD = this.begLag;
                    }
                    if (this.slamming && this.slamCD == 100) this.sound.hit.play();
                    if (this.slamming && ent.hitCD <= 0 && this.hit(ent, 150) &&
                        this.slamCD > 91 && this.slamCD <= 100) {
                        ent.sound.hit2.play();
                        this.landedBlow = true;
                        ent.hurt = true;
                        ent.health.current--;
                        ent.hitCD = 10;
                        ent.stunCD = 45;
                    } else if (this.attacking && ent.hitCD <= 0 && this.hit(ent)) {
                        if (this.weapon.type == 'knife') ent.sound.hit1.play();
                        else ent.sound.hit2.play();
                        this.landedBlow = true;
                        ent.hurt = true;
                        ent.health.current -= this.dmg;
                    }
                }
            }
            if (this.slamming) this.rotation = this.storedRot;
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
};

Enemy.prototype.draw = function(ctx) {
    if (this.die)
        this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt)
        this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.slamming)
        this.anim.slam.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attacking)
        this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.reload)
        this.anim.rld.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
};

Enemy.prototype.hit = function(other, range) {
    if (this.landedBlow) return false;
    else if (range === undefined) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.weapon.type == 'knife') {
            if (this.anim.atk.currentFrame() == 0) {
                var knifeAngle = this.rotation + Math.atan(21 / 56);
                acc = Math.abs(knifeAngle - atan2);
                while (acc > Math.PI * 2) acc -= Math.PI * 2;
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 60;
            } else if (this.anim.atk.currentFrame() == 1 || this.anim.atk.currentFrame == 3) {
                var knifeAngle = this.rotation + Math.atan(13 / 68);
                acc = Math.abs(knifeAngle - atan2);
                while (acc > Math.PI * 2) acc -= Math.PI * 2;
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 70;
            } else if (this.anim.atk.currentFrame() == 2) {
                var knifeAngle = this.rotation + Math.atan(3 / 88);
                acc = Math.abs(knifeAngle - atan2);
                while (acc > Math.PI * 2) acc -= Math.PI * 2;
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 90;
            }
        } else if (this.weapon.type == 'bat') {
            var moveAmnt = (Math.atan(79 / 3) + Math.atan(68 / 33)) / this.anim.atk.totalTime;
            var batAngle = (this.rotation + Math.atan(79 / 3)) - (this.anim.atk.elapsedTime * moveAmnt);
            acc = Math.abs(batAngle - atan2);
            while (acc > Math.PI * 2) acc -= Math.PI * 2;
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 102;
        } else if (this.weapon.type == 'bite') {
            var startTime = this.anim.atk.frameDuration * 2.75;
            var endTime = this.anim.atk.frameDuration * 4.25;
            if (this.anim.atk.elapsedTime > startTime && this.anim.atk.elapsedTime < endTime) {
                acc = Math.abs(this.rotation - atan2);
                while (acc > Math.PI * 2) acc -= Math.PI * 2;
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 75;
            }
        } else if (this.weapon.type == 'swing') {
            var moveAmnt = (Math.atan(33 / 40) + Math.atan(20 / 48)) / this.anim.atk.totalTime;
            var swingAngle = (this.rotation + Math.atan(33 / 40)) - (this.anim.atk.elapsedTime * moveAmnt);
            acc = Math.abs(swingAngle - atan2);
            while (acc > Math.PI * 2) acc -= Math.PI * 2;
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 60;
        }

        if (acc < 0.2) {
            if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                return distance(this, other) < this.range + other.faces;
            else
                return distance(this, other) < this.range + other.sides;
        } else
            return false;
    } else
        return distance(this, other) < range + other.radius;
};

function Dog(game, x, y) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 200, 200, 200, 0.1, 6, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 600, 200, 200, 0.06, 5, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 1000, 0, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 200, 0, 200, 200, 0.25, 2, false, false);

    this.sound = {};
    this.sound.atk = new Audio('./sound/dog_a.wav');
    this.sound.atk.volume = 0.3;
    this.sound.bark = new Audio('./sound/bark.wav');
    this.sound.bark.volume = 0.3;

    // Properties
    this.dog = true;
    this.radius = 22;
    this.faces = 74;
    this.sides = 18;
    this.rotationLag = 10;
    this.acceleration = 90;
    this.maxSpeed = 200;
    this.mSpeed_init = 200;
    this.weapon = {};
    this.weapon.type = 'bite';
    this.begLag = 109;
    this.endLag = 120;
    this.hitDur = 6;
    this.range = 75;
    this.ideal = 140;
    this.sight = 350;
    this.fov = Math.PI;
    this.hpDrop = 1;
    this.health = 60;
    this.initHP = 60;
    this.dmg = 1;

    Enemy.call(this, game, (x + Math.random() * 150 - 75), (y + Math.random() * 150 - 75));
}

Dog.prototype = new Enemy();
Dog.prototype.constructor = Dog;

function Thug(game, weapon, x, y) {
    // Weapons & Animations
    this.anim = {};
    this.weapon = {};
    if (weapon == 0) {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 200, 200, 200, 0.1, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 400, 200, 200, 0.15, 1, false, false);
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 800, 200, 200, 400, (0.5 / 3), 3, false, false);
        this.sound = {};
        this.sound.atk = new Audio('./sound/knife_e.wav');
        this.sound.atk.volume = 0.225;
        this.weapon.type = 'knife';
        this.faces = 38;
        this.begLag = 110;
        this.endLag = 35;
        this.hitDur = 14;
        this.range = 90;
        this.ideal = 85;
        this.maxSpeed = 150;
        this.mSpeed_init = 150;
    } else {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 200, 200, 300, 0.15, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 500, 200, 200, 0.15, 1, false, false);
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 800, 200, 200, 400, (0.5 / 3), 3, false, false);
        this.sound = {};
        this.sound.atk = new Audio('./sound/bat_e.wav');
        this.sound.atk.volume = 0.375;
        this.weapon.type = 'bat';
        this.faces = 28;
        this.begLag = 116;
        this.endLag = 75;
        this.hitDur = 20;
        this.range = 100;
        this.ideal = 100;
        this.maxSpeed = 130;
        this.mSpeed_init = 130;
    }

    // Properties
    this.radius = 24;
    this.sides = 38;
    this.rotationLag = 15;
    this.acceleration = 100;
    this.sight = 250;
    this.fov = Math.PI * 2 / 5;
    this.hpDrop = Math.floor(Math.random() * 2) + 1;
    this.health = 100;
    this.initHP = 100;
    this.dmg = 1;

    Enemy.call(this, game, (x + Math.random() * 150 - 75), (y + Math.random() * 150 - 75));
}

Thug.prototype = new Enemy();
Thug.prototype.constructor = Thug;

function Bodyguard(game, x, y) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 0.15, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 200, 200, 200, 0.14, 5, false, false);
    this.anim.slam = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 1600, 300, 300, 0.15, 7, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 1400, 400, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 600, 200, 700, 0.125, 4, false, false);

    this.sound = {};
    this.sound.atk = new Audio('./sound/attack.wav');
    this.sound.atk.volume = 0.18;
    this.sound.slam = new Audio('./sound/slam_swing.wav');
    this.sound.slam.volume = 0.225;
    this.sound.hit = new Audio('./sound/slam.wav');
    this.sound.hit.volume = 0.3;

    // Properties
    this.radius = 26;
    this.faces = 36;
    this.sides = 50;
    this.rotationLag = 35;
    this.acceleration = 75;
    this.maxSpeed = 100;
    this.mSpeed_init = 100;
    this.weapon = {};
    this.weapon.type = 'swing';
    this.begLag = 114;
    this.endLag = 85;
    this.hitDur = 12;
    this.range = 60;
    this.ideal = 50;
    this.sight = 200;
    this.fov = Math.PI * 4 / 9;
    this.hpDrop = Math.floor(Math.random() * 2) + 2;
    this.health = 180;
    this.initHP = 180;
    this.dmg = 3;

    Enemy.call(this, game, (x + Math.random() * 150 - 75), (y + Math.random() * 150 - 75));
}

Bodyguard.prototype = new Enemy();
Bodyguard.prototype.constructor = Bodyguard;

function Police(game, x, y) {
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 0, 200, 200, 200, 0.12, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 200, 0, 200, 200, 0.25, 1, false, false);
    this.anim.rld = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 400, 0, 200, 200, 0.75, 2, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 0, 500, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/police.png'), 200, 400, 200, 400, (0.5 / 3), 3, false, false);

    this.sound = {};
    this.sound.atk = new Audio('./sound/gun.wav');
    this.sound.atk.volume = 0.07;
    this.sound.reload = new Audio('./sound/reload_e.wav');
    this.sound.reload.volume = 0.09;

    this.weapon = {};
    this.weapon.type = 'gun';
    this.radius = 24;
    this.faces = 32;
    this.sides = 38;
    this.range = 250;
    this.ideal = 250;
    this.rotationLag = 20;
    this.acceleration = 80;
    this.maxSpeed = 120;
    this.mSpeed_init = 120;
    this.sight = 400;
    this.fov = Math.PI / 2;
    this.hpDrop = Math.floor(Math.random() * 2) + 1;
    this.health = 140;
    this.initHP = 140;
    this.bullets = 6;
    this.dmg = 1;
    this.lrCD = 0;
    this.left = false;

    Enemy.call(this, game, (x + Math.random() * 150 - 75), (y + Math.random() * 150 - 75));
}

Police.prototype = new Enemy();
Police.prototype.constructor = Police;

Police.prototype.update = function() {
    if (Number.isNaN(this.health)) this.health = this.initHP;
    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        if (Math.floor(Math.random() * 3) == 0)
            this.game.addEntity(new HealthDrop(this.game, this.x, this.y, this.hpDrop));
        this.die = false;
    }
    if (this.alive && !this.die) {
        if (this.hurt) this.engage = true;
        if (this.atkCD > 0) this.atkCD--;
        if (this.stunCD > 0) this.stunCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.lrCD > 0) this.lrCD--;
        else {
            this.left = !this.left;
            this.lrCD = Math.floor(Math.random() * 90) + 45;
        }
        if (this.knockBack > 0) this.knockBack--;
        else this.maxSpeed = this.mSpeed_init;

        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.hurt = false;
        }
        if (this.reload && this.anim.rld.isDone()) {
            this.anim.rld.elapsedTime = 0;
            this.reload = false;
            this.bullets = 6;
            this.atkCD = 15;
        }
        if (this.attacking) {
            this.maxSpeed = 85;
            if (this.anim.atk.isDone()) {
                this.anim.atk.elapsedTime = 0;
                this.attacking = false;
                this.maxSpeed = this.mSpeed_init;
            }
        }

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

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.enemy) {
                if (ent.engage) this.engage = true;
                if (!ent.boss && this.collide(ent)) {
                    var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                    var difX = Math.cos(atan);
                    var difY = Math.sin(atan);
                    var delta = this.radius + ent.radius - distance(this, ent);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
            } else if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                var rotationDif = Math.abs(this.rotation - atan);
                if (rotationDif > Math.PI) rotationDif = (Math.PI * 2) - rotationDif;
                var dist = distance(this, ent);
                if ((dist < this.sight && rotationDif <= this.fov) ||
                    dist < this.range + ent.radius + 50 || this.engage) {
                    this.engage = true;
                    if (this.rotation > atan) {
                        var rotdif = this.rotation - atan;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation += rotdif / this.rotationLag;
                        } else this.rotation -= rotdif / this.rotationLag;
                    } else {
                        var rotdif = atan - this.rotation;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation -= rotdif / this.rotationLag;
                        } else this.rotation += rotdif / this.rotationLag;
                    }
                    var difX = Math.cos(atan);
                    var difY = Math.sin(atan);
                    var left = atan - Math.PI / 2;
                    var right = atan + Math.PI / 2;
                    var delta = this.radius + ent.radius - distance(this, ent);
                    if (this.collide(ent) && !ent.dash && !ent.supDash && !ent.lunge) {
                        this.velocity.x = -this.velocity.x * (1 / friction);
                        this.velocity.y = -this.velocity.y * (1 / friction);
                        this.x -= difX * delta / 2;
                        this.y -= difY * delta / 2;
                        ent.x += difX * delta / 2;
                        ent.y += difY * delta / 2;
                    } else {
                        if (this.knockBack > 0) {
                            this.velocity.x -= (difX + 0.001) * this.acceleration * 5;
                            this.velocity.y -= (difY + 0.001) * this.acceleration * 5;
                            this.maxSpeed *= 1.2;
                        } else {
                            if (this.left) {
                                this.velocity.x += Math.cos(left) * this.acceleration;
                                this.velocity.y += Math.sin(left) * this.acceleration;
                            } else {
                                this.velocity.x += Math.cos(right) * this.acceleration;
                                this.velocity.y += Math.sin(right) * this.acceleration;
                            }
                            if (dist < this.range) {
                                this.velocity.x -= difX * this.acceleration * 0.6;
                                this.velocity.y -= difY * this.acceleration * 0.6;
                            } else if (dist > this.range + 20) {
                                this.velocity.x += difX * this.acceleration;
                                this.velocity.y += difY * this.acceleration;
                            }
                        }
                    }
                    if (this.atkCD <= 0 && !this.reload && !this.attacking) {
                        this.sound.atk.play();
                        this.attacking = true;
                        this.atkCD = 45;
                        this.bullets--;
                        if (this.bullets == 0) {
                            this.reload = true;
                            this.sound.reload.play();
                        }
                        var gunRot = this.rotation + Math.atan(7 / 85);
                        var difX = Math.cos(gunRot) * 85;
                        var difY = Math.sin(gunRot) * 85;
                        var spread = this.rotation + Math.random() * 0.08 - 0.04;
                        this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, spread, this.dmg));
                    }
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
};

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

Mailbox.prototype.update = function() {
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
};

Mailbox.prototype.draw = function(ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
};