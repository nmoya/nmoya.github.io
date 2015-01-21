var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

//Infinite map
var gameState = {};
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


var tilex = 70;
var tiley = 70;
var tilewidth = 16;
var tileheight = 9;
var ship;
var displacement = 0;
var scrolling_speed = -7;


function randomInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}


function preload() {
    game.load.tilemap('map', './assets/tilemaps/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');
}


function create() {
    game.stage.backgroundColor = '#2d2d2d';

    // Infinite scrolling
    map = game.add.tilemap('map');
    map.addTilesetImage('MainTileset');
    map.setCollisionBetween(1, 156);
    scrollingGroup = game.add.group(undefined, 'scroller', true);

    for (var i = 1; i <= 3; i++) {
        var curr = "map" + i.toString();
        availableSections[curr] = []
        for (var j = 0; j < 3; j++) {
            availableSections[curr].push({
                "layer": map.createLayer(curr, map.widthInPixels, map.heightInPixels, scrollingGroup),
                "name": curr
            });
        }
    }
    for (var key in availableSections) {
        for (var i = 0; i < availableSections[key].length; i++) {
            availableSections[key][i]["layer"].fixedToCamera = false;
            availableSections[key][i]["layer"].visible = false;
        }
    }
    last_key = "start";
    placeNextSection();
    placeNextSection();

    // Player
    ship = game.add.sprite(200, 150, 'ship');
    game.physics.enable(ship);


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

    if ((Math.abs(scrollingGroup.x) - displacement) > 1110) {
        displacement = Math.abs(scrollingGroup.x);
        placeNextSection();
    }
    // for (var i = 0; i < visibleSections.length; i++) {
    //     game.physics.arcade.collide(ship, visibleSections[i]["layer"], gameOver);
    // }


}

function gameOver() {
    // scrolling_speed = 0;
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