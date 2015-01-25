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
    "map2": ["map3", "map2"],
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
    game.load.tilemap('map', './assets/tilemaps/maps/parsed_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');
}


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    // Infinite scrolling
    map = game.add.tilemap('map');
    map.addTilesetImage('MainTileset');
    map.setCollisionBetween(1, 200, true, 3, false);
    scrollingGroup = game.add.group(undefined, 'scroller', true);
    for (var i = 1; i <= 3; i++) {
        var curr = "map" + i.toString();
        availableSections[curr] = []
        for (var j = 0; j < 3; j++) {
            var layer_name = curr + (j + 1).toString();
            tmp_layer = map.createLayer(layer_name, map.widthInPixels, map.heightInPixels, scrollingGroup);
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
        }
    }
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
    scrollingGroup.x += scrolling_speed;

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
        collision_check += 1;
        displacement = Math.abs(scrollingGroup.x);
        placeNextSection();
        if (collision_check == 5)
            collision_check = 0;
    }
    game.physics.arcade.collide(ship, visibleSections[0]["layer"], gameOver);

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
    map.setCollisionBetween(1, 200, true, map.getLayer(newSection["layer"].name), false);
    var hide = visibleSections.splice(0, visibleSections.length - 3);
    for (var i in hide) {
        hide[i]["layer"].visible = false;
        availableSections[hide[i]["name"]].push(hide[i]);
    }
}