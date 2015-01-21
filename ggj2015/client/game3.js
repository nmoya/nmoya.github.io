var game = new Phaser.Game(900, 600, Phaser.CANVAS, div);

var gameState = {};
var map, cursors;
var availableSections = [];
var visibleSections = [];
var scrollingGroup;
gameState.main = function() {};
gameState.main.prototype = {
    preload: function() {
        game.load.tilemap('sections', 'Resources/infiniteScrolling.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'Resources/tmw_desert_spacing.png');
    },
    create: function() {

        game.stage.backgroundColor = '#201';
        map = game.add.tilemap('sections');
        map.addTilesetImage('Desert', 'tiles');
        scrollingGroup = game.add.group(undefined, 'scroller', true);
        scrollingGroup.scale.x = .5;
        scrollingGroup.scale.y = .5;
        availableSections.push(map.createLayer('A', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('A', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('A', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('B', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('B', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('B', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('C', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('C', map.widthInPixels, map.heightInPixels, scrollingGroup));
        availableSections.push(map.createLayer('C', map.widthInPixels, map.heightInPixels, scrollingGroup));
        for (var i = 0; i < availableSections.length; i++) {
            availableSections[i].fixedToCamera = false;
        }
        placeNextSection();
        placeNextSection();
        cursors = game.input.keyboard.createCursorKeys();
        cursors.right.onUp.add(placeNextSection);
    },
    update: function() {
        scrollingGroup.x -= 1;

    },
    render: function() {}

};

function placeNextSection() {
    var newIndex = Math.floor(Math.random() * ((availableSections.length - 1) + 1) + 0);
    var newSection = availableSections.splice(newIndex, 1)[0];
    newSection.x = visibleSections.length ? visibleSections[visibleSections.length - 1].x + map.widthInPixels + 2 : 0;
    newSection.visible = true;
    visibleSections.push(newSection);
    var hide = visibleSections.splice(0, visibleSections.length - 3);
    for (var i in hide) {
        hide[i].visible = false;
        availableSections.push(hide[i]);
    }


}

window.game = game;
game.state.add('main', gameState.main);