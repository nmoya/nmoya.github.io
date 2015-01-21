var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.tilemap('map', './assets/tilemaps/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
    game.load.image('ship', './assets/sprites/thrust_ship2.png');

}


var tilex = 70;
var tiley = 70;
var tilewidth = 16;
var tileheight = 9;
var ship;
var map;
var layer;
var cursors;
var walls;



function concatenateTileMap(tilemap, map) {
    var data = map
    if (data === null) {
        return;
    }
    tilemap.layers.concat(data.layers);
    tilemap.tilesets.concat(data.tilesets);
    tilemap.tiles.concat(data.tiles);
    // tilemap.collideIndexes = tilemap.collideIndexes;
    // tilemap.collision = data.collision;
}

function create() {

    // game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = '#2d2d2d';

    map = game.add.tilemap("map0"); //, 70, 70, tilewidth * 3, 9);
    map.addTilesetImage('MainTileset');
    map.setCollisionBetween(1, 156);

    layer = map.createLayer('layer0');
    layer.scrollFactorX = 0.5;
    layer.resizeWorld();
    // game.physics.p2.convertTilemap(map, layer);
    // walls = game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    ship = game.add.sprite(200, 200, 'ship');
    // game.physics.p2.enable(ship);
    game.physics.enable(ship);
    game.camera.follow(ship);

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.


    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // ship.body.collideWorldBounds = false;


    cursors = game.input.keyboard.createCursorKeys();

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
    game.physics.arcade.collide(ship, layer, function() {
        console.log("hello world");
    });

}

function render() {

}