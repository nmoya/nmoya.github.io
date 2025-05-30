var game = new Phaser.Game(1120, 600, Phaser.AUTO, 'phaser-example', {
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
var currentState = "start";
var displacement = 0;
var placements = 0;
var graph = {
    "start": ["map1"],
    "map1": ["map2", "map4"],
    "map2": ["map3"],
    "map3": ["map2", "map5"],
    "map4": ["map3", "map5"],
    "map5": ["map4"]
}

var tileX = 20;
var tileY = 20;
var tileWidth = 56;
var tileHeight = 30;

var player, hpizza, spizza, background;

var explosionSprite, explosionAnimation;
var playerStartX = 100;
var playerStartY = 300;
var offScreenX = -1120;
var offScreenY = -1120;
var originalScrollingSpeed = -5;
var scrollingSpeed = originalScrollingSpeed;
var scoreIncrement = 100;

var scoreText = null;
var scoreString;
var score = -100;

function randomInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}


function preload() {
    game.load.tilemap('map', './assets/tilemaps/maps/gamemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('explosion', 'assets/sprites/explode.png', 128, 128);
    game.load.image('MainTileset', './assets/tilemaps/tiled/ggjtilesv3.png');
    game.load.image('hpizza', './assets/sprites/happy-pizza.png');
    game.load.image('spizza', './assets/sprites/scared-pizza.png');
    game.load.image('hpoop', './assets/sprites/happy-poop.png');
    game.load.image('background', 'assets/sprites/background.jpg');
    game.load.audio('backgroundaudio', "assets/audio/background.mp3");


}


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    backgroundaudio = game.add.audio('backgroundaudio');

    backgroundaudio.play();

    background = game.add.tileSprite(0, 0, 1120, 600, 'background');
    map = game.add.tilemap("map");
    map.addTilesetImage('MainTileset');

    scrollingGroup = game.add.group(undefined, 'scroller', true);
    game.world.addAt(background, 0);
    game.world.addAt(scrollingGroup, 1);
    for (i = 1; i <= Object.keys(graph).length - 1; i++) {
        curr = "map" + i.toString();
        availableSections[curr] = []
        for (j = 0; j < 3; j++) {
            layer_name = curr + (j + 1).toString();
            tmpLayer = map.createLayer(curr, map.widthInPixels, map.heightInPixels, scrollingGroup);
            tmpLayer.name = layer_name;
            tmpLayer.resizeWorld();
            availableSections[curr].push({
                "layer": tmpLayer,
                "name": curr
            });
        }
    }
    for (key in availableSections) {
        for (i = 0; i < availableSections[key].length; i++) {
            availableSections[key][i]["layer"].smoothed = false;
            availableSections[key][i]["layer"].fixedToCamera = false;
            availableSections[key][i]["layer"].visible = false;
            // availableSections[key][i]["layer"].debug = true;
        }
    }
    displacement = 0;
    placements = 0;
    scrollingGroup.x = -1120;
    scrollingGroup.y = 0;
    currentState = "start";
    placeNextSection();
    currentState = "start";
    placeNextSection();
    placeNextSection();
    scrollingSpeed = originalScrollingSpeed;

    // Player sprites
    hpizza = game.add.sprite(playerStartX, playerStartY, 'hpizza');
    game.physics.enable(hpizza);
    hpizza.body.collideWorldBounds = true;
    hpizza.anchor.setTo(0.5, 0.5);

    spizza = game.add.sprite(offScreenX, offScreenY, 'spizza');
    game.physics.enable(spizza);
    spizza.body.collideWorldBounds = false;
    spizza.anchor.setTo(0.5, 0.5);

    hpoop = game.add.sprite(offScreenX, offScreenY, 'hpoop');
    game.physics.enable(hpoop);
    hpoop.body.collideWorldBounds = false;
    hpoop.anchor.setTo(0.5, 0.5);
    // Player starts as hpizza
    player = hpizza;

    explosionSprite = game.add.sprite(0, -200, 'explosion');
    explosionAnimation = explosionSprite.animations.add('explode');
    explosionAnimation.onComplete.add(function() {
        explosionSprite.y = -600;
    }, this);

    scoreString = "Score : "
    scoreText = game.add.text(10, 540, scoreString + score, {
        font: '34px Arial',
        fill: '#fff'
    });
    setScore(-100);

    //  Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '84px Arial',
        fill: '#fff'
    });
    game.world.bringToTop(scoreText);
    game.world.bringToTop(stateText);

    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    if (player.alive) {
        if (cursors.left.isDown)
            player.body.x -= 7;
        else if (cursors.right.isDown)
            player.body.x += 5;
        if (cursors.up.isDown)
            player.body.y -= 5;
        else if (cursors.down.isDown)
            player.body.y += 5;
    }

    if ((Math.abs(scrollingGroup.x) - displacement) == 1120) {
        displacement = Math.abs(scrollingGroup.x);
        setScore(score + scoreIncrement);
        placeNextSection();
        placements += 1;
        if (placements == 5) {
            changePlayerSprite(hpizza, spizza);
        } else if (placements == 15)
            changePlayerSprite(spizza, hpoop);
    }
    currTileX = game.math.snapToFloor((player.body.x + (-scrollingGroup.x % 1120)), tileX) / tileX;
    currTileY = game.math.snapToFloor(player.body.y, tileY) / tileY;

    if (currTileX < tileWidth)
        curr_layer = visibleSections[0]["name"];
    else
        curr_layer = visibleSections[1]["name"];

    currTileX = currTileX % tileWidth;

    currLayerIdx = map.getLayer(curr_layer);
    currTile = map.getTile(currTileX, currTileY, currLayerIdx, true);
    scrollingGroup.x += scrollingSpeed;
    if (currTile.index != -1 && currTile.index != 9) {
        gameOver();
    }
}

function changePlayerSprite(old, _new) {
    _new.body.x = old.x;
    _new.body.y = old.y;
    _new.collideWorldBounds = true;
    old.kill();

    player = _new;
}

function setScore(value) {
    score = value;
    scoreText.text = scoreString + score
}

function gameOver() {

    explosionSprite.x = player.x;
    explosionSprite.y = player.y;
    player.kill();
    explosionSprite.play("explode", 24, false);
    scrollingSpeed = 0;

    stateText.text = " GAME OVER \n Click to restart";
    stateText.visible = true;
    game.input.onTap.addOnce(restart, this);
}

function restart() {
    var hide = visibleSections.splice(0, visibleSections.length);
    for (var i in hide) {
        hide[i]["layer"].destroy();
    }
    for (key in availableSections) {
        for (i = 0; i < availableSections[key].length; i++) {
            availableSections[key][i]["layer"].destroy();
        }
    }
    availableSections = [];
    explosionSprite.destroy();
    availableSections = [];
    visibleSections = [];
    stateText.destroy();
    scoreText.destroy();
    player.destroy();
    hpizza.destroy();
    spizza.destroy();
    hpoop.destroy();
    background.destroy();
    create();

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
    var random = Math.floor(Math.random() * (graph[currentState].length));
    var newKey = graph[currentState][random];
    currentState = newKey;
    var newSection = availableSections[newKey].splice(0, 1)[0];
    if (visibleSections.length != 0)
        newSection["layer"].x = visibleSections[visibleSections.length - 1]["layer"].x + map.widthInPixels
    else {
        newSection["layer"].x = 0;
    }
    newSection["layer"].visible = true;
    visibleSections.push(newSection);

}