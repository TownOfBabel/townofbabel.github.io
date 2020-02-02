function SceneManager(game) {
    this.levels = [];
    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function() {

    Entity.prototype.update.call(this);
}

SceneManager.prototype.draw = function(ctx) {
}