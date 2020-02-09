function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;

    ctx.setTransform(1, 0, 0, 1, locX, locY);
    ctx.rotate(angle);
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2,
                  this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    ctx.rotate(angle);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// the 'main' code begins here
var friction = 8;

var ASSET_MANAGER = new AssetManager();

// backgrounds
ASSET_MANAGER.queueDownload('./img/backgrounds/street00.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street01.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street02.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street03.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street11.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street12.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street13.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street21.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street22.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street23.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street31.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street32.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/street33.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house00.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house01.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house02.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house03.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house11.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house12.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house13.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house21.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house22.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house23.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house31.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house32.jpg');
ASSET_MANAGER.queueDownload('./img/backgrounds/house33.jpg');


ASSET_MANAGER.queueDownload('./img/Start.png');
ASSET_MANAGER.queueDownload('./img/Victory.png');
ASSET_MANAGER.queueDownload('./img/GameOver.png');
ASSET_MANAGER.queueDownload('./img/LilFrump.png');
ASSET_MANAGER.queueDownload('./img/Enemy.png');
ASSET_MANAGER.queueDownload('./img/Health.png');
ASSET_MANAGER.queueDownload('./img/HealthBig.png');
ASSET_MANAGER.queueDownload('./img/Mailbox.png');
ASSET_MANAGER.queueDownload('./img/Arrow.png');
ASSET_MANAGER.queueDownload('./img/bodyguard.png');
ASSET_MANAGER.queueDownload('./img/dog.png');
ASSET_MANAGER.queueDownload('./img/bat_drop.png');

ASSET_MANAGER.downloadAll(function () {
    console.log('loading game...');
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    //var bg = new Background(gameEngine);
    var fence1 = new Wall(gameEngine, 0, 0, 240, 180);
    var fence2 = new Wall(gameEngine, 226, 180, 14, 310);
    var fence3 = new Wall(gameEngine, 226, 607, 14, 113);
    var fence4 = new Wall(gameEngine, 145, 607, 81, 10);
    var frump = new Frump(gameEngine);
    //var enemy = new Enemy(gameEngine);

    // gameEngine.addEntity(street);
    // gameEngine.addEntity(fence1);
    // gameEngine.addEntity(fence2);
    // gameEngine.addEntity(fence3);
    // gameEngine.addEntity(fence4);
    // var enemies = Math.floor(Math.random()*2+1);
    // for (var j = 0; j < enemies; j++) gameEngine.addEntity(new Enemy(gameEngine));
    // gameEngine.addEntity(frump);
 
    var manager = new SceneManager(gameEngine);
    gameEngine.addEntity(manager);

    gameEngine.init(ctx);
    gameEngine.start();
});
