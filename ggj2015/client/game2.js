var game = new Phaser.Game(1120, 630, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var gameState = {};
var map, cursors;
var availableSections = [];
var visibleSections = [];
var scrollingGroup;

var graph = {
    "map1": [3, 4, 5],
    "map2": [6, 7, 8],
    "map3": [0, 1, 2]
}


function randomInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}


function preload() {
    game.load.tilemap('map', './assets/tilemaps/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('MainTileset', './assets/tilemaps/tiled/tiles.png');
}


function create() {
    game.stage.backgroundColor = '#2d2d2d';

    map = game.add.tilemap('map');
    map.addTilesetImage('MainTileset');
    scrollingGroup = game.add.group(undefined, 'scroller', true);
    availableSections.push(map.createLayer('map1', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map1', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map1', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map2', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map2', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map2', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map3', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map3', map.widthInPixels, map.heightInPixels, scrollingGroup));
    availableSections.push(map.createLayer('map3', map.widthInPixels, map.heightInPixels, scrollingGroup));
    for (var i = 0; i < availableSections.length; i++) {
        availableSections[i].fixedToCamera = false;
        availableSections[i].visible = false;
    }
    placeNextSection();

    cursors = game.input.keyboard.createCursorKeys();
    cursors.right.onUp.add(placeNextSection);
}

function update() {
    scrollingGroup.x -= 10;
}

function render() {

}

function placeNextSection() {
    var newIndex = Math.floor(Math.random() * (availableSections.length));
    newIndex = 0;
    var newSection = availableSections.splice(newIndex, 1)[0];
    if (visibleSections.length != 0)
        newSection.x = visibleSections[visibleSections.length - 1].x + map.widthInPixels
    else
        newSection.x = 0;
    newSection.visible = true;
    visibleSections.push(newSection);
    var hide = visibleSections.splice(0, visibleSections.length - 5);
    for (var i in hide) {
        hide[i].visible = false;
        availableSections.push(hide[i]);
    }
    console.log(newIndex);


}