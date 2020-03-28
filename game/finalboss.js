function Smoothie(game) {
    // sprites
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 0, 0, 300, 300, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 0, 0, 300, 300, 0.2, 8, true, false);
    this.anim.swp = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 0, 300, 300, 300, 0.125, 4, false, false);
    this.anim.jab = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 1200, 300, 300, 300, 0.125, 4, false, false);
    this.anim.puke = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 1500, 600, 300, 300, 0.2, 3, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 2100, 900, 300, 300, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 0, 900, 300, 300, (0.5 / 3), 3, false, false);
    this.anim.laser = {};
    this.anim.laser.start = new Animation(ASSET_MANAGER.getAsset('./img/entities/final_boss.png'), 0, 600, 300, 300, 0.15, 2, false, false);
    this.anim.laser.sweep = new Animation(ASSET_MANAGER.getAsset('./img/entities/boss_laser.png'), 0, 0, 2500, 2500, 0.1, 2, true, false);

    // sound
    this.sound = {};
    this.sound.jab = new Audio('./sound/bat_p.wav');
    this.sound.jab.volume = 0.375;
    this.sound.swipe = new Audio('./sound/slash.wav');
    this.sound.swipe.volume = 0.3;
    this.sound.puke = new Audio('./sound/puke.wav');
    this.sound.puke.volume = 0.35;
    this.sound.laser = new Audio('./sound/boss_laser.wav');
    this.sound.laser.volume = 0.3;
    this.sound.hit1 = new Audio('./sound/hit1.wav');
    this.sound.hit1.volume = 0.18;
    this.sound.hit2 = new Audio('./sound/hit2.wav');
    this.sound.hit2.volume = 0.18;
    this.sound.hit3 = new Audio('./sound/hit3.wav');
    this.sound.hit3.volume = 0.18;

    // properties
    this.alive = true;
    this.enemy = true;
    this.boss = true;
    this.radius = 30;
    this.faces = 48;
    this.sides = 48;
    this.rotation = Math.PI / 2;
    this.acceleration = 85;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 110;
    this.mSpeed_init = this.maxSpeed;
    this.health = 1500;
    this.maxHealth = this.health;
    this.engage = true;
    this.wall = new Wall(game, 0, 0, 1280, 100);

    // cooldowns
    this.knockBack = 0;
    this.atkCD = Math.floor(Math.random() * 30) + 30;
    this.swpCD = 0;
    this.jabCD = 0;
    this.pukeCD = 0;
    this.laserCD = 480;
    this.sweepCD = 0;
    this.stunCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 1150, 130);
}

Smoothie.prototype = new Entity();
Smoothie.prototype.constructor = Smoothie;

Smoothie.prototype.update = function() {
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
        // cooldowns
        if (this.knockBack > 0) this.knockBack--;
        else this.maxSpeed = this.mSpeed_init;
        if (this.atkCD > 0) this.atkCD--;
        if (this.swpCD > 0) this.swpCD--;
        if (this.jabCD > 0) this.jabCD--;
        if (this.pukeCD > 0) this.pukeCD--;
        if (this.laserCD > 0) this.laserCD--;
        if (this.sweepCD > 0) this.sweepCD--;
        if (this.stunCD > 0) this.stunCD--;
        if (this.hitCD > 0) this.hitCD--;

        // animations
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
        if (this.swipe && this.anim.swp.isDone()) {
            this.anim.swp.elapsedTime = 0;
            this.maxSpeed = this.mSpeed_init;
            this.swipe = false;
            this.atkCD = Math.floor(Math.random() * 30) + 60;
        }
        if (this.jab && this.anim.jab.isDone()) {
            this.anim.jab.elapsedTime = 0;
            this.maxSpeed = this.mSpeed_init;
            this.jab = false;
            this.atkCD = Math.floor(Math.random() * 30) + 60;
        }
        if (this.puke && this.anim.puke.isDone()) {
            this.anim.puke.elapsedTime = 0;
            this.maxSpeed = this.mSpeed_init;
            this.puke = false;
            this.pukeCD = Math.floor(Math.random() * 180) + 120;
            this.atkCD = Math.floor(Math.random() * 30) + 60;
        }
        if (this.laser) {
            if (this.start && this.anim.laser.start.isDone()) {
                this.anim.laser.start.elapsedTime = 0;
                this.start = false;
                this.sweep = true;
                this.sweepCD = 120;
                this.game.addEntity(this.wall);
            }
            if (this.sweep && this.sweepCD <= 0) {
                this.anim.laser.sweep.elapsedTime = 0;
                this.sweep = false;
                this.laser = false;
                this.laserCD = Math.floor(Math.random() * 300) + 600;
                this.atkCD = Math.floor(Math.random() * 30) + 60;
                this.wall.removeFromWorld = true;
            }
        }

        // boundary collisions
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

        // decision tree
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.player && ent.alive && this.stunCD <= 0) {
                if (this.laser) {
                    if (!this.start && !this.sweep) {
                        if (this.x < 635 || this.x > 645 || this.y < 95 || this.y > 105) {
                            var atan = Math.atan2(100 - this.y, 640 - this.x);
                            if (this.rotation > atan) {
                                var rotdif = this.rotation - atan;
                                while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                                if (rotdif > Math.PI) {
                                    rotdif = Math.PI * 2 - rotdif;
                                    this.rotation += rotdif / 30;
                                } else this.rotation -= rotdif / 30;
                            } else {
                                var rotdif = atan - this.rotation;
                                while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                                if (rotdif > Math.PI) {
                                    rotdif = Math.PI * 2 - rotdif;
                                    this.rotation -= rotdif / 30;
                                } else this.rotation += rotdif / 30;
                            }
                            this.velocity.x += Math.cos(atan) * this.acceleration;
                            this.velocity.y += Math.sin(atan) * this.acceleration;
                        } else {
                            var rot = this.rotation;
                            while (rot > Math.PI * 2) rot -= Math.PI * 2;
                            if (rot >= Math.PI / 15) this.rotation -= Math.PI / 30;
                            else if (rot <= -Math.PI / 15) this.rotation += Math.PI / 30;
                            else {
                                this.start = true;
                                this.sound.laser.play();
                            }
                        }
                    } else if (this.sweep) {
                        this.rotation += Math.PI / 120;
                        if (this.hit(ent) && ent.hitCD <= 0) {
                            this.landedBlow = true;
                            ent.sound.hit3.play();
                            ent.hurt = true;
                            ent.health.current -= 5;
                            ent.hitCD = 30;
                        }
                    }
                } else {
                    var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                    if (this.rotation > atan) {
                        var rotdif = this.rotation - atan;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation += rotdif / 30;
                        } else this.rotation -= rotdif / 30;
                    } else {
                        var rotdif = atan - this.rotation;
                        while (rotdif > Math.PI * 2) rotdif -= Math.PI * 2;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation -= rotdif / 30;
                        } else this.rotation += rotdif / 30;
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
                    } else {
                        if (this.knockBack > 0) {
                            this.velocity.x -= difX * this.acceleration * 5;
                            this.velocity.y -= difY * this.acceleration * 5;
                            this.maxSpeed *= 1.13;
                        } else {
                            if (dist < 110) {
                                this.velocity.x -= difX * this.acceleration * 0.5;
                                this.velocity.y -= difY * this.acceleration * 0.5;
                            } else if (dist > 130) {
                                this.velocity.x += difX * this.acceleration;
                                this.velocity.y += difY * this.acceleration;
                            }
                        }
                    }
                    if (this.laserCD <= 0 && !this.laser && !this.swipe && !this.jab && !this.puke) {
                        this.landedBlow = false;
                        this.laser = true;
                        this.wall.removeFromWorld = false;
                    } else if (this.atkCD <= 0) {
                        if (this.swpCD <= 0 && dist < 90 && !this.laser && !this.jab && !this.puke) {
                            this.landedBlow = false;
                            this.sound.swipe.play();
                            this.swipe = true;
                            this.swpCD = Math.floor(Math.random() * 30) + 60;
                            this.maxSpeed = 70;
                        } else if (this.jabCD <= 0 && dist < 140 && !this.laser && !this.swipe && !this.puke) {
                            this.landedBlow = false;
                            this.sound.jab.play();
                            this.jab = true;
                            this.jabCD = Math.floor(Math.random() * 30) + 60;
                            this.maxSpeed = 150;
                        } else if (this.pukeCD <= 0 && !this.laser && !this.swipe && !this.jab) {
                            this.puke = true;
                            this.pukeCD = 112;
                            this.maxSpeed = 10;
                        }
                    }
                    if (this.swipe && this.hit(ent) && ent.hitCD <= 0) {
                        this.landedBlow = true;
                        ent.sound.hit2.play();
                        ent.hurt = true;
                        ent.health.current -= 3;
                        ent.hitCD = 10;
                        ent.stunCD = 6;
                    } else if (this.jab && this.hit(ent) && ent.hitCD <= 0) {
                        this.landedBlow = true;
                        ent.sound.hit1.play();
                        ent.hurt = true;
                        ent.health.current -= 3;
                        ent.hitCD = 10;
                        ent.stunCD = 6;
                    } else if (this.puke && this.pukeCD == 100) {
                        this.sound.puke.play();
                        var pukeX = Math.cos(this.rotation) * 60;
                        var pukeY = Math.sin(this.rotation) * 60;
                        this.game.addEntity(new Puke(this.game, this.x + pukeX, this.y + pukeY, this.rotation));
                    }
                }
            }
        }
    }

    // speed normalization
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

Smoothie.prototype.draw = function(ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.sweep) this.anim.laser.sweep.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.start) this.anim.laser.start.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.swipe) this.anim.swp.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.jab) this.anim.jab.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.puke) this.anim.puke.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
};

Smoothie.prototype.hit = function(other) {
    if (this.landedBlow) return false;
    else {
        var acc = 2;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.swipe) {
            if (this.anim.swp.currentFrame() == 0) {
                var angle = this.rotation + Math.atan(70 / 42);
                while (angle > Math.PI * 2) angle -= Math.PI * 2;
                if (angle > Math.PI) angle = (Math.PI * 2) - angle;
                acc = Math.abs(angle - atan2);
                if (acc < 0.25) {
                    if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                        return distance(this, other) < 82 + other.faces;
                    else
                        return distance(this, other) < 82 + other.sides;
                } else return false;
            } else {
                var angle = this.rotation;
                while (angle > Math.PI * 2) angle -= Math.PI * 2;
                if (angle > Math.PI) angle = (Math.PI * 2) - angle;
                acc = Math.abs(angle - atan2);
                if (acc < 1) {
                    if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                        return distance(this, other) < 66 + other.faces;
                    else
                        return distance(this, other) < 66 + other.sides;
                } else return false;
            }
        } else if (this.jab) {
            if (this.anim.jab.currentFrame() == 0) {
                var angle = this.rotation + Math.atan(70 / 42);
                while (angle > Math.PI * 2) angle -= Math.PI * 2;
                if (angle > Math.PI) angle = (Math.PI * 2) - angle;
                acc = Math.abs(angle - atan2);
                this.range = 82;
            } else {
                var angle = this.rotation;
                while (angle > Math.PI * 2) angle -= Math.PI * 2;
                if (angle > Math.PI) angle = (Math.PI * 2) - angle;
                acc = Math.abs(angle - atan2);
                this.range = 116;
            }
            if (acc < 0.25) {
                if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                    return distance(this, other) < this.range + other.faces;
                else
                    return distance(this, other) < this.range + other.sides;
            } else return false;
        } else if (this.sweep) {
            var angle = this.rotation;
            while (angle > Math.PI * 2) angle -= Math.PI * 2;
            if (angle > Math.PI) angle = (Math.PI * 2) - angle;
            acc = Math.abs(angle - atan2);
            if (acc < Math.PI / 6) return true;
            else return false;
        }
    }
};

function Puke(game, x, y, rot) {
    this.anim = {};
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/boss_puke.png'), 0, 0, 200, 200, 1, 1, false, false);
    this.anim.land = new Animation(ASSET_MANAGER.getAsset('./img/entities/boss_puke.png'), 0, 0, 200, 200, 0.15, 4, false, false);
    this.rotation = rot;
    this.velocity = {};
    this.velocity.x = Math.cos(rot) * 99999;
    this.velocity.y = Math.sin(rot) * 99999;
    this.maxSpeed = 350;
    this.radius = 15;
    this.move = true;

    Entity.call(this, game, x, y);
}

Puke.prototype = new Entity();
Puke.prototype.constructor = Puke;

Puke.prototype.update = function() {
    if (this.move && this.anim.move.isDone()) {
        this.anim.move.elapsedTime = 0;
        this.move = false;
        this.maxSpeed = 100;
    }
    if (!this.move) {
        if (this.anim.land.isDone()) {
            this.anim.land.elapsedTime = 0;
            this.removeFromWorld = true;
        }
        if (this.anim.land.currentFrame() == 0)
            this.radius = 15;
        else if (this.anim.land.currentFrame() == 1)
            this.radius = 25;
        else if (this.anim.land.currentFrame() == 2)
            this.radius = 35;
        else
            this.radius = 30;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this.collide(ent)) {
            if (ent.player) {
                ent.sound.hit1.play();
                ent.hurt = true;
                ent.health.current -= 4;
                ent.hitCD = 8;
                ent.stunCD = 15;
                this.removeFromWorld = true;
            } else if (ent.wall)
                this.removeFromWorld = true;
        }
    }
    this.velocity.x += Math.cos(this.rotation) * 999;
    this.velocity.y += Math.sin(this.rotation) * 999;
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

Puke.prototype.draw = function(ctx) {
    if (this.move) this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else this.anim.land.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
};