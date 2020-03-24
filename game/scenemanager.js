function Menu(game, image) {
    this.menu = true;
    this.image = image;
    Entity.call(this, game, 0, 0);
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function () {
};

Menu.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
};

function TitleScreen(game) {
    this.menu = true;
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/menus/title.png'), 0, 0, 1280, 720, 0.25, 8, true, false);
    this.rotation = 0;

    Entity.call(this, game, 640, 360);
}

TitleScreen.prototype = new Entity();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.update = function () {
};

TitleScreen.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
};

function Credits(game, manager) {
    this.manager = manager;
    Menu.call(this, game, './img/menus/credits.png');
}

Credits.prototype = new Menu();
Credits.prototype.constructor = Credits;

Credits.prototype.update = function () {
    var hover = false;
    if (this.game.mouse.x > 1010 && this.game.mouse.x < 1060
        && this.game.mouse.y > 119 && this.game.mouse.y < 169)
        hover = true;
    if (this.game.click && hover)
        this.manager.changeBackground(this.manager.menus.title);
};

function Fade(game, tofrom) {
    this.menu = true;
    this.tofrom = tofrom;
    this.toBlack = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1280, 720, 0.1, 5, false, false);
    this.fromBlack = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1280, 720, 0.1, 6, false, true);
    this.black = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 5120, 0, 1280, 720, 1, 1, true, false);
    this.clear = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1, 1, 1, 1, true, true);
    this.rotation = 0;
    this.killTmr = 10;
    this.active = false;
    Entity.call(this, game, 640, 360);
}

Fade.prototype = new Entity();
Fade.prototype.constructor = Fade;

Fade.prototype.update = function () {
    if (this.killTmr > 0) this.killTmr--;
    if (this.tofrom == 'toBlack' && this.toBlack.isDone()) {
        this.toBlack.elapsedTime = 0;
        this.tofrom = 'black';
        this.killTmr = 15;
    }
    if (this.tofrom == 'fromBlack' && this.fromBlack.isDone()) {
        this.fromBlack.elapsedTime = 0;
        this.tofrom = 'clear';
        this.killTmr = 0;
    }
    if ((this.tofrom == 'black' || this.tofrom == 'clear') && this.killTmr <= 0)
        this.removeFromWorld = true;
};

Fade.prototype.draw = function (ctx) {
    if (this.tofrom == 'toBlack')
        this.toBlack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.tofrom == 'fromBlack')
        this.fromBlack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.tofrom == 'black')
        this.black.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else
        this.clear.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
};

function SelectDif(game) {
    this.menu = true;
    this.none = ASSET_MANAGER.getAsset('./img/menus/none_dif.png');
    this.casual = ASSET_MANAGER.getAsset('./img/menus/casual_dif.png');
    this.classic = ASSET_MANAGER.getAsset('./img/menus/classic_dif.png');
    this.hover = 'none';

    Entity.call(this, game, 0, 0);
}

SelectDif.prototype = new Entity();
SelectDif.prototype.constructor = SelectDif;

SelectDif.prototype.update = function () {
    if (this.game.mouse.x > 525 && this.game.mouse.x < 755) {
        if (this.game.mouse.y > 300 && this.game.mouse.y < 390)
            this.hover = 'casual';
        else if (this.game.mouse.y > 390 && this.game.mouse.y < 480)
            this.hover = 'classic';
        else
            this.hover = 'none';
    }
    else
        this.hover = 'none';
};

SelectDif.prototype.draw = function (ctx) {
    if (this.hover == 'casual')
        ctx.drawImage(this.casual, 0, 0);
    else if (this.hover == 'classic')
        ctx.drawImage(this.classic, 0, 0);
    else
        ctx.drawImage(this.none, 0, 0);
};

function CreditsBtn(game, manager) {
    this.image = ASSET_MANAGER.getAsset('./img/menus/creditsbutton.png');
    this.credits = new Credits(game, manager);
    this.manager = manager;
    this.hover = false;
    Entity.call(this, game, 0, 0);
}

CreditsBtn.prototype = new Entity();
CreditsBtn.prototype.constructor = CreditsBtn;

CreditsBtn.prototype.update = function () {
    this.hover = false;
    if (this.game.mouse.x > 40 && this.game.mouse.x < 170
        && this.game.mouse.y > 650 && this.game.mouse.y < 700)
        this.hover = true;
    if (this.game.click && this.hover) {
        this.click = true;
        this.manager.changeBackground(this.credits);
    }
    else this.click = false;
};

CreditsBtn.prototype.draw = function (ctx) {
    if (this.click)
        ctx.drawImage(this.image, 2560, 0, 1280, 720, 0, 0, 1280, 720);
    else if (this.hover)
        ctx.drawImage(this.image, 1280, 0, 1280, 720, 0, 0, 1280, 720);
    else
        ctx.drawImage(this.image, 0, 0, 1280, 720, 0, 0, 1280, 720);
};

function getTrans(weapon) {
    return (71.4 - (weapon.scale * 71.4)) / 2;
}

function FadeTimer(game) {
    this.game = game;
    this.init = 0;
    this.active = false;
}

FadeTimer.prototype.start = function () {
    this.active = true;
    this.init = this.game.timer.gameTime;
};

FadeTimer.prototype.check = function () {
    if (this.active)
        return this.game.timer.gameTime - this.init;
    else
        return 0;
};

FadeTimer.prototype.stop = function () {
    this.active = false;
    this.init = 0;
};

FadeTimer.prototype.reset = function () {
    this.init = this.game.timer.gameTime;
};

function SceneManager(game) {
    this.manager = true;
    this.game = game;
    this.difficulty = 0;
    this.levels = [];
    this.level = { current: 0, clear: false };
    this.player = new Frump(game);
    this.oldWeapon = null;
    this.arrow = new Arrow(game, this);
    this.arrow2 = new Arrow2(game, this);
    this.bosses = [0, 1, 2, 3];
    this.bossArray = [];
    this.clear = [false, false, false, false];

    this.sound = {};
    this.sound.menus = new Audio('./sound/menus.mp3');
    this.sound.game = new Audio('./sound/game.mp3');
    this.sound.swap = new Audio('./sound/weapon_swap.wav');
    this.sound.swap.volume = 0.2;
    this.menus = {};
    this.menus.title = new TitleScreen(game);
    this.menus.dif = new SelectDif(game);
    this.menus.win = new Menu(game, './img/menus/win.png');
    this.menus.lose = new Menu(game, './img/menus/game over.png');
    this.menus.cont = new Menu(game, './img/menus/continued.png');
    this.menus.creditsBtn = new CreditsBtn(game, this);
    this.menus.warning = new Menu(game, './img/menus/warning.png');
    this.menus.autosave = new Menu(game, './img/menus/autosave.png');
    this.menus.intro = [];
    this.menus.street = [];
    this.menus.boss = [];
    this.menus.story = [];
    this.menus.intro.push(new Menu(game, './img/menus/intro1.png'));
    this.menus.intro.push(new Menu(game, './img/menus/intro2.png'));
    this.menus.intro.push(new Menu(game, './img/menus/intro3.png'));
    this.menus.boss.push(new Menu(game, './img/menus/boss0.png'));
    this.menus.boss.push(new Menu(game, './img/menus/boss1.png'));
    this.menus.boss.push(new Menu(game, './img/menus/boss2.png'));
    this.menus.boss.push(new Menu(game, './img/menus/boss3.png'));
    this.menus.boss.push(new Menu(game, './img/menus/boss4.png'));
    this.menus.story.push(new Menu(game, './img/menus/story0.png'));
    this.menus.story.push(new Menu(game, './img/menus/story1.png'));
    this.menus.story.push(new Menu(game, './img/menus/story2.png'));
    this.menus.story.push(new Menu(game, './img/menus/story3.png'));
    this.timer = new FadeTimer(game);
    this.wait = true;

    this.activeBG = this.menus.title;
    this.start = true;
    this.swapHeld = 0;
    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function () {
    if (this.changedBG) this.updateBackground();
    if (this.start) this.startGame();
    if (this.activeBG.menu) {
        if (this.activeBG === this.menus.title) {
            var hover = false;
            if (this.game.mouse.x > 630 && this.game.mouse.x < 1000
                && this.game.mouse.y > 480 && this.game.mouse.y < 660)
                hover = true;
            if (this.game.click && this.timer.init == 0 && hover) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.start();
            }
            if (this.timer.check() >= 0.5) {
                this.sound.menus.pause();
                this.changeBackground(this.menus.warning);
                this.timer.reset();
            }
        }
        else if (this.activeBG === this.menus.warning) {
            if (this.game.click && this.timer.check() >= 1) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.reset();
                this.wait = false;
            }
            else if (!this.wait && this.timer.check() >= 0.5) {
                this.changeBackground(this.menus.autosave);
                this.timer.reset();
                this.wait = true;
            }
        }
        else if (this.activeBG === this.menus.autosave) {
            if (this.game.click && this.timer.check() >= 0.5) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.reset();
                this.wait = false;
            }
            else if (!this.wait && this.timer.check() >= 0.5) {
                this.changeBackground(this.menus.intro[0]);
                this.sound.game.volume = 0.15;
                this.sound.game.loop = true;
                this.sound.game.play();
                this.timer.reset();
                this.wait = true;
            }
        }
        else if (this.activeBG === this.menus.intro[0]) {
            if (this.game.click && this.timer.check() >= 0.5) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.reset();
                this.wait = false;
            }
            else if (!this.wait && this.timer.check() >= 0.5) {
                this.changeBackground(this.menus.intro[1]);
                this.timer.reset();
                this.wait = true;
            }
        }
        else if (this.activeBG === this.menus.intro[1]) {
            if (this.game.click && this.timer.check() >= 0.5) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.reset();
                this.wait = false;
            }
            else if (!this.wait && this.timer.check() >= 0.5) {
                this.changeBackground(this.menus.intro[2]);
                this.timer.reset();
                this.wait = true;
            }
        }
        else if (this.activeBG === this.menus.intro[2]) {
            if (this.game.click && this.timer.check() >= 0.5) {
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.reset();
                this.wait = false;
            }
            else if (!this.wait && this.timer.check() >= 0.5) {
                this.buildLevelOne(this.game);
                this.bossDead = false;
                this.player.weapon = new Weapon(this.game, this.player, 0, 0);
                this.player.weapon.hidden = false;
                this.player.weapon.floating = false;
                var dif = getTrans(this.player.weapon);
                this.player.weapon.x = dif - 5;
                this.player.weapon.y = 15 + dif;
                this.player.x = 515;
                this.player.y = 470;
                this.player.health.current = this.player.health.max;
                this.player.alive = true;
                this.changeBackground(this.levels[0].houses[5]);
                this.saveProgress(this.levels[0]);
                this.timer.stop();
            }
        }
        else if ((this.activeBG === this.menus.boss[this.bossArray[this.level.current]]
            || this.activeBG === this.menus.boss[4]) && this.game.click && this.timer.check() >= 1) {
            var room = this.levels[this.level.current].houses[4];
            this.player.x = room.spawn.x;
            this.player.y = room.spawn.y;
            this.changeBackground(room);
            this.timer.stop();
        }
        else if (this.activeBG === this.menus.story[3] && this.game.click && this.timer.check() >= 1) {
            this.timer.stop();
            this.sound.menus.pause();
            this.sound.menus.volume = 0.3;
            this.sound.menus.load();
            this.sound.menus.play();
            this.changeBackground(this.menus.win);
        }
        else if (this.activeBG === this.menus.story[this.level.current]
            && this.game.click && this.timer.check() >= 1) {
            this.timer.stop();
            this.sound.menus.pause();
            this.sound.menus.volume = 0.3;
            this.sound.game.play();
            this.changeBackground(this.levels[this.level.current].houses[4]);
        }
        else if (this.activeBG === this.menus.win && this.game.enter)
            this.changeBackground(this.menus.title);
        else if (this.activeBG === this.menus.lose && this.game.enter) {
            this.sound.menus.load();
            this.sound.menus.volume = 0.3;
            this.sound.menus.play();
            this.changeBackground(this.menus.title);
        }
        // for difficulty selection - not fully implemented
        // if (this.activeBG === this.menus.title && this.game.click) {
        //     this.game.addEntity(this.menus.dif);
        //     this.activeBG = this.menus.dif;
        // }
        // else if (this.activeBG === this.menus.dif && this.game.click && this.menus.dif.hover != 'none') {
        //     if (this.menus.dif.hover == 'classic')
        //         this.difficulty = 1;
        //     this.changeBackground(this.levels[0].houses[5]);
        // }
    }
    else {
        if (!this.activeBG.menu) {
            if (!this.player.alive && !this.player.die && this.timer.init == 0) {
                this.sound.game.pause();
                this.sound.game.load();
                this.sound.menus.pause();
                this.sound.menus.load();
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.start();
            }
            else if (!this.player.alive && this.timer.check() >= 0.5) {
                this.timer.stop();
                this.reload(this.level.current);
                this.sound.game.play();
            }
            for (var i = this.activeBG.enemies.length - 1; i >= 0; --i) {
                var ent = this.activeBG.enemies[i];
                if (!ent.alive && !ent.die) {
                    ent.removeFromWorld = true;
                    this.activeBG.enemies.splice(i, 1);
                }
            }
            if (this.activeBG === this.levels[this.level.current].houses[4]
                && this.activeBG.enemies.length == 0 && !this.clear[this.level.current]) {
                this.clear[this.level.current] = true;
                this.game.addEntity(new Fade(this.game, 'toBlack'));
                this.timer.start();
            }
        }
        if (!this.activeBG.menu && this.timer.init > 0 && this.player.alive) {
            if (this.level.current == 3 && this.activeBG.enemies.length == 0) {
                if (this.timer.check() >= 0.5 && this.activeBG === this.levels[3].houses[4]) {
                    this.changeBackground(this.menus.story[3]);
                    this.timer.reset();
                }
                else if (this.timer.check() >= 0.5 && this.activeBG === this.levels[3].streets[5]) {
                    this.sound.game.pause();
                    this.sound.game.load();
                    this.sound.menus.load();
                    this.sound.menus.volume = 0.15;
                    this.sound.menus.play();
                    this.changeBackground(this.menus.boss[4]);
                    this.timer.reset();
                }
            }
            else if (this.timer.check() >= 0.5 && this.activeBG.enemies.length == 0) {
                if (this.activeBG === this.levels[this.level.current].houses[4]) {
                    this.saveProgress(this.levels[this.level.current]);
                    this.player.health.current = this.player.health.max;
                    this.changeBackground(this.menus.story[this.level.current]);
                    this.timer.reset();
                }
                else if (this.activeBG === this.levels[this.level.current].streets[5]) {
                    this.sound.game.pause();
                    this.sound.menus.load();
                    this.sound.menus.volume = 0.15;
                    this.sound.menus.play();
                    this.changeBackground(this.menus.boss[this.bossArray[this.level.current]]);
                    this.timer.reset();
                }
            }


        }
        if (!this.activeBG.menu) {
            if (this.activeBG.enemies.length == 0) {
                this.activeBG.drop.hidden = false;
                if (this.game.player.interact) this.swapHeld++;
                else this.swapHeld = 0;
                if (this.swapHeld > 15 && distance(this.player, this.activeBG.drop) < 100) {
                    this.sound.swap.play();
                    var old = this.player.weapon;
                    if (old.ability) old.ability.removeFromWorld = true;
                    this.player.weapon = this.activeBG.drop;
                    if (this.player.weapon.ability) {
                        this.player.weapon.ability.removeFromWorld = false;
                        this.game.addEntity(this.player.weapon.ability);
                    }
                    this.player.weapon.floating = false;
                    var dif = getTrans(this.player.weapon);
                    this.player.weapon.x = dif - 5;
                    this.player.weapon.y = 15 + dif;

                    old.x = this.player.x;
                    old.y = this.player.y;
                    old.floating = true;
                    this.activeBG.drop = old;
                    this.swapHeld = 0;
                    if (this.player.weapon.type == 'knife')
                        this.player.faces = 34;
                    else if (this.player.weapon.type == 'bat')
                        this.player.faces = 28;
                }
            }
            this.checkBounds();
        }
    }
};

SceneManager.prototype.draw = function (ctx) {
};

SceneManager.prototype.startGame = function () {
    this.game.addEntity(this.activeBG);
    this.game.addEntity(this.menus.creditsBtn);
    this.sound.menus.volume = 0.3;
    this.sound.menus.loop = true;
    this.sound.menus.play();
    this.start = false;
};

SceneManager.prototype.changeBackground = function (nextBG) {
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.activeBG.walls[i].removeFromWorld = true;
        this.activeBG.door.removeFromWorld = true;
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.activeBG.enemies[i].removeFromWorld = true;
        this.activeBG.drop.removeFromWorld = true;
        this.arrow.removeFromWorld = true;
        this.arrow2.removeFromWorld = true;
        this.player.removeFromWorld = true;
        this.player.UI.removeFromWorld = true;
        this.player.dashInd.removeFromWorld = true;
        this.player.weapon.removeFromWorld = true;
        if (this.player.weapon.ability)
            this.player.weapon.ability.removeFromWorld = true;
        this.player.health.removeFromWorld = true;
    } else this.menus.creditsBtn.removeFromWorld = true;
    this.activeBG.removeFromWorld = true;

    this.prevBG = this.activeBG;
    this.activeBG = nextBG;
    this.game.addEntity(this.activeBG);
    this.changedBG = true;
};

SceneManager.prototype.updateBackground = function () {
    // reset entities to NOT remove from world
    this.prevBG.removeFromWorld = false;
    if (!this.prevBG.menu) {
        for (var i = 0; i < this.prevBG.walls.length; i++)
            this.prevBG.walls[i].removeFromWorld = false;
        this.prevBG.door.removeFromWorld = false;
        for (var i = 0; i < this.prevBG.enemies.length; i++)
            this.prevBG.enemies[i].removeFromWorld = false;
        this.prevBG.drop.removeFromWorld = false;
    } else this.menus.creditsBtn.removeFromWorld = false;
    this.arrow.removeFromWorld = false;
    this.arrow2.removeFromWorld = false;
    this.player.removeFromWorld = false;
    this.player.UI.removeFromWorld = false;
    this.player.dashInd.removeFromWorld = false;
    this.player.weapon.removeFromWorld = false;
    if (this.player.weapon.ability)
        this.player.weapon.ability.removeFromWorld = false;
    this.player.health.removeFromWorld = false;

    // add entities back into game engine
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
        this.game.addEntity(this.activeBG.door);
        this.game.addEntity(this.player);
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.game.addEntity(this.activeBG.walls[i]);
        this.game.addEntity(this.player.UI);
        this.game.addEntity(this.activeBG.drop);
        this.game.addEntity(this.player.weapon);
        this.game.addEntity(this.player.dashInd);
        if (this.player.weapon.ability)
            this.game.addEntity(this.player.weapon.ability);
        this.game.addEntity(this.player.health);
        this.game.addEntity(this.arrow2);
        this.game.addEntity(this.arrow);
        if (this.prevBG.menu)
            this.game.addEntity(new Fade(this.game, 'fromBlack'));
    }
    else if (this.activeBG === this.menus.title)
        this.game.addEntity(this.menus.creditsBtn);
    this.changedBG = false;
};

SceneManager.prototype.checkBounds = function () {
    if (this.activeBG === this.levels[this.level.current].streets[5] && this.player.collideRight()) {
        if (!this.activeBG.neighbors[1] && this.level.current < 3) {
            if (this.level.current == 0) this.buildLevelTwo(this.game);
            else if (this.level.current == 1) this.buildLevelThree(this.game);
        }
        if (this.activeBG.neighbors[0].enemies.length == 0 && this.activeBG.enemies.length == 0
            && this.activeBG.neighbors[1]) {
            this.level.current++;
            this.player.x = 640;
            this.player.y = 640;
            var temp = this.player.velocity.x;
            this.player.velocity.x = this.player.velocity.y;
            this.player.velocity.y = -temp;
            this.changeBackground(this.activeBG.neighbors[1]);
        }
    }
    else if (this.activeBG === this.levels[this.level.current].streets[0] && this.player.collideBottom()) {
        if (this.activeBG.enemies.length == 0 && this.activeBG.neighbors[2]) {
            this.level.current--;
            this.player.x = 1210;
            this.player.y = 580;
            var temp = this.player.velocity.x;
            this.player.velocity.x = -this.player.velocity.y;
            this.player.velocity.y = temp;
            this.changeBackground(this.activeBG.neighbors[2]);
        }
    }
    else if (this.player.collide(this.activeBG.door) && this.activeBG.enemies.length == 0) {
        if (this.activeBG.door.x == 4 || this.activeBG.door.x == 0)
            this.changeBackground(this.activeBG.neighbors[3]);
        else if (this.activeBG.door.x == 1254 || this.activeBG.door.x == 1270 || this.activeBG.door.x == 1144)
            this.changeBackground(this.activeBG.neighbors[1]);
        else if (this.activeBG.door.y == 0) {
            if (this.activeBG.neighbors[0].enemies.length == 0)
                this.changeBackground(this.activeBG.neighbors[0]);
            else {
                this.timer.start();
                this.game.addEntity(new Fade(this.game, 'toBlack'));
            }
        }
        else
            this.changeBackground(this.activeBG.neighbors[2]);
        this.player.x = this.activeBG.spawn.x;
        this.player.y = this.activeBG.spawn.y;
    }
    else if ((this.player.collideTop() || this.player.collideBottom()) && this.activeBG.enemies.length == 0) {
        if (this.activeBG.type == 'house') {
            if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                this.changeBackground(this.activeBG.neighbors[0]);
                this.player.y = 710 - this.player.radius;
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius + 10;
            }
        }
        else if (this.player.collideTop() && this.activeBG.neighbors[0]) {
            if (this.activeBG.neighbors[0].type == 'street') {
                this.changeBackground(this.activeBG.neighbors[0]);
                this.player.y = 710 - this.player.radius;
            }
        }
        else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
            if (this.activeBG.neighbors[2].type == 'street') {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius + 10;
            }
        }
    }
};

SceneManager.prototype.saveWeapon = function (weapon) {
    var save = {};
    save.floating = weapon.floating;
    save.hidden = weapon.hidden;
    save.type = weapon.type;
    save.ability = weapon.abilityNum;
    save.rarity = weapon.rarity;
    save.spawn = { x: weapon.x, y: weapon.y };
    return save;
};

SceneManager.prototype.loadWeapon = function (weapon) {
    var load = null;
    if (weapon.type == 'knife') {
        load = new Weapon(this.game, this.player, 0, weapon.rarity, weapon.ability, weapon.spawn);
        load.floating = weapon.floating;
        load.hidden = weapon.hidden;
        return load;
    }
    else if (weapon.type == 'bat') {
        load = new Weapon(this.game, this.player, 1, weapon.rarity, weapon.ability, weapon.spawn);
        load.floating = weapon.floating;
        load.hidden = weapon.hidden;
        return load;
    }
    else {
        load = new Weapon(this.game, this.player, 2, weapon.rarity, weapon.ability, weapon.spawn);
        load.floating = weapon.floating;
        load.hidden = weapon.hidden;
        return load;
    }
};

SceneManager.prototype.saveProgress = function (level) {
    this.oldWeapon = this.saveWeapon(this.player.weapon);
    this.oldLevel = { streets: [], houses: [] };
    for (var i = 0; i < level.streets.length; i++)
        this.oldLevel.streets[i] = this.saveWeapon(level.streets[i].drop);
    for (var i = 0; i < level.houses.length; i++)
        this.oldLevel.houses[i] = this.saveWeapon(level.houses[i].drop);
};

SceneManager.prototype.loadProgress = function (lvl) {
    this.player.weapon = this.loadWeapon(this.oldWeapon);
    for (var i = 0; i < this.levels[lvl].streets.length; i++)
        this.levels[lvl].streets[i].drop = this.loadWeapon(this.oldLevel.streets[i]);
    for (var i = 0; i < this.levels[lvl].houses.length; i++)
        this.levels[lvl].houses[i].drop = this.loadWeapon(this.oldLevel.houses[i]);
};