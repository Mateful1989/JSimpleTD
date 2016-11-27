//"use strict";

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x222222 });
document.body.appendChild(renderer.view);
renderer.view.style.position = "absolute";

// create the root of the scene graph
var stage = new PIXI.Container();
stage.interactive = true;


var selectionContainer = new PIXI.DisplayObjectContainer();
var gridContainer = new PIXI.DisplayObjectContainer();

stage.addChild(gridContainer);
stage.addChild(selectionContainer);

var texture = PIXI.Texture.fromImage('img/bunny.png');
//Create the `cat` sprite
bunny = new PIXI.Sprite(texture);
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;
bunny.scale.set(0.2,0.2);

selectionContainer.addChild(bunny);
selectionContainer.zIndex  = 10000;

stage.on("mousemove", function(event) {
    // console.log("mousemove", event.data.global);
    // bunny.x = event.data.global.x;
    // bunny.y = event.data.global.y;
});
// stage.on("mousedown", function(event) { console.log("mouseover", event.global); });


function keyboard(keyCode) {
    var key = {};

    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`

    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}


var grid = [
    [0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 0]
];

function initGrid(grid, w, h) {
    var textureDict = {
        0: PIXI.Texture.fromImage('img/bunny.png'),
        1: PIXI.Texture.fromImage('img/bunny2.png')
    };

    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            var tileType = grid[y][x];
            var tileSprite = new PIXI.Sprite(textureDict[tileType]);
            tileSprite.interactive = true;
            tileSprite.x = x * w;
            tileSprite.y = y * h;
            tileSprite.width = w;
            tileSprite.height = h;
            tileSprite._tileType = tileType;

            tileSprite.on('mousedown', function() {
            	console.log(this._tileType);
            	
            	this._tileType = (this._tileType + 1) % 2;

				this.setTexture(textureDict[this._tileType]);
            });
            gridContainer.addChild(tileSprite);


        }
    }


}

function setup() {
    initGrid(grid, 128, 128);

    var texture = PIXI.Texture.fromImage('img/bunny.png');
    //Create the `cat` sprite
    cat = new PIXI.Sprite(texture);
    cat.y = 96;
    cat.vx = 0;
    cat.vy = 0;

    function onDown(eventData) {
        cat.scale.x += 0.3;
        cat.scale.y += 0.3;
    }
    cat.interactive = true;
    cat.on('mousedown', onDown);
    cat.on('touchstart', onDown);

    // stage.addChild(cat);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {

        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        cat.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Up
    up.press = function() {
        cat.vy = -5;
        cat.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    //Right
    right.press = function() {
        cat.vx = 5;
        cat.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Down
    down.press = function() {
        cat.vy = 5;
        cat.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    var message = new PIXI.Text(
        "Hello Pixi!", { font: "32px sans-serif", fill: "white" }
    );

    message.position.set(54, 96);
    stage.addChild(message);

    //Set the game state
    state = play;

    //Start the game loop
    gameLoop();
}

function gameLoop() {
    // var interactionData = new PIXI.interaction.InteractionData();
    //console.log("mouse at", interactionData.global);
    requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);
}

function play() {

    //Use the cat's velocity to make it move
    cat.x += cat.vx;
    cat.y += cat.vy
}



setup();
