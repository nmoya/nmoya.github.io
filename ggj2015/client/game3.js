var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var map;
var cursors;
var availableSections = {};
var visibleSections = [];
var scrollingGroup;
var last_key = "map2";
var last_layer_index = null;
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
    // game.load.tilemap('map2', './assets/tilemaps/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.tilemap('map3', './assets/tilemaps/maps/map3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');
}


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    map = game.add.tilemap("map");
    map.addTilesetImage('MainTileset');

    scrollingGroup = game.add.group(undefined, 'scroller', true);
    for (i = 1; i <= 3; i++) {
        curr = "map" + i.toString();
        availableSections[curr] = []
        for (j = 0; j < 3; j++) {
            layer_name = curr + (j + 1).toString();
            tmp_layer = map.createLayer(curr, map.widthInPixels, map.heightInPixels, scrollingGroup);
            tmp_layer.name = layer_name;
            tmp_layer.resizeWorld();
            availableSections[curr].push({
                "layer": tmp_layer,
                "name": curr
            });
            // map.setCollisionBetween(1, 200, false, layer_name, false);
        }
    }
    for (key in availableSections) {
        for (i = 0; i < availableSections[key].length; i++) {
            availableSections[key][i]["layer"].smoothed = false;
            availableSections[key][i]["layer"].fixedToCamera = false;
            availableSections[key][i]["layer"].visible = false;
            availableSections[key][i]["layer"].debug = true;
            // game.physics.arcade.enable(availableSections[key][i]["layer"]);
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
    // curr_tile = map.getTileWorldXY(ship.body.x, ship.body.y, tilex, tiley, 4);
    // console.log(curr_tile.x, curr_tile.y, curr_tile.index);
    curr_tile_x = Math.round((ship.body.x + (-scrollingGroup.x % 1120)) / tilex) % 16;
    curr_tile_y = Math.round(ship.body.y / tiley);

    //console.log(visibleSections[0]["name"], visibleSections[1]["name"], visibleSections[2]["name"]);
    if (ship.body.x > (-scrollingGroup.x % 1120)) {
        curr_layer = visibleSections[1]["name"];
        //console.log("I am in layer", ship.body.x > (-scrollingGroup.x % 1120), visibleSections[1]["layer"].name);
        // map.setCollisionBetween(1, 200, false, last_layer_index, false);
        // last_layer_index = visibleSections[1]["layer"].name;
        // map.setCollisionBetween(1, 200, true, last_layer_index, false);
        // game.physics.arcade.collide(ship, visibleSections[1]["layer"], gameOver);
    } else {
        curr_layer = visibleSections[0]["name"];
        //console.log("I am in layer", ship.body.x > (-scrollingGroup.x % 1120), visibleSections[0]["layer"].name);
        // if (last_layer_index != null) {
        //     console.log("Cancelling colision on ", last_layer_index);
        //     last_layer_index = map.getLayer(last_layer_index);
        //     map.setCollisionBetween(1, 200, false, last_layer_index, false);
        // } else {
        //     last_layer_index = visibleSections[0]["layer"].name;
        //     map.setCollisionBetween(1, 200, true, last_layer_index, false);
        //     console.log("Checking collision on ", last_layer_index);
        // }

        //game.physics.arcade.collide(ship, visibleSections[0]["layer"], gameOver);
    }
    curr_layer_idx = map.getLayer(curr_layer);
    //tile = map.getTileWorldXY(ship.body.x, ship.body.y, 70, 70, curr_layer);
    //console.log(tile);
    //console.log(tile.x, tile.y, tile.index);
    // curr_tile = map.layers[curr_layer_idx].data[curr_tile_y][curr_tile_x];
    curr_tile = map.getTile(curr_tile_x, curr_tile_y, curr_layer_idx, true);
    console.log(curr_tile.x, curr_tile.y, curr_tile.index, curr_layer);
    scrollingGroup.x += scrolling_speed;
}

function gameOver() {
    scrolling_speed = 0;
    // alert("game over, press f5");
    console.log("game over on ");
}


function render() {
    // game.debug.body(map);
}

function placeNextSection() {
    var hide = visibleSections.splice(0, visibleSections.length - 2);
    for (var i in hide) {
        hide[i]["layer"].visible = false;
        availableSections[hide[i]["name"]].push(hide[i]);
    }
    var random = Math.floor(Math.random() * (graph[last_key].length));
    var newKey = graph[last_key][random];
    last_key = newKey;
    var newSection = availableSections[newKey].splice(0, 1)[0];
    if (visibleSections.length != 0)
        newSection["layer"].x = visibleSections[visibleSections.length - 1]["layer"].x + map.widthInPixels
    else {
        newSection["layer"].x = 0;
    }
    newSection["layer"].visible = true;
    visibleSections.push(newSection);

}