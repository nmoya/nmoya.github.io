var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var maps = [];
var cursors;
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

var tilex = 70;
var tiley = 70;
var tilewidth = 16;
var tileheight = 9;
var ship;
var displacement = 0;
var scrolling_speed = -5;
var collision_check = 0;


function randomInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}


function preload() {
    game.load.tilemap('map1', './assets/tilemaps/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', './assets/tilemaps/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map3', './assets/tilemaps/maps/map3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');
}


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    // Infinite scrolling

    scrollingGroup = game.add.group(undefined, 'scroller', true);
    // scrollingGroup.scale.x = 0.4;
    // scrollingGroup.scale.y = 0.4;
    for (var i = 1; i <= 3; i++) {
        var curr = "map" + i.toString();
        maps.push(game.add.tilemap(curr));
        maps[i - 1].setCollisionBetween(1, 200);
        maps[i - 1].addTilesetImage('MainTileset');
        availableSections[curr] = []
        for (var j = 0; j < 3; j++) {
            var layer_name = curr + (j + 1).toString();
            tmp_layer = maps[i - 1].createLayer(curr, maps[i - 1].widthInPixels, maps[i - 1].heightInPixels, scrollingGroup);
            tmp_layer.name = layer_name;
            availableSections[curr].push({
                "layer": tmp_layer,
                "name": curr
            });
            // console.log(tmp_layer);
        }
    }
    for (var key in availableSections) {
        for (var i = 0; i < availableSections[key].length; i++) {
            availableSections[key][i]["layer"].smoothed = false;
            availableSections[key][i]["layer"].fixedToCamera = false;
            availableSections[key][i]["layer"].visible = false;
            availableSections[key][i]["layer"].debug = true;
            availableSections[key][i]["layer"].y = -630;
            game.physics.arcade.enable(availableSections[key][i]["layer"]);
        }
    }
    scrollingGroup.x = -1120;
    scrollingGroup.y = 0;
    last_key = "start";
    placeNextSection();
    last_key = "start";
    placeNextSection();
    placeNextSection();

    // Player
    ship = game.add.sprite(0, 150, 'ship');
    game.physics.enable(ship);
    ship.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    // cursors.right.onUp.add(placeNextSection);
}

function update() {
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

    if ((Math.abs(scrollingGroup.x) - displacement) == 1120) {
        displacement = Math.abs(scrollingGroup.x);
        placeNextSection();
    }
    console.log(visibleSections[0]["name"], visibleSections[1]["name"], visibleSections[2]["name"]);
    if (ship.body.x > (-scrollingGroup.x % 1120)) {
        if (game.physics.arcade.collide(ship, visibleSections[1]["layer"]))
            gameOver(visibleSections[1]["name"]);
    } else {
        if (game.physics.arcade.collide(ship, visibleSections[0]["layer"]))
            gameOver(visibleSections[0]["name"]);
    }
    scrollingGroup.x += scrolling_speed;
}

function gameOver(name) {
    scrolling_speed = 0;
    // alert("game over, press f5");
    console.log("game over on ", name);
}


function render() {
    game.debug.body(maps[0]);
}

function placeNextSection() {
    var hide = visibleSections.splice(0, visibleSections.length - 2);
    for (var i in hide) {
        hide[i]["layer"].visible = false;
        hide[i]["layer"].y = -630;
        availableSections[hide[i]["name"]].push(hide[i]);
    }
    var random = Math.floor(Math.random() * (graph[last_key].length));
    var newKey = graph[last_key][random];
    last_key = newKey;
    var newSection = availableSections[newKey].splice(0, 1)[0];
    if (visibleSections.length != 0)
        newSection["layer"].x = visibleSections[visibleSections.length - 1]["layer"].x + maps[0].widthInPixels
    else {
        newSection["layer"].x = 0;
    }
    newSection["layer"].visible = true;
    newSection["layer"].y = 0;
    visibleSections.push(newSection);

}