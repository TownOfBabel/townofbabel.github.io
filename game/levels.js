function generateEnemies(game, room, lvl, max) {
    for (var i = room.enemies.length - 1; i >= 0; i--)
        room.enemies.splice(i, 1);
    if (room.type == 'street') {
        var dogs = 0, police = 0;
        var total = max - Math.floor(Math.random() * (2 + Math.floor(lvl / 2)));
        if (total > 1) dogs = Math.floor(Math.random() * 2);
        if (total > 2) police = Math.floor(Math.random() * 2.5);
        for (var i = 0; i < total; i++) {
            var spawn = room.spawns[Math.floor(Math.random() * room.spawns.length)];
            if (dogs > 0) {
                room.enemies.push(new Dog(game, spawn.x, spawn.y));
                dogs--;
            } else if (police > 0) {
                room.enemies.push(new Police(game, spawn.x, spawn.y));
                police--;
            }
            else room.enemies.push(new Thug(game, Math.floor(Math.random() * 2), spawn.x, spawn.y));
        }
    } else {
        var guards = 0, police = 0;
        var total = max - Math.floor(Math.random() * (3 + Math.floor(lvl / 2)));
        var dogs = Math.floor(Math.random() * (2 + Math.floor(lvl / 2)));
        if (total > 3) guards = Math.floor(Math.random() * (3 + Math.floor(lvl / 2)));
        if (total > 4) police = Math.floor(Math.random() * (3 + Math.floor(lvl / 2)));
        for (var i = 0; i < total; i++) {
            var spawn = room.spawns[Math.floor(Math.random() * room.spawns.length)];
            if (dogs > 0) {
                room.enemies.push(new Dog(game, spawn.x, spawn.y));
                dogs--;
            } else if (guards > 0) {
                room.enemies.push(new Bodyguard(game, spawn.x, spawn.y));
                guards--;
            } else if (police > 0) {
                room.enemies.push(new Police(game, spawn.x, spawn.y));
                police--;
            } else
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2), spawn.x, spawn.y));
        }
    }
}

SceneManager.prototype.buildLevelOne = function (game) {
    this.levels[0] = { streets: [], houses: [] };
    console.log('loading level 1...');

    // street 00
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street00.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 376, 10, 112), 'street');
        else this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street00.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 376, 10, 112), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street00.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 376, 10, 112), 'street');
        else this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street00.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 376, 10, 112), 'street');
    }
    // street 01
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 439, 10, 112), 'street');
        else this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 439, 10, 112), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 439, 10, 112), 'street');
        else this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 439, 10, 112), 'street');
    }
    // street 02
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 156, 10, 114), 'street');
        else this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 156, 10, 114), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 156, 10, 114), 'street');
        else this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 156, 10, 114), 'street');
    }
    // street 03
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 386, 10, 110), 'street');
        else this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 386, 10, 110), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 386, 10, 110), 'street');
        else this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 386, 10, 110), 'street');
    }
    // street 04
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 478, 10, 111), 'street');
        else this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 478, 10, 111), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 478, 10, 111), 'street');
        else this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 478, 10, 111), 'street');
    }
    // street 05
    if (Math.random() * 100 < 5) {
        if (Math.random() * 100 < 25)
            this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street05.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 600, 0, 111, 10), 'street');
        else this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street05.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 600, 0, 111, 10), 'street');
    } else {
        if (Math.random() * 100 < 15)
            this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street05.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 600, 0, 111, 10), 'street');
        else this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street05.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 600, 0, 111, 10), 'street');
    }

    var prevHouse = null;
    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            this.levels[0].houses[i] = this.buildHouse(0, 0, prevHouse);
            prevHouse = parseInt(this.levels[0].houses[i].source.substring(24, 25));
        } else {
            this.levels[0].houses[i] = this.buildHouse(0, 1, prevHouse);
            prevHouse = parseInt(this.levels[0].houses[i].source.substring(24, 25));
        }
    }
    // house 04
    // this.levels[0].houses[4] = this.buildBossRoom(0, 0);
    this.fillBossRoom(0);
    // house 00
    this.levels[0].houses[5] = new Background(game, ('./img/backgrounds/house00.png'),
        new Weapon(game, this.player, 1, 3, null, { x: 1100, y: 380 }),
        new Door(game, 1270, 176, 10, 96), 'house');

    // house00 - Lil' Frump's House
    this.levels[0].houses[5].walls.push(new Wall(game, 1252, 0, 28, 176));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 1280, 28));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 210, 720));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 692, 1280, 28));
    this.levels[0].houses[5].walls.push(new Wall(game, 1252, 272, 28, 448));
    this.levels[0].houses[5].walls.push(new Wall(game, 180, 282, 368, 32));
    this.levels[0].houses[5].walls.push(new Wall(game, 644, 282, 50, 438));
    this.levels[0].houses[5].walls.push(new Wall(game, 634, 308, 10, 94));
    this.levels[0].houses[5].walls.push(new Wall(game, 180, 490, 260, 230));
    this.levels[0].houses[5].walls.push(new Wall(game, 224, 430, 62, 50));
    this.levels[0].houses[5].walls.push(new Wall(game, 640, 0, 54, 176));
    this.levels[0].houses[5].walls.push(new Wall(game, 504, 0, 54, 176));
    this.levels[0].houses[5].walls.push(new Wall(game, 526, 174, 10, 110));
    this.levels[0].houses[5].walls.push(new Wall(game, 556, 152, 86, 10));
    this.levels[0].houses[5].walls.push(new Wall(game, 582, 438, 82, 256));
    this.levels[0].houses[5].walls.push(new Wall(game, 694, 26, 560, 92));
    this.levels[0].houses[5].walls.push(new Wall(game, 1182, 488, 48, 118));
    this.levels[0].houses[5].walls.push(new Wall(game, 1198, 448, 8, 198));
    this.levels[0].houses[5].walls.push(new Wall(game, 990, 458, 92, 192));
    this.levels[0].houses[5].walls.push(new Wall(game, 789, 429, 88, 244));
    this.levels[0].houses[5].walls.push(new Wall(game, 811, 275, 50, 58));
    this.levels[0].houses[5].walls.push(new Wall(game, 1049, 229, 50, 58));
    this.levels[0].houses[5].walls.push(new Column(game, 952, 274, 68));
    this.levels[0].houses[5].walls.push(new Roof(game, 0, 0, './img/backgrounds/house00shadow.png'));
    this.levels[0].houses[5].spawn = { x: 1240, y: 224 };

    // street00
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 180, 14, 310));
    this.levels[0].streets[0].walls.push(new Wall(game, 226, 607, 14, 113));
    this.levels[0].streets[0].walls.push(new Wall(game, 145, 607, 81, 10));
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 0, 54, 79));
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 176, 244, 22));
    this.levels[0].streets[0].walls.push(new Wall(game, 741, 52, 166, 374));
    this.levels[0].streets[0].walls.push(new Wall(game, 1035, 0, 21, 164));
    this.levels[0].streets[0].walls.push(new Wall(game, 1035, 145, 245, 16));
    this.levels[0].streets[0].walls.push(new Wall(game, 1217, 0, 63, 720));
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 235, 27, 141));
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 488, 27, 232));
    this.levels[0].streets[0].walls.push(new Roof(game, 0, 182, './img/backgrounds/roof00.png'));
    this.levels[0].streets[0].spawn = { x: 40, y: 432 };

    // street01
    this.levels[0].streets[1].walls.push(new Wall(game, 0, 0, 55, 720));
    this.levels[0].streets[1].walls.push(new Wall(game, 1253, 0, 27, 120));
    this.levels[0].streets[1].walls.push(new Wall(game, 1033, 160, 247, 33));
    this.levels[0].streets[1].walls.push(new Wall(game, 1033, 160, 33, 269));
    this.levels[0].streets[1].walls.push(new Wall(game, 1033, 535, 33, 184));
    this.levels[0].streets[1].walls.push(new Wall(game, 1225, 191, 63, 248));
    this.levels[0].streets[1].walls.push(new Wall(game, 1225, 551, 63, 248));
    this.levels[0].streets[1].walls.push(new Roof(game, 1138, 110, './img/backgrounds/roof01.png'));
    this.levels[0].streets[1].spawn = { x: 1240, y: 495 };

    // street02
    this.levels[0].streets[2].walls.push(new Wall(game, 224, 0, 34, 150));
    this.levels[0].streets[2].walls.push(new Wall(game, 217, 372, 33, 348));
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 650, 250, 70));
    this.levels[0].streets[2].walls.push(new Wall(game, 1032, 0, 22, 181));
    this.levels[0].streets[2].walls.push(new Wall(game, 1032, 161, 248, 20));
    this.levels[0].streets[2].walls.push(new Wall(game, 1250, 0, 31, 720));
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 0, 56, 156));
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 270, 56, 450));
    this.levels[0].streets[2].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof02.png'));
    this.levels[0].streets[2].spawn = { x: 40, y: 214 };

    // street03
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 0, 45, 334));
    this.levels[0].streets[3].walls.push(new Wall(game, 229, 0, 22, 720));
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 496, 248, 36));
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 558, 56, 162));
    this.levels[0].streets[3].walls.push(new Wall(game, 1037, 0, 37, 324));
    this.levels[0].streets[3].walls.push(new Wall(game, 1037, 0, 243, 40));
    this.levels[0].streets[3].walls.push(new Wall(game, 1037, 543, 29, 177));
    this.levels[0].streets[3].walls.push(new Wall(game, 1227, 0, 53, 386));
    this.levels[0].streets[3].walls.push(new Wall(game, 1227, 496, 53, 224));
    this.levels[0].streets[3].walls.push(new Roof(game, 1164, 9, './img/backgrounds/roof03.png'));
    this.levels[0].streets[3].spawn = { x: 1240, y: 441 };

    // street04
    this.levels[0].streets[4].walls.push(new Wall(game, 0, 203, 254, 37));
    this.levels[0].streets[4].walls.push(new Wall(game, 225, 203, 33, 203));
    this.levels[0].streets[4].walls.push(new Wall(game, 225, 629, 33, 91));
    this.levels[0].streets[4].walls.push(new Wall(game, 733, 246, 166, 374));
    this.levels[0].streets[4].walls.push(new Wall(game, 1147, 291, 133, 429));
    this.levels[0].streets[4].walls.push(new Wall(game, 0, 305, 42, 173));
    this.levels[0].streets[4].walls.push(new Wall(game, 0, 589, 42, 131));
    this.levels[0].streets[4].walls.push(new Roof(game, 0, 256, './img/backgrounds/roof04.png'));
    this.levels[0].streets[4].spawn = { x: 40, y: 533 };

    // street05
    this.levels[0].streets[5].walls.push(new Wall(game, 50, 274, 404, 174));
    this.levels[0].streets[5].walls.push(new Wall(game, 329, 0, 271, 29));
    this.levels[0].streets[5].walls.push(new Wall(game, 711, 0, 271, 29));
    this.levels[0].streets[5].walls.push(new Roof(game, 275, 0, './img/backgrounds/roof05.png'));
    this.levels[0].streets[5].spawn = { x: 655, y: 40 };

    // scene connections
    this.levels[0].houses[5].neighbors[1] = this.levels[0].streets[0];
    this.levels[0].streets[0].neighbors[3] = this.levels[0].houses[5];
    this.levels[0].streets[0].neighbors[0] = this.levels[0].streets[1];
    this.levels[0].streets[1].neighbors[2] = this.levels[0].streets[0];
    this.levels[0].streets[1].neighbors[1] = this.levels[0].houses[0];
    this.levels[0].houses[0].neighbors[3] = this.levels[0].streets[1];
    this.levels[0].streets[1].neighbors[0] = this.levels[0].streets[2];
    this.levels[0].streets[2].neighbors[2] = this.levels[0].streets[1];
    this.levels[0].streets[2].neighbors[3] = this.levels[0].houses[1];
    this.levels[0].houses[1].neighbors[1] = this.levels[0].streets[2];
    this.levels[0].streets[2].neighbors[0] = this.levels[0].streets[3];
    this.levels[0].streets[3].neighbors[2] = this.levels[0].streets[2];
    this.levels[0].streets[3].neighbors[1] = this.levels[0].houses[2];
    this.levels[0].houses[2].neighbors[3] = this.levels[0].streets[3];
    this.levels[0].streets[3].neighbors[0] = this.levels[0].streets[4];
    this.levels[0].streets[4].neighbors[2] = this.levels[0].streets[3];
    this.levels[0].streets[4].neighbors[3] = this.levels[0].houses[3];
    this.levels[0].houses[3].neighbors[1] = this.levels[0].streets[4];
    this.levels[0].streets[4].neighbors[0] = this.levels[0].streets[5];
    this.levels[0].streets[5].neighbors[2] = this.levels[0].streets[4];
    this.levels[0].streets[5].neighbors[0] = this.levels[0].houses[4];
    this.levels[0].houses[4].neighbors[2] = this.levels[0].streets[5];

    generateEnemies(game, this.levels[0].streets[0], 0, 2);
    generateEnemies(game, this.levels[0].streets[1], 0, 2);
    generateEnemies(game, this.levels[0].streets[2], 0, 2);
    generateEnemies(game, this.levels[0].streets[3], 0, 2);
    generateEnemies(game, this.levels[0].streets[4], 0, 2);
    generateEnemies(game, this.levels[0].streets[5], 0, 2);
    generateEnemies(game, this.levels[0].houses[0], 0, 4);
    generateEnemies(game, this.levels[0].houses[1], 0, 4);
    generateEnemies(game, this.levels[0].houses[2], 0, 5);
    generateEnemies(game, this.levels[0].houses[3], 0, 5);

    console.log('loading complete!');
};

SceneManager.prototype.buildLevelTwo = function (game) {
    this.levels[1] = { streets: [], houses: [] };
    console.log('loading level 2...');

    // street 0
    if (Math.random() * 100 < 15) {
        if (Math.random() * 100 < 30)
            this.levels[1].streets[0] = new Background(game, './img/backgrounds/street10.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 640 });
        else this.levels[1].streets[0] = new Background(game, './img/backgrounds/street10.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 640 });
    } else {
        if (Math.random() * 100 < 20)
            this.levels[1].streets[0] = new Background(game, './img/backgrounds/street10.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 640 });
        else this.levels[1].streets[0] = new Background(game, './img/backgrounds/street10.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 640 });
    }
    // street 1
    if (Math.random() * 100 < 15) {
        if (Math.random() * 100 < 30)
            this.levels[1].streets[1] = new Background(game, './img/backgrounds/street11.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(this.game, 1254, 466, 22, 112), 'street', [], { x: 1200, y: 522 });
        else this.levels[1].streets[1] = new Background(game, './img/backgrounds/street11.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(this.game, 1254, 466, 22, 112), 'street', [], { x: 1200, y: 522 });
    } else {
        if (Math.random() * 100 < 20)
            this.levels[1].streets[1] = new Background(game, './img/backgrounds/street11.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(this.game, 1254, 466, 22, 112), 'street', [], { x: 1200, y: 522 });
        else this.levels[1].streets[1] = new Background(game, './img/backgrounds/street11.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(this.game, 1254, 466, 22, 112), 'street', [], { x: 1200, y: 522 });
    }
    // street 2
    if (Math.random() * 100 < 15) {
        if (Math.random() * 100 < 30)
            this.levels[1].streets[2] = new Background(game, './img/backgrounds/street12.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(this.game, 4, 82, 100, 220), 'street', [], { x: 150, y: 192 });
        else this.levels[1].streets[2] = new Background(game, './img/backgrounds/street12.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(this.game, 4, 82, 100, 220), 'street', [], { x: 150, y: 192 });
    } else {
        if (Math.random() * 100 < 20)
            this.levels[1].streets[2] = new Background(game, './img/backgrounds/street12.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(this.game, 4, 82, 100, 220), 'street', [], { x: 150, y: 192 });
        else this.levels[1].streets[2] = new Background(game, './img/backgrounds/street12.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(this.game, 4, 82, 100, 220), 'street', [], { x: 150, y: 192 });
    }
    // street 3
    if (Math.random() * 100 < 35) {
        if (Math.random() * 100 < 55)
            this.levels[1].streets[3] = new Background(game, './img/backgrounds/street13.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, Math.floor(Math.random() * 4), { x: 250, y: 610 }),
                new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 80 });
        else this.levels[1].streets[3] = new Background(game, './img/backgrounds/street13.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, null, { x: 250, y: 610 }),
            new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 80 });
    } else {
        if (Math.random() * 100 < 40)
            this.levels[1].streets[3] = new Background(game, './img/backgrounds/street13.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, Math.floor(Math.random() * 4), { x: 250, y: 610 }),
                new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 80 });
        else this.levels[1].streets[3] = new Background(game, './img/backgrounds/street13.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, null, { x: 250, y: 610 }),
            new Door(game, 0, 0, 0, 0), 'street', [], { x: 640, y: 80 });
    }
    // street 4
    if (Math.random() * 100 < 15) {
        if (Math.random() * 100 < 30)
            this.levels[1].streets[4] = new Background(game, './img/backgrounds/street14.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(game, 4, 476, 100, 220), 'street', [], { x: 150, y: 586 });
        else this.levels[1].streets[4] = new Background(game, './img/backgrounds/street14.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 4, 476, 100, 220), 'street', [], { x: 150, y: 586 });
    } else {
        if (Math.random() * 100 < 20)
            this.levels[1].streets[4] = new Background(game, './img/backgrounds/street14.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 4, 476, 100, 220), 'street', [], { x: 150, y: 586 });
        else this.levels[1].streets[4] = new Background(game, './img/backgrounds/street14.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 4, 476, 100, 220), 'street', [], { x: 150, y: 586 });
    }
    // street 5
    if (Math.random() * 100 < 15) {
        if (Math.random() * 100 < 30)
            this.levels[1].streets[5] = new Background(game, './img/backgrounds/street15.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(game, 500, 0, 300, 50), 'street', [], { x: 650, y: 100 });
        else this.levels[1].streets[5] = new Background(game, './img/backgrounds/street15.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 500, 0, 300, 50), 'street', [], { x: 650, y: 100 });
    } else {
        if (Math.random() * 100 < 20)
            this.levels[1].streets[5] = new Background(game, './img/backgrounds/street15.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 500, 0, 300, 50), 'street', [], { x: 650, y: 100 });
        else this.levels[1].streets[5] = new Background(game, './img/backgrounds/street15.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 500, 0, 300, 50), 'street', [], { x: 650, y: 100 });
    }

    this.levels[1].houses[0] = this.buildHouse(1, 0, null);
    // apartment 1
    if (Math.random() * 100 < 25) {
        if (Math.random() * 100 < 40)
            this.levels[1].houses[1] = new Background(game, './img/backgrounds/apartment01.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, Math.floor(Math.random() * 4)),
                new Door(game, 1254, 188, 22, 116), 'house', [], { x: 1200, y: 246 }, [{ x: 1050, y: 525 }, { x: 570, y: 370 }, { x: 190, y: 205 }]);
        else this.levels[1].houses[1] = new Background(game, './img/backgrounds/apartment01.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 2), new Door(game, 1254, 188, 22, 116),
            'house', [], { x: 1200, y: 246 }, [{ x: 1050, y: 525 }, { x: 570, y: 370 }, { x: 190, y: 205 }]);
    } else {
        if (Math.random() * 100 < 30)
            this.levels[1].houses[1] = new Background(game, './img/backgrounds/apartment01.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1254, 188, 22, 116), 'house', [], { x: 1200, y: 246 }, [{ x: 1050, y: 525 }, { x: 570, y: 370 }, { x: 190, y: 205 }]);
        else this.levels[1].houses[1] = new Background(game, './img/backgrounds/apartment01.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 1), new Door(game, 1254, 188, 22, 116),
            'house', [], { x: 1200, y: 246 }, [{ x: 1050, y: 525 }, { x: 570, y: 370 }, { x: 190, y: 205 }]);
    }
    // apartment 2
    if (Math.random() * 100 < 25) {
        if (Math.random() * 100 < 40)
            this.levels[1].houses[2] = new Background(game, './img/backgrounds/apartment02.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, Math.floor(Math.random() * 4)),
                new Door(game, 0, 0, 0, 0), 'house', [], { x: 640, y: 640 }, [{ x: 235, y: 315 }, { x: 900, y: 200 }, { x: 1100, y: 575 }]);
        else this.levels[1].houses[2] = new Background(game, './img/backgrounds/apartment02.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 2), new Door(game, 0, 0, 0, 0),
            'house', [], { x: 640, y: 640 }, [{ x: 235, y: 315 }, { x: 900, y: 200 }, { x: 1100, y: 575 }]);
    } else {
        if (Math.random() * 100 < 30)
            this.levels[1].houses[2] = new Background(game, './img/backgrounds/apartment02.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 0, 0, 0), 'house', [], { x: 640, y: 640 }, [{ x: 235, y: 315 }, { x: 900, y: 200 }, { x: 1100, y: 575 }]);
        else this.levels[1].houses[2] = new Background(game, './img/backgrounds/apartment02.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 1), new Door(game, 0, 0, 0, 0),
            'house', [], { x: 640, y: 640 }, [{ x: 235, y: 315 }, { x: 900, y: 200 }, { x: 1100, y: 575 }]);
    }
    // apartment 3
    if (Math.random() * 100 < 25) {
        if (Math.random() * 100 < 40)
            this.levels[1].houses[3] = new Background(game, './img/backgrounds/apartment03.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, Math.floor(Math.random() * 4)),
                new Door(game, 1254, 416, 22, 116), 'house', [], { x: 1200, y: 474 }, [{ x: 225, y: 200 }, { x: 640, y: 360 }, { x: 1060, y: 180 }]);
        else this.levels[1].houses[3] = new Background(game, './img/backgrounds/apartment03.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 2), new Door(game, 1254, 416, 22, 116),
            'house', [], { x: 1200, y: 474 }, [{ x: 225, y: 200 }, { x: 640, y: 360 }, { x: 1060, y: 180 }]);
    } else {
        if (Math.random() * 100 < 30)
            this.levels[1].houses[3] = new Background(game, './img/backgrounds/apartment03.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1254, 416, 22, 116), 'house', [], { x: 1200, y: 474 }, [{ x: 225, y: 200 }, { x: 640, y: 360 }, { x: 1060, y: 180 }]);
        else this.levels[1].houses[3] = new Background(game, './img/backgrounds/apartment03.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 1), new Door(game, 1254, 416, 22, 116),
            'house', [], { x: 1200, y: 474 }, [{ x: 225, y: 200 }, { x: 640, y: 360 }, { x: 1060, y: 180 }]);
    }
    // this.levels[1].houses[4] = this.buildBossRoom(1, 1);
    this.fillBossRoom(1);

    // walls + roofs
    // street 0
    this.levels[1].streets[0].walls.push(new Wall(game, 0, 0, 50, 720));
    this.levels[1].streets[0].walls.push(new Wall(game, 0, 0, 255, 25));
    this.levels[1].streets[0].walls.push(new Wall(game, 230, 0, 25, 180));
    this.levels[1].streets[0].walls.push(new Wall(game, 230, 343, 25, 400));
    this.levels[1].streets[0].walls.push(new Wall(game, 732, 158, 172, 404));
    this.levels[1].streets[0].walls.push(new Wall(game, 1042, 0, 25, 168));
    this.levels[1].streets[0].walls.push(new Wall(game, 1042, 143, 250, 25));
    this.levels[1].streets[0].walls.push(new Wall(game, 1236, 0, 50, 200));
    this.levels[1].streets[0].walls.push(new Wall(game, 1100, 165, 180, 555));
    // street 1
    this.levels[1].streets[1].walls.push(new Wall(game, 0, 0, 60, 720));
    this.levels[1].streets[1].walls.push(new Wall(game, 1027, 0, 253, 150));
    this.levels[1].streets[1].walls.push(new Wall(game, 1047, 0, 45, 434));
    this.levels[1].streets[1].walls.push(new Wall(game, 1047, 543, 45, 200));
    this.levels[1].streets[1].walls.push(new Wall(game, 1231, 0, 50, 462));
    this.levels[1].streets[1].walls.push(new Wall(game, 1231, 576, 50, 150));
    this.levels[1].streets[1].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof11.png'));
    // street 2
    this.levels[1].streets[2].walls.push(new Wall(game, 0, 0, 450, 83));
    this.levels[1].streets[2].walls.push(new Wall(game, 0, 301, 150, 420));
    this.levels[1].streets[2].walls.push(new Wall(game, 0, 563, 254, 157));
    this.levels[1].streets[2].walls.push(new Wall(game, 1017, 0, 200, 720));
    this.levels[1].streets[2].walls.push(new Column(game, 470, 43, 200));
    this.levels[1].streets[2].walls.push(new Wall(game, 470, 0, 600, 260));
    this.levels[1].streets[2].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof12.png'));
    // street 3
    this.levels[1].streets[3].walls.push(new Wall(game, 0, 0, 150, 720));
    this.levels[1].streets[3].walls.push(new Wall(game, 1020, 0, 150, 720));
    this.levels[1].streets[3].walls.push(new Wall(game, 140, 650, 175, 70));
    this.levels[1].streets[3].walls.push(new Column(game, 368, 584, 81));
    this.levels[1].streets[3].walls.push(new Column(game, 402, 620, 80));
    this.levels[1].streets[3].walls.push(new Column(game, 430, 654, 83));
    this.levels[1].streets[3].walls.push(new Column(game, 506, 730, 81));
    this.levels[1].streets[3].walls.push(new Wall(game, 484, 656, 550, 64));
    this.levels[1].streets[3].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof13.png'));
    // street 4
    this.levels[1].streets[4].walls.push(new Wall(game, 0, 281, 163, 195));
    this.levels[1].streets[4].walls.push(new Wall(game, 0, 696, 163, 195));
    this.levels[1].streets[4].walls.push(new Wall(game, 1015, 215, 265, 515));
    this.levels[1].streets[4].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof14.png'));
    // street 5
    this.levels[1].streets[5].walls.push(new Wall(game, 0, 0, 453, 100));
    this.levels[1].streets[5].walls.push(new Wall(game, 851, 0, 453, 100));
    this.levels[1].streets[5].walls.push(new Wall(game, 70, 277, 374, 166));
    this.levels[1].streets[5].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof15.png'));

    // apartment 1
    this.levels[1].houses[1].walls.push(new Wall(game, 1250, 0, 30, 188));
    this.levels[1].houses[1].walls.push(new Wall(game, 906, 0, 374, 30));
    this.levels[1].houses[1].walls.push(new Wall(game, 0, 0, 244, 30));
    this.levels[1].houses[1].walls.push(new Wall(game, 0, 0, 30, 720));
    this.levels[1].houses[1].walls.push(new Wall(game, 0, 690, 1280, 30));
    this.levels[1].houses[1].walls.push(new Wall(game, 1250, 304, 30, 416));
    this.levels[1].houses[1].walls.push(new Wall(game, 695, 243, 88, 244));
    this.levels[1].houses[1].walls.push(new Wall(game, 353, 243, 88, 244));
    // apartment 2
    this.levels[1].houses[2].walls.push(new Wall(game, 0, 0, 30, 720));
    this.levels[1].houses[2].walls.push(new Wall(game, 1250, 0, 30, 720));
    this.levels[1].houses[2].walls.push(new Wall(game, 906, 690, 374, 30));
    this.levels[1].houses[2].walls.push(new Wall(game, 906, 0, 374, 30));
    this.levels[1].houses[2].walls.push(new Wall(game, 0, 0, 244, 30));
    this.levels[1].houses[2].walls.push(new Wall(game, 0, 690, 244, 30));
    this.levels[1].houses[2].walls.push(new Wall(game, 419, 211, 50, 58));
    this.levels[1].houses[2].walls.push(new Wall(game, 657, 165, 50, 58));
    this.levels[1].houses[2].walls.push(new Wall(game, 419, 487, 50, 58));
    this.levels[1].houses[2].walls.push(new Wall(game, 657, 441, 50, 58));
    this.levels[1].houses[2].walls.push(new Column(game, 560, 486, 70));
    this.levels[1].houses[2].walls.push(new Column(game, 560, 210, 70));
    // apartment 3
    this.levels[1].houses[3].walls.push(new Wall(game, 0, 0, 1280, 30));
    this.levels[1].houses[3].walls.push(new Wall(game, 0, 0, 30, 720));
    this.levels[1].houses[3].walls.push(new Wall(game, 1250, 0, 30, 416));
    this.levels[1].houses[3].walls.push(new Wall(game, 1250, 632, 30, 188));
    this.levels[1].houses[3].walls.push(new Wall(game, 906, 690, 374, 30));
    this.levels[1].houses[3].walls.push(new Wall(game, 0, 690, 244, 30));
    this.levels[1].houses[3].walls.push(new Wall(game, 519, 487, 244, 88));
    this.levels[1].houses[3].walls.push(new Wall(game, 519, 145, 244, 88));

    // level connections
    this.levels[0].streets[5].neighbors[1] = this.levels[1].streets[0];
    this.levels[1].streets[0].neighbors[2] = this.levels[0].streets[5];
    this.levels[1].streets[0].neighbors[0] = this.levels[1].streets[1];
    this.levels[1].streets[1].neighbors[2] = this.levels[1].streets[0];
    this.levels[1].streets[1].neighbors[1] = this.levels[1].houses[0];
    this.levels[1].houses[0].neighbors[3] = this.levels[1].streets[1];
    this.levels[1].streets[1].neighbors[0] = this.levels[1].streets[2];
    this.levels[1].streets[2].neighbors[2] = this.levels[1].streets[1];
    this.levels[1].streets[2].neighbors[3] = this.levels[1].houses[1];
    this.levels[1].houses[1].neighbors[1] = this.levels[1].streets[2];
    this.levels[1].houses[1].neighbors[0] = this.levels[1].houses[2];
    this.levels[1].houses[2].neighbors[2] = this.levels[1].houses[1];
    this.levels[1].houses[2].neighbors[0] = this.levels[1].houses[3];
    this.levels[1].houses[3].neighbors[2] = this.levels[1].houses[2];
    this.levels[1].houses[3].neighbors[1] = this.levels[1].streets[4];
    this.levels[1].streets[3].neighbors[0] = this.levels[1].streets[4];
    this.levels[1].streets[4].neighbors[2] = this.levels[1].streets[3];
    this.levels[1].streets[4].neighbors[3] = this.levels[1].houses[3];
    this.levels[1].streets[4].neighbors[0] = this.levels[1].streets[5];
    this.levels[1].streets[5].neighbors[2] = this.levels[1].streets[4];
    this.levels[1].streets[5].neighbors[0] = this.levels[1].houses[4];
    this.levels[1].houses[4].neighbors[2] = this.levels[1].streets[5];

    generateEnemies(game, this.levels[1].streets[0], 1, 3);
    generateEnemies(game, this.levels[1].streets[1], 1, 3);
    generateEnemies(game, this.levels[1].streets[2], 1, 3);
    generateEnemies(game, this.levels[1].streets[4], 1, 3);
    generateEnemies(game, this.levels[1].streets[5], 1, 3);
    generateEnemies(game, this.levels[1].houses[0], 1, 6);
    generateEnemies(game, this.levels[1].houses[1], 1, 6);
    generateEnemies(game, this.levels[1].houses[2], 1, 7);
    generateEnemies(game, this.levels[1].houses[3], 1, 7);

    console.log('loading complete!');
};

SceneManager.prototype.buildLevelThree = function (game) {
    this.levels[2] = { streets: [], houses: [] };
    console.log('loading level 3...');

    // street 0
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[0] = new Background(game, './img/backgrounds/street20.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 250, 10, 200), 'street', [], { x: 1210, y: 350 });
        else this.levels[2].streets[0] = new Background(game, './img/backgrounds/street20.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(game, 1270, 250, 10, 200), 'street', [], { x: 1210, y: 350 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[0] = new Background(game, './img/backgrounds/street20.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 250, 10, 200), 'street', [], { x: 1210, y: 350 });
        else this.levels[2].streets[0] = new Background(game, './img/backgrounds/street20.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 1270, 250, 10, 200), 'street', [], { x: 1210, y: 350 });
    }
    // street 1
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[1] = new Background(game, './img/backgrounds/street21.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(this.game, 4, 140, 200, 390), 'street', [], { x: 260, y: 336 });
        else this.levels[2].streets[1] = new Background(game, './img/backgrounds/street21.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(this.game, 4, 140, 200, 390), 'street', [], { x: 260, y: 336 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[1] = new Background(game, './img/backgrounds/street21.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(this.game, 4, 140, 200, 390), 'street', [], { x: 260, y: 336 });
        else this.levels[2].streets[1] = new Background(game, './img/backgrounds/street21.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(this.game, 4, 140, 200, 390), 'street', [], { x: 260, y: 336 });
    }
    // street 2
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[2] = new Background(game, './img/backgrounds/street22.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(this.game, 1270, 150, 10, 200), 'street', [], { x: 1210, y: 250 });
        else this.levels[2].streets[2] = new Background(game, './img/backgrounds/street22.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(this.game, 1270, 150, 10, 200), 'street', [], { x: 1210, y: 250 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[2] = new Background(game, './img/backgrounds/street22.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(this.game, 1270, 150, 10, 200), 'street', [], { x: 1210, y: 250 });
        else this.levels[2].streets[2] = new Background(game, './img/backgrounds/street22.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(this.game, 1270, 150, 10, 200), 'street', [], { x: 1210, y: 250 });
    }
    // street 3
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[3] = new Background(game, './img/backgrounds/street23.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(game, 4, 200, 200, 360), 'street', [], { x: 250, y: 380 });
        else this.levels[2].streets[3] = new Background(game, './img/backgrounds/street23.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(game, 4, 200, 200, 360), 'street', [], { x: 250, y: 380 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[3] = new Background(game, './img/backgrounds/street23.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 2, Math.floor(Math.random() * 4)),
                new Door(game, 4, 200, 200, 360), 'street', [], { x: 250, y: 380 });
        else this.levels[2].streets[3] = new Background(game, './img/backgrounds/street23.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 2),
            new Door(game, 4, 200, 200, 360), 'street', [], { x: 250, y: 380 });
    }
    // street 4
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[4] = new Background(game, './img/backgrounds/street24.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(game, 0, 720, 0, 0), 'street', [], { x: 640, y: 640 });
        else this.levels[2].streets[4] = new Background(game, './img/backgrounds/street24.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(game, 0, 720, 0, 0), 'street', [], { x: 640, y: 640 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[4] = new Background(game, './img/backgrounds/street24.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(game, 0, 720, 0, 0), 'street', [], { x: 640, y: 640 });
        else this.levels[2].streets[4] = new Background(game, './img/backgrounds/street24.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 0, 720, 0, 0), 'street', [], { x: 640, y: 640 });
    }
    // street 5
    if (Math.random() * 100 < 10) {
        if (Math.random() * 100 < 40)
            this.levels[2].streets[5] = new Background(game, './img/backgrounds/street25.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 3, Math.floor(Math.random() * 4)),
                new Door(game, 436, 0, 132, 10), 'street', [], { x: 502, y: 80 });
        else this.levels[2].streets[5] = new Background(game, './img/backgrounds/street25.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 3),
            new Door(game, 436, 0, 132, 10), 'street', [], { x: 502, y: 80 });
    } else {
        if (Math.random() * 100 < 30)
            this.levels[2].streets[5] = new Background(game, './img/backgrounds/street25.png',
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 2, Math.floor(Math.random() * 4)),
                new Door(game, 436, 0, 132, 10), 'street', [], { x: 502, y: 80 });
        else this.levels[2].streets[5] = new Background(game, './img/backgrounds/street25.png',
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 2),
            new Door(game, 436, 0, 132, 10), 'street', [], { x: 502, y: 80 });
    }

    // houses
    var gardens = [1, 2, 3];
    var roll1 = Math.floor(Math.random() * 3);
    this.levels[2].houses[0] = this.buildGarden(2, gardens[roll1]);
    gardens.splice(roll1, 1);
    this.levels[2].houses[1] = this.buildHouse(2, 1, null);
    var roll2 = Math.floor(Math.random() * 2);
    this.levels[2].houses[2] = this.buildGarden(2, gardens[roll2]);
    gardens.splice(roll2, 1);
    this.levels[2].houses[3] = this.buildHouse(2, 1, parseInt(this.levels[2].houses[1].source.substring(24, 25)));
    // this.levels[2].houses[4] = this.buildBossRoom(2, 2);
    this.fillBossRoom(2);

    // walls + roofs
    // street 0
    this.levels[2].streets[0].walls.push(new Wall(game, 0, 0, 200, 720));
    this.levels[2].streets[0].walls.push(new Wall(game, 743, 138, 166, 374));
    this.levels[2].streets[0].walls.push(new Wall(game, 1020, 0, 300, 250));
    this.levels[2].streets[0].walls.push(new Wall(game, 1020, 450, 300, 300));
    this.levels[2].streets[0].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof20.png'));
    // street 1
    this.levels[2].streets[1].walls.push(new Wall(game, 0, 0, 200, 136));
    this.levels[2].streets[1].walls.push(new Wall(game, 0, 540, 200, 400));
    this.levels[2].streets[1].walls.push(new Wall(game, 1020, 0, 300, 720));
    this.levels[2].streets[1].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof21.png'));
    // street 2
    this.levels[2].streets[2].walls.push(new Wall(game, 0, 0, 200, 720));
    this.levels[2].streets[2].walls.push(new Wall(game, 378, 154, 172, 404));
    this.levels[2].streets[2].walls.push(new Wall(game, 1020, 0, 300, 150));
    this.levels[2].streets[2].walls.push(new Wall(game, 1020, 360, 300, 500));
    this.levels[2].streets[2].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof22.png'));
    // street 3
    this.levels[2].streets[3].walls.push(new Wall(game, 0, 567, 200, 300));
    this.levels[2].streets[3].walls.push(new Wall(game, 0, 0, 200, 190));
    this.levels[2].streets[3].walls.push(new Wall(game, 1020, 0, 300, 720));
    this.levels[2].streets[3].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof23.png'));
    // street 4
    this.levels[2].streets[4].walls.push(new Wall(game, 0, 275, 200, 450));
    this.levels[2].streets[4].walls.push(new Wall(game, 733, 208, 166, 374));
    this.levels[2].streets[4].walls.push(new Wall(game, 1020, 200, 300, 720));
    this.levels[2].streets[4].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof24.png'));
    // street 5
    this.levels[2].streets[5].walls.push(new Wall(game, 150, 0, 287, 130));
    this.levels[2].streets[5].walls.push(new Wall(game, 567, 0, 480, 130));
    this.levels[2].streets[5].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof25.png'));

    // level connections
    this.levels[1].streets[5].neighbors[1] = this.levels[2].streets[0];
    this.levels[2].streets[0].neighbors[2] = this.levels[1].streets[5];
    this.levels[2].streets[0].neighbors[1] = this.levels[2].houses[0];
    this.levels[2].houses[0].neighbors[3] = this.levels[2].streets[0];
    this.levels[2].streets[0].neighbors[0] = this.levels[2].streets[1];
    this.levels[2].streets[1].neighbors[2] = this.levels[2].streets[0];
    this.levels[2].streets[1].neighbors[3] = this.levels[2].houses[1];
    this.levels[2].houses[1].neighbors[1] = this.levels[2].streets[1];
    this.levels[2].streets[1].neighbors[0] = this.levels[2].streets[2];
    this.levels[2].streets[2].neighbors[2] = this.levels[2].streets[1];
    this.levels[2].streets[2].neighbors[1] = this.levels[2].houses[2];
    this.levels[2].houses[2].neighbors[3] = this.levels[2].streets[2];
    this.levels[2].streets[2].neighbors[0] = this.levels[2].streets[3];
    this.levels[2].streets[3].neighbors[2] = this.levels[2].streets[2];
    this.levels[2].streets[3].neighbors[3] = this.levels[2].houses[3];
    this.levels[2].houses[3].neighbors[1] = this.levels[2].streets[3];
    this.levels[2].streets[3].neighbors[0] = this.levels[2].streets[4];
    this.levels[2].streets[4].neighbors[2] = this.levels[2].streets[3];
    this.levels[2].streets[4].neighbors[0] = this.levels[2].streets[5];
    this.levels[2].streets[5].neighbors[2] = this.levels[2].streets[4];
    this.levels[2].streets[5].neighbors[0] = this.levels[2].houses[4];
    this.levels[2].houses[4].neighbors[2] = this.levels[2].streets[5];

    generateEnemies(game, this.levels[2].streets[0], 2, 4);
    generateEnemies(game, this.levels[2].streets[1], 2, 4);
    generateEnemies(game, this.levels[2].streets[2], 2, 4);
    generateEnemies(game, this.levels[2].streets[3], 2, 4);
    generateEnemies(game, this.levels[2].streets[4], 2, 4);
    generateEnemies(game, this.levels[2].streets[5], 2, 4);
    generateEnemies(game, this.levels[2].houses[0], 2, 8);
    generateEnemies(game, this.levels[2].houses[1], 2, 8);
    generateEnemies(game, this.levels[2].houses[2], 2, 9);
    generateEnemies(game, this.levels[2].houses[3], 2, 9);

    console.log('loading complete!');
};

SceneManager.prototype.reload = function (lvl) {
    if (lvl > 0) this.loadProgress(lvl - 1);
    this.player.health.current = this.player.health.max;
    this.player.alive = true;
    if (lvl == 0) {
        this.level.current = 0;
        this.bosses = [0, 1, 2, 3];
        this.buildLevelOne(this.game);
        this.player.x = 515;
        this.player.y = 470;
        this.changeBackground(this.levels[0].houses[5]);
        this.game.addEntity(new Fade(this.game, 'fromBlack'));
    }
    else if (lvl == 1) {
        this.level.current = 0;
        var boss = this.bossArray.pop();
        this.bosses.push(boss);
        this.buildLevelTwo(this.game);
        this.player.x = 640;
        this.player.y = 360;
        this.changeBackground(this.levels[0].houses[4]);
        this.game.addEntity(new Fade(this.game, 'fromBlack'));
    }
    else if (lvl == 2) {
        this.level.current = 1;
        var boss = this.bossArray.pop();
        this.bosses.push(boss);
        this.buildLevelThree(this.game);
        this.player.x = 640;
        this.player.y = 360;
        this.changeBackground(this.levels[1].houses[4]);
        this.game.addEntity(new Fade(this.game, 'fromBlack'));
    }
};

SceneManager.prototype.buildHouse = function (lvl, side, prev) {
    var walls = [];
    var door = null;
    var weapon = null;
    var spawn = { x: 0, y: 0 };
    var spawns = [];
    var wpnSpawn = { x: 640, y: 360 };
    var index = Math.floor(Math.random() * 5) + 1;
    while (index == prev) index = Math.floor(Math.random() * 5) + 1;

    if (side == 0) {
        if (index == 1) {
            walls[0] = new Wall(this.game, 0, 0, 30, 358);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 1250, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 0, 474, 30, 246);
            walls[5] = new Wall(this.game, 0, 300, 374, 30);
            walls[6] = new Wall(this.game, 344, 0, 30, 180);
            walls[7] = new Wall(this.game, 658, 400, 30, 320);
            walls[8] = new Wall(this.game, 688, 441, 93, 249);
            walls[9] = new Column(this.game, 988, 262, 102);
            door = new Door(this.game, 4, 358, 22, 116);
            spawn = { x: 80, y: 416 };
            spawns = [{ x: 200, y: 170 }, { x: 650, y: 200 }, { x: 1000, y: 550 }];
            wpnSpawn = { x: 500, y: 500 };
        } else if (index == 2) {
            walls[0] = new Wall(this.game, 0, 0, 30, 310);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 1250, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 0, 426, 30, 294);
            walls[5] = new Wall(this.game, 450, 220, 30, 342);
            walls[6] = new Wall(this.game, 920, 164, 30, 342);
            walls[7] = new Wall(this.game, 30, 30, 147, 61);
            door = new Door(this.game, 4, 310, 22, 116);
            spawn = { x: 80, y: 368 };
            spawns = [{ x: 670, y: 220 }, { x: 670, y: 550 }, { x: 1100, y: 350 }];
            wpnSpawn = { x: 700, y: 350 };
        } else if (index == 3) {
            walls[0] = new Wall(this.game, 0, 0, 30, 294);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 1250, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 0, 410, 30, 310);
            walls[5] = new Wall(this.game, 344, 0, 30, 280);
            walls[6] = new Wall(this.game, 748, 372, 30, 348);
            walls[7] = new Wall(this.game, 907, 587, 244, 103);
            door = new Door(this.game, 4, 294, 22, 116);
            spawn = { x: 80, y: 352 };
            spawns = [{ x: 500, y: 530 }, { x: 700, y: 200 }, { x: 1020, y: 450 }];
            wpnSpawn = { x: 500, y: 500 };
        } else if (index == 4) {
            walls[0] = new Wall(this.game, 0, 0, 30, 188);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 1250, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 0, 304, 30, 416);
            walls[5] = new Wall(this.game, 354, 488, 598, 30);
            walls[6] = new Wall(this.game, 748, 0, 30, 280);
            walls[7] = new Wall(this.game, 993, 30, 58, 53);
            walls[8] = new Wall(this.game, 1125, 30, 58, 55);
            walls[9] = new Column(this.game, 442, 210, 70);
            door = new Door(this.game, 4, 188, 22, 116);
            spawn = { x: 80, y: 246 };
            spawns = [{ x: 200, y: 570 }, { x: 720, y: 600 }, { x: 1000, y: 240 }];
            wpnSpawn = { x: 650, y: 400 };
        } else {
            walls[0] = new Wall(this.game, 0, 0, 30, 294);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 1250, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 0, 410, 30, 310);
            walls[5] = new Wall(this.game, 344, 0, 30, 280);
            walls[6] = new Wall(this.game, 344, 530, 30, 190);
            walls[7] = new Column(this.game, 640, 250, 70);
            walls[8] = new Column(this.game, 980, 504, 70);
            door = new Door(this.game, 4, 294, 22, 116);
            spawn = { x: 80, y: 352 };
            spawns = [{ x: 260, y: 120 }, { x: 600, y: 550 }, { x: 1000, y: 200 }];
            wpnSpawn = { x: 600, y: 500 };
        }
    } else {
        if (index == 1) {
            walls[0] = new Wall(this.game, 1250, 0, 30, 358);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 0, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 1250, 474, 30, 246);
            walls[5] = new Wall(this.game, 906, 300, 374, 30);
            walls[6] = new Wall(this.game, 906, 0, 30, 180);
            walls[7] = new Wall(this.game, 592, 400, 30, 320);
            walls[8] = new Wall(this.game, 489, 441, 93, 249);
            walls[9] = new Column(this.game, 292, 262, 102);
            door = new Door(this.game, 1254, 358, 22, 116);
            spawn = { x: 1200, y: 416 };
            spawns = [{ x: 550, y: 200 }, { x: 300, y: 560 }, { x: 1010, y: 550 }];
            wpnSpawn = { x: 780, y: 500 };
        } else if (index == 2) {
            walls[0] = new Wall(this.game, 1250, 0, 30, 310);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 0, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 1250, 426, 30, 294);
            walls[5] = new Wall(this.game, 800, 220, 30, 342);
            walls[6] = new Wall(this.game, 330, 164, 30, 342);
            walls[7] = new Wall(this.game, 1103, 30, 147, 61);
            door = new Door(this.game, 1254, 310, 22, 116);
            spawn = { x: 1200, y: 368 };
            spawns = [{ x: 200, y: 190 }, { x: 600, y: 200 }, { x: 600, y: 520 }];
            wpnSpawn = { x: 580, y: 350 };
        } else if (index == 3) {
            walls[0] = new Wall(this.game, 1250, 0, 30, 310);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 0, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 1250, 426, 30, 294);
            walls[5] = new Wall(this.game, 906, 440, 30, 280);
            walls[6] = new Wall(this.game, 502, 0, 30, 348);
            walls[7] = new Wall(this.game, 129, 30, 244, 103);
            door = new Door(this.game, 1254, 310, 22, 116);
            spawn = { x: 1200, y: 368 };
            spawns = [{ x: 250, y: 250 }, { x: 650, y: 160 }, { x: 1060, y: 600 }];
            wpnSpawn = { x: 780, y: 220 };
        } else if (index == 4) {
            walls[0] = new Wall(this.game, 1250, 0, 30, 188);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 0, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 1250, 304, 30, 416);
            walls[5] = new Wall(this.game, 328, 488, 598, 30);
            walls[6] = new Wall(this.game, 502, 0, 30, 280);
            walls[7] = new Wall(this.game, 97, 30, 58, 55);
            walls[8] = new Wall(this.game, 229, 30, 58, 53);
            walls[9] = new Column(this.game, 838, 210, 70);
            door = new Door(this.game, 1254, 188, 22, 116);
            spawn = { x: 1200, y: 246 };
            spawns = [{ x: 640, y: 180 }, { x: 380, y: 300 }, { x: 170, y: 590 }];
            wpnSpawn = { x: 630, y: 400 };
        } else {
            walls[0] = new Wall(this.game, 1250, 0, 30, 294);
            walls[1] = new Wall(this.game, 0, 0, 1280, 30);
            walls[2] = new Wall(this.game, 0, 0, 30, 720);
            walls[3] = new Wall(this.game, 0, 690, 1280, 30);
            walls[4] = new Wall(this.game, 1250, 410, 30, 310);
            walls[5] = new Wall(this.game, 906, 0, 30, 280);
            walls[6] = new Wall(this.game, 906, 530, 30, 190);
            walls[7] = new Column(this.game, 300, 504, 70);
            walls[8] = new Column(this.game, 640, 250, 70);
            door = new Door(this.game, 1254, 294, 22, 116);
            spawn = { x: 1200, y: 352 };
            spawns = [{ x: 200, y: 180 }, { x: 500, y: 400 }, { x: 800, y: 600 }];
            wpnSpawn = { x: 680, y: 500 };
        }
    }

    var rarityPct = 0;
    if (lvl == 0) rarityPct = 15;
    else if (lvl == 1) rarityPct = 25;
    else if (lvl == 2) rarityPct = 35;
    else if (lvl == 3) rarityPct = 45;
    if (Math.random() * 100 < rarityPct) {
        var abilityPct = rarityPct + 15;
        if (lvl != 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl + 1, Math.floor(Math.random() * 4), wpnSpawn);
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl + 1, null, wpnSpawn);
        } else {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl, Math.floor(Math.random() * 4), wpnSpawn);
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl, null, wpnSpawn);
        }
    } else {
        var abilityPct = rarityPct + 5;
        if (lvl != 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl, Math.floor(Math.random() * 4), wpnSpawn);
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl, null, wpnSpawn);
        } else {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl - 1, Math.floor(Math.random() * 4), wpnSpawn);
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl - 1, null, wpnSpawn);
        }
    }

    return new Background(this.game, './img/backgrounds/house' + side + index + '.png', weapon, door, 'house', walls, spawn, spawns);
};

SceneManager.prototype.fillBossRoom = function (lvl) {
    var index = Math.floor(Math.random() * this.bosses.length);
    var select = this.bosses[index];
    this.bossArray[lvl] = select;
    this.bosses.splice(index, 1);
    if (select == 0) {
        this.levels[lvl].houses[4] = this.buildBossRoom(0, 0);
        var dogs = [new Dog(this.game, 1163, 115),
        new Dog(this.game, 1163, 115),
        new Dog(this.game, 1163, 115),
        new Dog(this.game, 1163, 115),
        new Dog(this.game, 1163, 115),
        new Dog(this.game, 1163, 115)];
        for (var i = 0; i < dogs.length; i++) {
            dogs[i].caged = true;
            dogs[i].engage = true;
            this.levels[lvl].houses[4].enemies.push(dogs[i]);
        }
        this.levels[lvl].houses[4].enemies.push(new SlowDogg(this.game, dogs, lvl));
    } else if (select == 1) {
        this.levels[lvl].houses[4] = this.buildBossRoom(lvl, 1);
        this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 1, 150, 350));
        this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 1, 1100, 300));
        this.levels[lvl].houses[4].enemies.push(new BigGuy(this.game, lvl));
    } else if (select == 2) {
        this.levels[lvl].houses[4] = this.buildBossRoom(lvl, 2);
        this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 0, 1050, 500));
        this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 0, 1050, 500));
        this.levels[lvl].houses[4].enemies.push(new NinjaGuy(this.game, lvl));
    } else {
        this.levels[lvl].houses[4] = this.buildBossRoom(lvl, 3);
        this.levels[lvl].houses[4].enemies.push(new Police(this.game, 180, 250));
        this.levels[lvl].houses[4].enemies.push(new Police(this.game, 1100, 250));
        this.levels[lvl].houses[4].enemies.push(new MageGuy(this.game, lvl));
    }
};

SceneManager.prototype.buildBossRoom = function (lvl, boss) {
    var walls = [];
    var door = null;
    var spawn = null;
    var weapon = null;
    var abilityPct = 0;
    if (lvl == 0) abilityPct = 50;
    else if (lvl == 1) abilityPct = 60;
    else if (lvl == 2) abilityPct = 70;
    else abilityPct = 80;
    if (boss == 0) {
        if (lvl == 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2) + 1, lvl, Math.floor(Math.random() * 7));
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2) + 1, lvl);
        }
        if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2) + 1, lvl + 1, Math.floor(Math.random() * 7));
        else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2) + 1, lvl + 1);
        walls[0] = new Wall(this.game, 692, 690, 588, 30);
        walls[1] = new Wall(this.game, 1250, 0, 30, 720);
        walls[2] = new Wall(this.game, 0, 0, 1280, 30);
        walls[3] = new Wall(this.game, 0, 0, 30, 720);
        walls[4] = new Wall(this.game, 0, 690, 576, 30);
        walls[5] = new Wall(this.game, 1062, 30, 10, 184);
        walls[6] = new Wall(this.game, 1224, 214, 26, 178);
        walls[7] = new Column(this.game, 640, 258, 42);
        walls[8] = new Column(this.game, 220, 376, 42);
        walls[9] = new Column(this.game, 1052, 377, 42);
        walls[10] = new Column(this.game, 520, 488, 42);
        walls[11] = new Column(this.game, 752, 488, 42);
        door = new Door(this.game, 576, 694, 116, 22);
        spawn = { x: 634, y: 640 };
    } else if (boss == 1) {
        if (lvl == 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2), lvl, Math.floor(Math.random() * 7));
            else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2), lvl);
        }
        if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2), lvl + 1, Math.floor(Math.random() * 7));
        else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 2), lvl + 1);
        walls[0] = new Wall(this.game, 692, 690, 588, 30);
        walls[1] = new Wall(this.game, 1250, 0, 30, 720);
        walls[2] = new Wall(this.game, 0, 0, 1280, 30);
        walls[3] = new Wall(this.game, 0, 0, 30, 720);
        walls[4] = new Wall(this.game, 0, 690, 576, 30);
        walls[5] = new Column(this.game, 272, 210, 42);
        walls[6] = new Column(this.game, 1008, 210, 42);
        walls[7] = new Column(this.game, 508, 377, 42);
        walls[8] = new Column(this.game, 772, 377, 42);
        walls[9] = new Column(this.game, 230, 500, 42);
        walls[10] = new Column(this.game, 1050, 500, 42);
        door = new Door(this.game, 576, 694, 116, 22);
        spawn = { x: 634, y: 640 };
    } else if (boss == 2) {
        if (lvl == 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, 0, lvl, Math.floor(Math.random() * 7));
            else weapon = new Weapon(this.game, this.player, 0, lvl);
        }
        else if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, 0, lvl + 1, Math.floor(Math.random() * 7));
        else weapon = new Weapon(this.game, this.player, 0, lvl + 1);

        walls[0] = new Wall(this.game, 692, 690, 588, 30);
        walls[1] = new Wall(this.game, 1250, 0, 30, 720);
        walls[2] = new Wall(this.game, 0, 0, 1280, 30);
        walls[3] = new Wall(this.game, 0, 0, 30, 720);
        walls[4] = new Wall(this.game, 0, 690, 576, 30);
        walls[5] = new Column(this.game, 214, 518, 42);
        walls[6] = new Column(this.game, 358, 374, 42);
        walls[7] = new Column(this.game, 600, 293, 42);
        walls[8] = new Column(this.game, 856, 334, 42);
        walls[9] = new Column(this.game, 1030, 210, 42);
        door = new Door(this.game, 576, 694, 116, 22);
        spawn = { x: 634, y: 640 };
    } else {
        if (lvl == 3) {
            if (Math.random() * 100 < abilityPct)
                weapon = new Weapon(this.game, this.player, 2, lvl, Math.floor(Math.random() * 7));
            else weapon = new Weapon(this.game, this.player, 2, lvl);
        }
        else if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, 2, lvl + 1, Math.floor(Math.random() * 7));
        else weapon = new Weapon(this.game, this.player, 2, lvl + 1);
        walls[0] = new Wall(this.game, 692, 690, 588, 30);
        walls[1] = new Wall(this.game, 1250, 0, 30, 720);
        walls[2] = new Wall(this.game, 0, 0, 1280, 30);
        walls[3] = new Wall(this.game, 0, 0, 30, 720);
        walls[4] = new Wall(this.game, 0, 690, 576, 30);
        walls[5] = new Column(this.game, 351, 169, 42);
        walls[6] = new Column(this.game, 351, 551, 42);
        walls[7] = new Column(this.game, 929, 169, 42);
        walls[8] = new Column(this.game, 929, 551, 42);
        door = new Door(this.game, 576, 694, 116, 22);
        spawn = { x: 634, y: 640 };
    }

    return new Background(this.game, './img/backgrounds/boss0' + (boss + 1) + '.png', weapon, door, 'house', walls, spawn);
};

SceneManager.prototype.buildGarden = function (lvl, index) {
    var walls = [];
    var door = null;
    var weapon = null;
    var spawns = [];
    var spawn = { x: 0, y: 0 };
    if (index == 1) {
        walls[0] = new Wall(this.game, 0, 0, 125, 375);
        walls[1] = new Wall(this.game, 0, 0, 1280, 125);
        walls[2] = new Wall(this.game, 1220, 0, 60, 720);
        walls[3] = new Wall(this.game, 0, 620, 1280, 100);
        walls[4] = new Wall(this.game, 340, 280, 125, 130);
        walls[5] = new Wall(this.game, 850, 370, 130, 130);
        door = new Door(this.game, 0, 390, 10, 220);
        spawn = { x: 60, y: 500 };
        spawns = [{ x: 1090, y: 250 }, { x: 640, y: 500 }, { x: 240, y: 220 }];
    } else if (index == 2) {
        walls[0] = new Wall(this.game, 0, 0, 125, 250);
        walls[1] = new Wall(this.game, 0, 0, 1280, 125);
        walls[2] = new Wall(this.game, 1220, 0, 60, 720);
        walls[3] = new Wall(this.game, 0, 620, 1280, 100);
        walls[4] = new Wall(this.game, 0, 495, 125, 225);
        walls[5] = new Wall(this.game, 380, 0, 130, 360);
        walls[6] = new Wall(this.game, 800, 320, 130, 130);
        door = new Door(this.game, 0, 260, 10, 230);
        spawn = { x: 60, y: 375 };
        spawns = [{ x: 500, y: 500 }, { x: 250, y: 225 }, { x: 1070, y: 240 }];
    } else {
        walls[0] = new Wall(this.game, 0, 0, 125, 215);
        walls[1] = new Wall(this.game, 0, 0, 1280, 125);
        walls[2] = new Wall(this.game, 1220, 0, 60, 720);
        walls[3] = new Wall(this.game, 0, 620, 1280, 100);
        walls[4] = new Wall(this.game, 0, 395, 125, 325);
        walls[5] = new Wall(this.game, 520, 395, 390, 325);
        door = new Door(this.game, 0, 220, 10, 170);
        spawn = { x: 60, y: 405 };
        spawns = [{ x: 1070, y: 490 }, { x: 700, y: 260 }, { x: 320, y: 500 }];
    }
    var rarityPct = 0;
    if (lvl == 0) rarityPct = 15;
    else if (lvl == 1) rarityPct = 25;
    else if (lvl == 2) rarityPct = 35;
    else if (lvl == 3) rarityPct = 45;
    if (Math.random() * 100 < rarityPct) {
        var abilityPct = rarityPct + 15;
        if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl + 1, Math.floor(Math.random() * 4));
        else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl + 1);
    } else {
        var abilityPct = rarityPct + 5;
        if (Math.random() * 100 < abilityPct)
            weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl, Math.floor(Math.random() * 4));
        else weapon = new Weapon(this.game, this.player, Math.floor(Math.random() * 3), lvl);
    }

    return new Background(this.game, './img/backgrounds/garden0' + index + '.png', weapon, door, 'house', walls, spawn, spawns);
};