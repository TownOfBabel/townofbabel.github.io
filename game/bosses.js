function getDamage(lvl) {
    if (lvl == 0) return (20 + 25) / 2;
    else if (lvl == 1) return (25 + 40) / 2;
    else if (lvl >= 2) return (40 + 60) / 2;
}

function SlowDogg(game, dogs, lvl) {
    // animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 200, 0, 200, 200, 0.2, 3, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 600, 400, 300, 0.125, 4, false, false);
    this.anim.sht = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 200, 200, 200, 0.1, 8, false, false);
    this.anim.wsl = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 400, 200, 200, 0.1, 3, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 1400, 0, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 800, 0, 200, 200, 0.25, 2, false, false);

    this.sound = {};
    this.sound.cane = new Audio('./sound/bat_p.wav');
    this.sound.cane.volume = 0.375;
    this.sound.shotgun = new Audio('./sound/shotgun.wav');
    this.sound.shotgun.volume = 0.2;
    this.sound.whistle = new Audio('./sound/whistle.wav');
    this.sound.whistle.volume = 0.3;
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.16;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.16;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.16;

    // properties
    this.alive = true;
    this.boss = true;
    this.enemy = true;
    this.dogs = dogs;
    this.radius = 38;
    this.faces = 42;
    this.sides = 42;
    this.rotation = Math.PI / 2;
    this.acceleration = 50;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 65;
    this.mSpeed_init = 65;
    this.range = 130;
    this.ideal = 140;
    this.health = getDamage(lvl) * 11 + lvl;
    this.maxHealth = this.health;

    this.engage = true;
    this.atkCD = 0;
    this.stunCD = 0;
    this.knockBack = 0;
    this.shtCD = 0;
    this.wslCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 150, 150);
}

SlowDogg.prototype = new Entity();
SlowDogg.prototype.constructor = SlowDogg;

SlowDogg.prototype.update = function () {
    if (Number.isNaN(this.health)) {
        this.health = this.maxHealth;
    }

    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive && !this.die) {
        if (this.atkCD > 0) this.atkCD--;
        if (this.stunCD > 0) this.stunCD--;
        if (this.knockBack > 0) this.knockBack--;
        if (this.shtCD > 0) this.shtCD--;
        if (this.wslCD > 0) this.wslCD--;
        if (this.hitCD > 0) this.hitCD--;

        // animation control
        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.sound.hit1.pause();
            this.sound.hit1.load();
            this.sound.hit2.pause();
            this.sound.hit2.load();
            this.sound.hit3.pause();
            this.sound.hit3.load();
            this.hurt = false;
        }
        if (this.whistle || this.shoot) {
            this.velocity.x *= (2 / 7);
            this.velocity.y *= (2 / 7);
            if (this.anim.wsl.isDone()) {
                this.anim.wsl.elapsedTime = 0;
                this.whistle = false;
                this.wslCD = 720;
            }
            if (this.anim.sht.isDone()) {
                this.anim.sht.elapsedTime = 0;
                this.shoot = false;
                this.shtCD = 90;
            }
        }
        if (this.attack) {
            if (this.anim.atk.isDone() || this.stunCD > 0) {
                this.anim.atk.elapsedTime = 0;
                this.attack = false;
                this.atkCD = 60;
            }
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
            if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                if (this.rotation > atan) {
                    var rotdif = this.rotation - atan;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation += rotdif / 22;
                    } else this.rotation -= rotdif / 22;
                }
                else {
                    var rotdif = atan - this.rotation;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation -= rotdif / 22;
                    } else this.rotation += rotdif / 22;
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
                }
                else {
                    if (this.knockBack > 0) {
                        this.velocity.x -= difX * this.acceleration * 6;
                        this.velocity.y -= difY * this.acceleration * 6;
                        this.maxSpeed *= 1.13;
                    }
                    else {
                        if (distance(this, ent) < this.ideal - 5) {
                            this.velocity.x -= Math.cos(this.rotation) * this.acceleration * 0.6;
                            this.velocity.y -= Math.sin(this.rotation) * this.acceleration * 0.6;
                        } else if (distance(this, ent) > this.ideal + 15) {
                            this.velocity.x += Math.cos(this.rotation) * this.acceleration;
                            this.velocity.y += Math.sin(this.rotation) * this.acceleration;
                        }
                    }
                }
                var dist = distance(this, ent);
                if (this.wslCD <= 0 && this.dogs.length > 0 && !this.shoot && !this.attack) {
                    this.sound.whistle.play();
                    this.whistle = true;
                    var dog = this.dogs.pop();
                    dog.caged = false;
                    this.wslCD = 720;
                }
                else if (dist < 140 && this.atkCD <= 0 && !this.shoot && !this.whistle) {
                    this.landedBlow = false;
                    this.sound.cane.play();
                    this.attack = true;
                    this.atkCD = 112;
                }
                else if (this.shtCD <= 0 && !this.attack && !this.whistle) {
                    this.shoot = true;
                    this.shtCD = 118;
                }
                if (this.attack && ent.hitCD <= 0 && this.hit(ent)) {
                    this.landedBlow = true;
                    ent.sound.hit1.play();
                    ent.hurt = true;
                    ent.health.current -= 2;
                    ent.hitCD = 10;
                }
                else if (this.shoot && this.shtCD == 100) {
                    this.sound.shotgun.play();
                    var gunRot = this.rotation + Math.atan(29 / 86);
                    var difX = Math.cos(gunRot) * 90;
                    var difY = Math.sin(gunRot) * 90;
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 7, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 21, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 21, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 7, 1));
                }
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
};

SlowDogg.prototype.draw = function (ctx) {
    if (this.die)
        this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt)
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
};

SlowDogg.prototype.hit = function (other) {
    var acc = 1;
    var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
    var orien = Math.abs(this.rotation - other.rotation);
    if (orien > Math.PI) orien = (Math.PI * 2) - orien;

    if (this.anim.atk.currentFrame() != 0) {
        var moveAmnt = (Math.atan(158 / 10) + Math.atan(86 / 46)) / (this.anim.atk.totalTime - this.anim.atk.frameDuration);
        var caneAngle = (this.rotation + Math.atan(158 / 10)) - ((this.anim.atk.elapsedTime - this.anim.atk.frameDuration) * moveAmnt);
        acc = Math.abs(caneAngle - atan2);
        while (acc > Math.PI * 2) acc -= Math.PI * 2;
        if (acc > Math.PI) acc = (Math.PI * 2) - acc;
    }

    if (this.landedBlow) return false;
    else if (acc < 0.25) {
        if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
            return distance(this, other) < this.range + other.faces;
        else
            return distance(this, other) < this.range + other.sides;
    }
    else
        return false;
};

function BigGuy(game, lvl) {
    // animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 0, 0, 600, 600, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 0, 0, 600, 600, 0.13, 8, true, false);
    this.anim.jab = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 0, 600, 600, 600, 0.13, 4, false, false);
    this.anim.slm = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 0, 1200, 600, 600, 0.25, 6, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 2400, 600, 600, 600, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/big_guy.png'), 2400, 600, 600, 600, 0.5, 1, false, false);

    this.sound = {};
    this.sound.jab = new Audio('./sound/bat_p.wav');
    this.sound.jab.volume = 0.375;
    this.sound.slam1 = new Audio('./sound/slam_swing.wav');
    this.sound.slam1.volume = 0.375;
    this.sound.slam2 = new Audio('./sound/big_slam.wav');
    this.sound.slam2.volume = 0.3;
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.17;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.17;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.17;

    // properties
    this.alive = true;
    this.boss = true;
    this.enemy = true;
    this.radius = 45;
    this.faces = 65;
    this.sides = 60;
    this.rotation = Math.PI / 2;
    this.acceleration = 75;
    this.velocity = { x: 0, y: 0 };
    this.range = 100;
    this.ideal = 100;
    this.maxSpeed = 120;
    this.mSpeed_init = 120;
    this.health = getDamage(lvl) * 14 + lvl;
    this.maxHealth = this.health;
    this.storedRot = 0;
    this.engage = true;
    this.knockBack = 0;
    this.stunCD = 0;
    this.jabCD = 0;
    this.slmCD = 0;
    this.hitCD = 0;
    this.lrCD = 0;
    this.left = true;

    Entity.call(this, game, 640, 125);
}

BigGuy.prototype = new Entity();
BigGuy.prototype.constructor = BigGuy;

BigGuy.prototype.update = function () {
    if (Number.isNaN(this.health)) this.health = this.maxHealth;
    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive && !this.die) {
        if (this.knockBack > 0) this.knockBack--;
        else this.maxSpeed = this.mSpeed_init;
        if (this.stunCD > 0) this.stunCD--;
        if (this.jabCD > 0) this.jabCD--;
        if (this.slmCD > 0) this.slmCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.lrCD > 0) this.lrCD--;
        else {
            this.lrCD = Math.floor(Math.random * 120) + 90;
            this.left = !this.left;
        }

        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.sound.hit1.pause();
            this.sound.hit1.load();
            this.sound.hit2.pause();
            this.sound.hit2.load();
            this.sound.hit3.pause();
            this.sound.hit3.load();
            this.hurt = false;
        }
        if (this.jab || this.slam) {
            this.maxSpeed = 60;
            if (this.anim.jab.isDone() || this.stunCD > 0) {
                this.anim.jab.elapsedTime = 0;
                this.maxSpeed = this.mSpeed_init;
                this.sound.jab.pause();
                this.sound.jab.load();
                this.jab = false;
                this.jabCD = 75;
            }
            if (this.anim.slm.isDone() || this.stunCD > 0) {
                this.anim.slm.elapsedTime = 0;
                this.maxSpeed = this.mSpeed_init;
                this.slam = false;
                this.slmCD = 300;
            }
        }
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x / friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y / friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 720 - this.radius;
        }
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x) - 0.4;
                if (this.rotation > atan) {
                    var rotdif = this.rotation - atan;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation += rotdif / 18;
                    } else this.rotation -= rotdif / 18;
                }
                else {
                    var rotdif = atan - this.rotation;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation -= rotdif / 18;
                    } else this.rotation += rotdif / 18;
                }
                var dist = distance(this, ent);
                var difX = Math.cos(Math.atan2(ent.y - this.y, ent.x - this.x));
                var difY = Math.sin(Math.atan2(ent.y - this.y, ent.x - this.x));
                var delta = this.radius + ent.radius - dist;
                if (this.collide(ent) && !ent.dash && !ent.supDash && !ent.lunge) {
                    this.velocity.x = -this.velocity.x / friction;
                    this.velocity.y = -this.velocity.y / friction;
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
                else {
                    if (this.knockBack > 0) {
                        this.velocity.x -= (difX + 0.001) * this.acceleration * 5;
                        this.velocity.y -= (difY + 0.001) * this.acceleration * 5;
                        this.maxSpeed *= 1.1;
                    } else {
                        var left = atan - Math.PI / 2;
                        var right = atan + Math.PI / 2;
                        if (this.left) {
                            this.velocity.x += Math.cos(left) * this.acceleration;
                            this.velocity.y += Math.sin(left) * this.acceleration;
                        } else {
                            this.velocity.x += Math.cos(right) * this.acceleration;
                            this.velocity.y += Math.sin(right) * this.acceleration;
                        }
                        if (dist < this.ideal - 10) {
                            this.velocity.x -= difX * this.acceleration * 0.6;
                            this.velocity.y -= difY * this.acceleration * 0.6;
                        } else if (dist > this.ideal + 10) {
                            this.velocity.x += difX * this.acceleration;
                            this.velocity.y += difY * this.acceleration;
                        }
                    }
                }
                if (this.slmCD <= 0 && dist < 200 && !this.jab) {
                    this.landedBlow = false;
                    this.sound.slam1.play();
                    this.slam = true;
                    this.slmCD = 145;
                    this.storedRot = this.rotation;
                }
                else if (this.jabCD <= 0 && dist < this.ideal + 10 && !this.slam) {
                    this.landedBlow = false;
                    this.sound.jab.play();
                    this.jab = true;
                    this.atkCD = 106;
                }
                if (this.slam && this.slmCD == 100) this.sound.slam2.play();
                if (this.slam && this.hit(ent) && ent.hitCD <= 0) {
                    this.landedBlow = true;
                    ent.sound.hit3.play();
                    ent.hurt = true;
                    ent.health.current--;
                    ent.hitCD = 15;
                    ent.stunCD = 75;
                }
                else if (this.jab && this.hit(ent) && ent.hitCD <= 0) {
                    this.landedBlow = true;
                    ent.sound.hit2.play();
                    ent.hurt = true;
                    ent.health.current -= 2;
                    ent.hitCD = 10;
                }
            }
            if (this.slam) {
                this.rotation = this.storedRot;
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

BigGuy.prototype.draw = function (ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.slam) this.anim.slm.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.jab) this.anim.jab.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
};

BigGuy.prototype.hit = function (other) {
    if (this.landedBlow) return false;
    else if (this.slam) {
        var ctr_x = this.x + Math.cos(this.rotation) * 110;
        var ctr_y = this.y + Math.sin(this.rotation) * 110;
        var center = { x: ctr_x, y: ctr_y };
        if (this.anim.slm.currentFrame() == 3)
            return distance(center, other) < 110 + other.radius;
        else if (this.anim.slm.currentFrame() == 4)
            return distance(center, other) < 130 + other.radius;
        else return false;
    }
    else if (this.jab) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.anim.jab.currentFrame() == 0) {
            var angle = this.rotation + Math.atan(44 / 56);
            acc = Math.abs(angle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 72;
        }
        else if (this.anim.jab.currentFrame() == 1) {
            var angle = this.rotation + Math.atan(38 / 90);
            acc = Math.abs(angle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 98;
        }
        else if (this.anim.jab.currentFrame() == 2) {
            var angle = this.rotation + Math.atan(40 / 128);
            acc = Math.abs(angle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 134;
        }

        if (acc < 0.3) {
            if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                return distance(this, other) < this.range + other.faces;
            else
                return distance(this, other) < this.range + other.sides;
        }
        else
            return false;
    }
    else return false;
};

function NinjaGuy(game, lvl) {
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 0, 300, 300, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 0, 300, 300, 0.11, 8, true, false);
    this.anim.dash = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 600, 300, 300, 0.08, 5, false, false);
    this.anim.slash = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 300, 300, 300, 0.1, 4, false, false);
    this.anim.throw = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 1200, 300, 300, 300, 0.25, 2, false, false);
    this.anim.lunge = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 900, 300, 400, 0.1, 6, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 0, 1400, 300, 300, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/ninja_guy.png'), 300, 1200, 300, 500, (0.5 / 3), 1, false, false);

    this.sound = {};
    this.sound.dash = new Audio('./sound/dash.wav');
    this.sound.dash.volume = 0.35;
    this.sound.slash = new Audio('./sound/slash.wav');
    this.sound.slash.volume = 0.3;
    this.sound.throw = new Audio('./sound/throw.wav');
    this.sound.throw.volume = 0.3;
    this.sound.lunge = new Audio('./sound/lunge.wav');
    this.sound.lunge.volume = 0.25;
    this.sound.hit = new Audio('./sound/ninja_hit.wav');
    this.sound.hit.volume = 0.225;
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.15;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.15;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.15;

    this.alive = true;
    this.boss = true;
    this.enemy = true;
    this.radius = 38;
    this.faces = 50;
    this.sides = 50;
    this.rotation = Math.PI / 2;
    this.storedRot = this.rotation;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 150;
    this.maxSpeed = 180;
    this.mSpeed_init = 180;
    this.health = getDamage(lvl) * 10 + lvl;
    this.maxHealth = this.health;
    this.range = 250;
    this.engage = true;
    this.knockBack = 0;
    this.dashCD = 0;
    this.lungeCD = 0;
    this.slashCD = 0;
    this.throwCD = 60;
    this.stunCD = 0;
    this.hitCD = 0;
    this.lrCD = 0;
    this.left = true;

    Entity.call(this, game, 150, 150);
}

NinjaGuy.prototype = new Entity();
NinjaGuy.prototype.constructor = NinjaGuy;

NinjaGuy.prototype.update = function () {
    if (Number.isNaN(this.health)) this.health = this.maxHealth;
    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive && !this.die) {
        if (this.knockBack > 0) this.knockBack--;
        if (this.dashCD > 0) this.dashCD--;
        if (this.lungeCD > 0) this.lungeCD--;
        if (this.slashCD > 0) this.slashCD--;
        if (this.throwCD > 0) this.throwCD--;
        if (this.stunCD > 0) this.stunCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.lrCD > 0) this.lrCD--;
        else {
            this.left = !this.left;
            this.lrCD = Math.floor(Math.random() * 90) + 75;
        }

        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.sound.hit1.pause();
            this.sound.hit1.load();
            this.sound.hit2.pause();
            this.sound.hit2.load();
            this.sound.hit3.pause();
            this.sound.hit3.load();
            this.hurt = false;
        }
        if (this.dash && this.anim.dash.isDone()) {
            this.anim.dash.elapsedTime = 0;
            this.sound.dash.load();
            this.maxSpeed = this.mSpeed_init;
            this.acceleration = 150;
            this.dash = false;
        }
        if (this.lunge) {
            if (this.anim.lunge.elapsedTime > 0.5)
                this.maxSpeed = 85;
            else if (this.anim.lunge.elapsedTime > 0.2) {
                this.maxSpeed = 750;
                if (!this.setRot) {
                    this.sound.lunge.play();
                    this.storedRot = this.rotation;
                    this.setRot = true;
                }
            }
            if (this.anim.lunge.isDone()) {
                this.anim.lunge.elapsedTime = 0;
                this.sound.lunge.pause();
                this.sound.lunge.load();
                this.maxSpeed = this.mSpeed_init;
                this.acceleration = 150;
                this.lunge = false;
            }
        }
        if (this.slash && this.anim.slash.isDone()) {
            this.anim.slash.elapsedTime = 0;
            this.sound.slash.pause();
            this.sound.slash.load();
            this.maxSpeed = this.mSpeed_init;
            this.slash = false;
        }
        if (this.throw && this.anim.throw.isDone()) {
            this.anim.throw.elapsedTime = 0;
            this.sound.throw.pause();
            this.sound.throw.load();
            this.maxSpeed = this.mSpeed_init;
            this.throw = false;
        }
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x / friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y / friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 720 - this.radius;
        }
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x) - 0.5;
                if (this.rotation > atan) {
                    var rotdif = this.rotation - atan;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation += rotdif / 12;
                    } else this.rotation -= rotdif / 12;
                }
                else {
                    var rotdif = atan - this.rotation;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation -= rotdif / 12;
                    } else this.rotation += rotdif / 12;
                }
                var dist = distance(this, ent);
                var difX = Math.cos(Math.atan2(ent.y - this.y, ent.x - this.x));
                var difY = Math.sin(Math.atan2(ent.y - this.y, ent.x - this.x));
                var delta = this.radius + ent.radius - dist;
                if (this.collide(ent) && !ent.dash && !ent.supDash && !ent.lunge) {
                    this.velocity.x = -this.velocity.x / friction;
                    this.velocity.y = -this.velocity.y / friction;
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
                else {
                    if (this.knockBack > 0) {
                        this.velocity.x -= difX * this.acceleration * 5;
                        this.velocity.y -= difY * this.acceleration * 5;
                        this.maxSpeed *= 1.13;
                    } else if (this.dash || this.lunge) {
                        this.velocity.x += Math.cos(this.storedRot) * this.acceleration;
                        this.velocity.y += Math.sin(this.storedRot) * this.acceleration;
                        if (this.lunge && this.anim.lunge.elapsedTime > 0.2)
                            this.rotation = this.storedRot;
                    } else {
                        var left = atan - Math.PI / 2;
                        var right = atan + Math.PI / 2;
                        if (this.left) {
                            this.velocity.x += Math.cos(left) * this.acceleration;
                            this.velocity.y += Math.sin(left) * this.acceleration;
                        } else {
                            this.velocity.x += Math.cos(right) * this.acceleration;
                            this.velocity.y += Math.sin(right) * this.acceleration;
                        }
                        if (dist < this.range) {
                            this.velocity.x -= difX * this.acceleration * 0.8;
                            this.velocity.y -= difY * this.acceleration * 0.8;
                        } else if (dist > this.range + 20) {
                            this.velocity.x += difX * this.acceleration;
                            this.velocity.y += difY * this.acceleration;
                        }
                    }
                }
                if (this.dashCD <= 0 && !this.lunge && !this.slash && !this.throw) {
                    this.sound.dash.play();
                    this.dash = true;
                    this.dashCD = Math.floor(Math.random() * 75) + 105;
                    this.acceleration = 300;
                    this.maxSpeed = 700;
                    this.hitCD = 30;
                    var pointy = this.y + this.velocity.y;
                    var pointx = this.x + this.velocity.x;
                    this.storedRot = Math.atan2(pointy - this.y, pointx - this.x);
                }
                else if (dist < 275 && this.lungeCD <= 0 && !this.dash && !this.throw && !this.slash) {
                    this.landedBlow = false;
                    this.lunge = true;
                    this.lungeCD = Math.floor(Math.random() * 45) + 435;
                    this.acceleration = 225;
                    this.maxSpeed = 0;
                    this.hitCD = 24;
                    this.setRot = false;
                }
                else if (dist > 150 && this.throwCD <= 0 && !this.dash && !this.lunge && !this.slash) {
                    this.throw = true;
                    this.throwCD = 150;
                    this.maxSpeed = 100;
                }
                else if (dist < 150 && this.slashCD <= 0 && !this.dash && !this.lunge && !this.throw) {
                    this.landedBlow = false;
                    this.sound.slash.play();
                    this.slash = true;
                    this.slashCD = 105;
                    this.maxSpeed = 160;
                }
                if (this.lunge && this.hit(ent) && ent.hitCD <= 0) {
                    this.landedBlow = true;
                    this.sound.hit.play();
                    ent.hurt = true;
                    ent.hitCD = 10;
                    ent.health.current -= 3;
                }
                else if (this.throw && this.throwCD == 135) {
                    this.sound.throw.play();
                    var throwRot = this.rotation - Math.atan(23 / 130);
                    var difX = Math.cos(throwRot) * 132;
                    var difY = Math.sin(throwRot) * 132;
                    var throwDir = Math.atan2(ent.y - (this.y + difY), ent.x - (this.x + difX));
                    this.game.addEntity(new Shuriken(this.game, this.x + difX, this.y + difY, throwDir + Math.PI / 6));
                    this.game.addEntity(new Shuriken(this.game, this.x + difX, this.y + difY, throwDir));
                    this.game.addEntity(new Shuriken(this.game, this.x + difX, this.y + difY, throwDir - Math.PI / 6));
                }
                else if (this.slash && this.hit(ent) && ent.hitCD <= 0) {
                    this.landedBlow = true;
                    this.sound.hit.play();
                    ent.hurt = true;
                    ent.hitCD = 5;
                    ent.health.current -= 2;
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

NinjaGuy.prototype.draw = function (ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.dash) this.anim.dash.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.lunge) this.anim.lunge.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.throw) this.anim.throw.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.slash) this.anim.slash.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
};

NinjaGuy.prototype.hit = function (other) {
    if (this.landedBlow) return false;
    else if (this.lunge) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.anim.lunge.currentFrame() == 2 || this.anim.lunge.currentFrame() == 5) {
            var angle = this.rotation + Math.atan(80 / 38);
            acc = Math.abs(angle - atan2);
            while (acc > Math.PI * 2) acc -= (Math.PI * 2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 89;
        }
        else if (this.anim.lunge.currentFrame() == 3 || this.anim.lunge.currentFrame() == 4) {
            var angle = this.rotation + Math.atan(46 / 160);
            acc = Math.abs(angle - atan2);
            while (acc > Math.PI * 2) acc -= (Math.PI * 2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 167;
        }

        if (acc < 0.7) {
            if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                return distance(this, other) < this.range + other.faces;
            else
                return distance(this, other) < this.range + other.sides;
        }
        else return false;
    }
    else if (this.slash) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.anim.slash.currentFrame() == 0) {
            var dagAngle = this.rotation + Math.atan(89 / 63);
            while (dagAngle > Math.PI * 2) dagAngle -= Math.PI * 2;
            if (dagAngle > Math.PI) dagAngle = (Math.PI * 2) - dagAngle;
            acc = Math.abs(dagAngle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
        }
        else if (this.anim.slash.currentFrame() == 1) {
            var dagAngle = this.rotation - Math.atan(5 / 112);
            while (dagAngle > Math.PI * 2) dagAngle -= Math.PI * 2;
            if (dagAngle > Math.PI) dagAngle = (Math.PI * 2) - dagAngle;
            acc = Math.abs(dagAngle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
        }

        if (acc < 0.35) {
            if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                return distance(this, other) < 116 + other.faces;
            else
                return distance(this, other) < 116 + other.sides;
        }
        else return false;
    }
    else return false;
};

function Shuriken(game, x, y, rot) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/shuriken.png'), 0, 0, 20, 20, 1, 1, true, false);
    this.velocity = {};
    var newRot = rot + Math.random() * 0.08 - 0.04;
    this.velocity.x = Math.cos(newRot) * 99999;
    this.velocity.y = Math.sin(newRot) * 99999;
    this.maxSpeed = 800;
    this.radius = Math.sqrt(200);
    this.rotation = 0;

    Entity.call(this, game, x, y);
}

Shuriken.prototype = new Entity();
Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.update = function () {
    this.rotation += Math.PI / 30;
    if (this.collideTop() || this.collideRight() || this.collideLeft() || this.collideBottom())
        this.removeFromWorld = true;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this.collide(ent)) {
            if (ent.player) {
                ent.hurt = true;
                ent.health.current--;
                this.removeFromWorld = true;
            }
            else if (ent.wall || ent.column)
                this.removeFromWorld = true;
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

Shuriken.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
};

function MageGuy(game, lvl) {
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 0, 0, 200, 200, 0.17, 8, true, false);
    this.anim.cast = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 400, 200, 200, 200, 0.2, 3, false, false);
    this.anim.summon = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 0, 200, 200, 200, 1, 1, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 200, 200, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/magic_guy.png'), 200, 200, 200, 200, 0.5, 1, false, false);

    this.sound = {};
    this.sound.summon = new Audio('./sound/summon.mp3');
    this.sound.summon.volume = 0.6;
    this.sound.orbital = new Audio('./sound/orbital.wav');
    this.sound.orbital.volume = 0.21;
    this.sound.fire = new Audio('./sound/fruit.wav');
    this.sound.fire.volume = 0.18;
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.15;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.15;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.15;

    this.alive = true;
    this.enemy = true;
    this.boss = true;
    this.radius = 26;
    this.faces = 30;
    this.sides = 70;
    this.range = 280;
    this.rotation = Math.PI / 2;
    this.acceleration = 50;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 90;
    this.mSpeed_init = 90;
    this.health = getDamage(lvl) * 9 + lvl;
    this.maxHealth = this.health;
    this.storedRot = 0;
    this.engage = true;

    this.orbitals = 0;
    this.knockBack = 0;
    this.stunCD = 0;
    this.ballCD = 135;
    this.summonCD = 15;
    this.orbitalCD = 225;
    this.meteorCD = 0;
    this.hitCD = 0;
    this.strafeCD = 0;
    this.left = false;

    Entity.call(this, game, 640, 125);
}

MageGuy.prototype = new Entity();
MageGuy.prototype.constructor = MageGuy;

MageGuy.prototype.update = function () {
    if (Number.isNaN(this.health)) this.health = this.maxHealth;
    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive && !this.die) {
        if (this.knockBack > 0) this.knockBack--;
        else this.maxSpeed = this.mSpeed_init;
        if (this.stunCD > 0) this.stunCD--;
        if (this.ballCD > 0) this.ballCD--;
        if (this.summonCD > 0) this.summonCD--;
        if (this.orbitalCD > 0) this.orbitalCD--;
        if (this.meteorCD > 0) this.meteorCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.strafeCD > 0) this.strafeCD--;
        else {
            this.strafeCD = Math.floor(Math.random * 150) + 120;
            this.left = !this.left;
        }

        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.sound.hit1.pause();
            this.sound.hit1.load();
            this.sound.hit2.pause();
            this.sound.hit2.load();
            this.sound.hit3.pause();
            this.sound.hit3.load();
            this.hurt = false;
        }
        if (this.cast && this.anim.cast.isDone()) {
            this.anim.cast.elapsedTime = 0;
            this.cast = false;
        }
        if (this.summon && this.anim.summon.isDone()) {
            this.anim.summon.elapsedTime = 0;
            this.summon = false;
        }
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x / friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y / friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 720 - this.radius;
        }
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.player && ent.alive && this.stunCD <= 0) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                if (this.rotation > atan) {
                    var rotdif = this.rotation - atan;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation += rotdif / 24;
                    } else this.rotation -= rotdif / 24;
                }
                else {
                    var rotdif = atan - this.rotation;
                    while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation -= rotdif / 24;
                    } else this.rotation += rotdif / 24;
                }
                var dist = distance(this, ent);
                var difX = Math.cos(atan);
                var difY = Math.sin(atan);
                var delta = this.radius + ent.radius - dist;
                if (this.collide(ent) && !ent.dash && !ent.supDash && !ent.lunge) {
                    this.velocity.x = -this.velocity.x / friction;
                    this.velocity.y = -this.velocity.y / friction;
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
                else {
                    if (this.knockBack > 0) {
                        this.velocity.x -= difX * this.acceleration * 8;
                        this.velocity.y -= difY * this.acceleration * 8;
                        this.maxSpeed *= 1.13;
                    } else {
                        var left = atan - Math.PI / 2;
                        var right = atan + Math.PI / 2;
                        if (this.left) {
                            this.velocity.x += Math.cos(left) * this.acceleration;
                            this.velocity.y += Math.sin(left) * this.acceleration;
                        } else {
                            this.velocity.x += Math.cos(right) * this.acceleration;
                            this.velocity.y += Math.sin(right) * this.acceleration;
                        }
                        if (dist < this.range) {
                            this.velocity.x -= difX * this.acceleration * 0.5;
                            this.velocity.y -= difY * this.acceleration * 0.5;
                        } else if (dist > this.range + 20) {
                            this.velocity.x += difX * this.acceleration;
                            this.velocity.y += difY * this.acceleration;
                        }
                    }
                }
                if (this.orbitals <= 0 && this.summonCD <= 0 && !this.cast) {
                    this.summon = true;
                    this.summonCD = 600;
                }
                else if (this.orbitals > 0 && this.orbitalCD <= 0 && !this.cast && !this.summon) {
                    this.cast = true;
                    this.orbitalCD = 420;
                }
                else if (this.ballCD <= 0 && !this.cast && !this.summon) {
                    this.cast = true;
                    this.ballCD = 240;
                }
                if (this.summon && this.summonCD == 560) {
                    this.sound.summon.play();
                    this.game.addEntity(new Orbital(this.game, this, this.rotation + Math.PI * 2 / 3));
                    this.game.addEntity(new Orbital(this.game, this, this.rotation));
                    this.game.addEntity(new Orbital(this.game, this, this.rotation - Math.PI * 2 / 3));
                    this.orbitals = 3;
                }
                else if (this.cast && this.orbitalCD == 405) {
                    this.sound.orbital.play();
                    var fire = false;
                    for (var j = 0; j < this.game.entities.length; j++) {
                        var ent2 = this.game.entities[j];
                        if (ent2.orbital && !fire) {
                            ent2.fire(ent);
                            fire = true;
                        }
                    }
                }
                else if (this.cast && this.ballCD == 225) {
                    this.sound.fire.play();
                    var direction = Math.atan2(ent.y - (this.y + difY * 75), ent.x - (this.x + difY * 75));
                    if (Math.floor(Math.random() * 4) == 0)
                        this.game.addEntity(new Orange(this.game, this.x + difX * 75, this.y + difY * 75, direction));
                    else
                        this.game.addEntity(new Apple(this.game, this.x + difX * 75, this.y + difY * 75, direction));
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

MageGuy.prototype.draw = function (ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.summon) this.anim.summon.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.cast) this.anim.cast.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
};

function Fruit(game, x, y, rot) {
    this.rotation = rot;
    this.spawnCD = 15;
    Entity.call(this, game, x, y);
}

Fruit.prototype = new Entity();
Fruit.prototype.constructor = Fruit;

Fruit.prototype.update = function () {
    if (this.spawnCD > 0) this.spawnCD--;
    else {
        if (this.collideTop() || this.collideRight() || this.collideLeft() || this.collideBottom())
            this.removeFromWorld = true;
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this.collide(ent)) {
                if (ent.player) {
                    if (ent.alive) {
                        ent.sound.hit3.play();
                        ent.hurt = true;
                        ent.health.current -= this.damage;
                        ent.hitCD = 4;
                        this.removeFromWorld = true;
                    } else this.removeFromWorld = true;
                }
                else if (ent.wall || ent.column)
                    this.removeFromWorld = true;
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
};

Fruit.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
};

function Apple(game, x, y, rot) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/fruit.png'), 0, 0, 40, 40, 0.2, 4, true, false);
    this.velocity = {};
    this.velocity.x = Math.cos(rot) * 99999;
    this.velocity.y = Math.sin(rot) * 99999;
    this.maxSpeed = 650;
    this.damage = 1;
    this.radius = 11;
    Fruit.call(this, game, x, y, rot);
}

Apple.prototype = new Fruit();
Apple.prototype.constructor = Apple;

function Orange(game, x, y, rot) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/orange.png'), 0, 0, 40, 40, 0.2, 4, true, false);
    this.velocity = {};
    this.velocity.x = Math.cos(rot) * 99999;
    this.velocity.y = Math.sin(rot) * 99999;
    this.maxSpeed = 450;
    this.damage = 3;
    this.radius = 12;
    Fruit.call(this, game, x, y, rot);
}

Orange.prototype = new Fruit();
Orange.prototype.constructor = Orange;

function Orbital(game, caster, rot) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/melon.png'), 0, 0, 40, 40, 0.2, 4, true, false);
    this.orbital = true;
    this.floatRot = rot;
    this.center = caster;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 550;
    this.damage = 2;
    this.radius = 14;
    this.orbit = true;
    Fruit.call(this, game, caster.x, caster.y, 0);
}

Orbital.prototype = new Fruit();
Orbital.prototype.constructor = Orbital;

Orbital.prototype.update = function () {
    if (this.orbit) {
        this.floatRot += Math.PI / 150;
        this.x = this.center.x + Math.cos(this.floatRot) * 100;
        this.y = this.center.y + Math.sin(this.floatRot) * 100;
    }
    if (this.collideTop() || this.collideRight() || this.collideLeft() || this.collideBottom()) {
        if (!this.orbit) {
            this.center.orbitals--;
            this.removeFromWorld = true;
        }
    }
    if (!this.center.alive) this.removeFromWorld = true;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this.collide(ent)) {
            if (ent.player) {
                if (ent.alive) {
                    ent.sound.hit3.play();
                    ent.hurt = true;
                    ent.health.current -= this.damage;
                    ent.hitCD = 6;
                    this.center.orbitals--;
                    this.removeFromWorld = true;
                } else this.removeFromWorld = true;
            }
            else if ((ent.wall || ent.column) && !this.orbit) {
                this.center.orbitals--;
                this.removeFromWorld = true;
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
};

Orbital.prototype.fire = function (target) {
    this.orbit = false;
    this.rotation = Math.atan2(target.y - this.y, target.x - this.x);
    this.velocity.x = Math.cos(this.rotation) * 99999;
    this.velocity.y = Math.sin(this.rotation) * 99999;
};