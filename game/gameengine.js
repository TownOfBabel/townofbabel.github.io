// This game shell was happily copied from Googler Seth Ladd's 'Bad Aliens' game and his Google IO talk in 2011

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.player = {};
    this.player.shift = false;
    this.player.space = false;
    this.mouse = { x: 400, y: 400 };
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
};

GameEngine.prototype.start = function() {
    console.log('starting game');
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.startInput = function() {
    console.log('starting input');
    var that = this;

    var getXandY = function(e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener('keydown', function(e) {
        if (String.fromCharCode(e.which) === ' ') that.player.space = true;
        if (e.key == 'Shift') that.shift = true;
        if (e.key == 'x' || e.key == 'X') that.heal = true;
        if (e.key == 'Enter') that.enter = true;
        if (e.key == 'w' || e.key == 'W') that.player.up = true, Date.now();
        if (e.key == 'a' || e.key == 'A') that.player.left = true, Date.now();
        if (e.key == 's' || e.key == 'S') that.player.down = true, Date.now();
        if (e.key == 'd' || e.key == 'D') that.player.right = true, Date.now();
        if (e.key == 'e' || e.key == 'E') that.player.interact = true;
        if (e.key == 'r' || e.key == 'R') that.player.reload = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener('keyup', function(e) {
        if (e.key == 'w' || e.key == 'W') that.player.up = false;
        if (e.key == 'a' || e.key == 'A') that.player.left = false;
        if (e.key == 's' || e.key == 'S') that.player.down = false;
        if (e.key == 'd' || e.key == 'D') that.player.right = false;
        if (e.key == 'e' || e.key == 'E') that.player.interact = false;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener('mousemove', function(e) {
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener('click', function(e) {
        that.click = true;
    }, false);

    // disabling right-click (causes 'sticky' keys)
    document.addEventListener('contextmenu', event => event.preventDefault());

    console.log('input started');
};

GameEngine.prototype.addEntity = function(entity) {
    console.log('added entity');
    this.entities.push(entity);
};

GameEngine.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function() {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
};

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.click = null;
    this.shift = null;
    this.enter = null;
    this.heal = null;
    this.player.space = null;
    this.player.reload = null;
};

function distance(a, b, c) {
    if (c === undefined) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    } else {
        var dx = a.x - b;
        var dy = a.y - c;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function() {};

Entity.prototype.draw = function(ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = 'green';
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
        this.game.ctx.arc();
    }
};

Entity.prototype.collide = function(other) {
    if (other.wall || other.door) {
        if (this.x < other.x) {
            if (this.y < other.y) {
                this.side = 'topleft';
                return distance(this, other) < this.radius;
            } else if (this.y > other.y + other.h) {
                this.side = 'bottomleft';
                return distance(this, other.x, other.y + other.h) < this.radius;
            } else {
                this.side = 'left';
                return distance(this, other.x, this.y) < this.radius;
            }
        } else if (this.x > other.x + other.w) {
            if (this.y < other.y) {
                this.side = 'topright';
                return distance(this, other.x + other.w, other.y) < this.radius;
            } else if (this.y > other.y + other.h) {
                this.side = 'bottomright';
                return distance(this, other.x + other.w, other.y + other.h) < this.radius;
            } else {
                this.side = 'right';
                return distance(this, other.x + other.w, this.y) < this.radius;
            }
        } else {
            if (this.y < other.y) {
                this.side = 'top';
                return distance(this, this.x, other.y) < this.radius;
            } else if (this.y > other.y + other.h) {
                this.side = 'bottom';
                return distance(this, this.x, other.y + other.h) < this.radius;
            } else
                return true;
        }
    } else return distance(this, other) < this.radius + other.radius;
};

Entity.prototype.collideLeft = function() {
    if (this.caged) return (this.x - this.radius) < 1075;
    else return (this.x - this.radius) < 0;
};

Entity.prototype.collideRight = function() {
    if (this.caged) return (this.x + this.radius) > 1235
    else return (this.x + this.radius) > 1280;
};

Entity.prototype.collideTop = function() {
    if (this.caged) return (this.y - this.radius) < 40;
    else return (this.y - this.radius) < 0;
};

Entity.prototype.collideBottom = function() {
    if (this.caged) return (this.y + this.radius) > 200;
    else return (this.y + this.radius) > 720;
};

Entity.prototype.rotateAndCache = function(image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = 'red';
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};