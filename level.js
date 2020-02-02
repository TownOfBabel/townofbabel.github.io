function Level(game, lvl) {
    this.level = lvl;
    this.streets = [];
    this.houses = [];
    Entity.call(this, game, 0, 0);
}

Level.prototype = new Entity();
Level.prototype.constructor = Level;

Level.prototype.update = function() {

    Entity.prototype.update.call(this);
}

Level.prototype.draw = function(ctx) {
}

function House(game, lvl) {
    this.level = lvl;
    Entity.call(this, game, 0, 0);
}

House.prototype = new Entity();
House.prototype.constructor = House;

House.prototype.update = function() {

}

House.prototype.draw = function(ctx) {
    
}