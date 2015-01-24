var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var map, cursors;
var availableSections = {};
var visibleSections = [];
var scrollingGroup;
var last_key = "map2";
var graph = {
    "start": ["map2"],
    "map1": ["map2"],
    "map2": ["map3"],
    "map3": ["map1"]
}

var layer1, layer2;

var tilex = 70;
var tiley = 70;
var tilewidth = 16;
var tileheight = 9;
var ship;
var displacement = 0;
var scrolling_speed = -2;
var collision_check = 0;


function randomInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}


function preload() {
    game.load.tilemap('map', './assets/tilemaps/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', './assets/tilemaps/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');
}


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    // Infinite scrolling
    map2 = game.add.tilemap('map2');
    map2.addTilesetImage('MainTileset');
    map2.setCollisionBetween(1, 200);

    scrollingGroup = game.add.group(undefined, 'scroller', true);

    layer2 = map2.createLayer("map2", map2.widthInPixels, map2.heightInPixels, scrollingGroup);
    layer2.debug = true;


    map = game.add.tilemap('map');
    map.addTilesetImage('MainTileset');
    map.setCollisionBetween(1, 200);

    layer1 = map.createLayer("map1", map.widthInPixels, map.heightInPixels, scrollingGroup);
    layer1.debug = true;

    scrollingGroup.scale.x = 0.4;
    scrollingGroup.scale.y = 0.4;
    layer1.x = 0;
    layer2.x = 0;

    // Player
    ship = game.add.sprite(0, 150, 'ship');
    game.physics.enable(ship);
    ship.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    // cursors.right.onUp.add(placeNextSection);
}

function update() {
    scrollingGroup.x += -5;
    if (cursors.left.isDown) {
        ship.body.x -= 7;
    } else if (cursors.right.isDown) {
        ship.body.x += 5;
    }
    if (cursors.up.isDown) {
        ship.body.y -= 5;
    } else if (cursors.down.isDown) {
        ship.body.y += 5;
    }

    game.physics.arcade.collide(ship, layer2, gameOver);

}

function gameOver() {
    scrolling_speed = 0;
    // alert("game over, press f5");
    console.log("game over");
}


function render() {

}

function placeNextSection() {
    var random = Math.floor(Math.random() * (graph[last_key].length));
    var newKey = graph[last_key][random];
    last_key = newKey;
    var newSection = availableSections[newKey].splice(0, 1)[0];
    if (visibleSections.length != 0)
        newSection["layer"].x = visibleSections[visibleSections.length - 1]["layer"].x + map.widthInPixels
    else
        newSection["layer"].x = 0;
    newSection["layer"].visible = true;
    visibleSections.push(newSection);
    var hide = visibleSections.splice(0, visibleSections.length - 5);
    for (var i in hide) {
        hide[i]["layer"].visible = false;
        availableSections[hide[i]["name"]].push(hide[i]);
    }
}