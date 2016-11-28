"use strict";


console.log("LOADING RENDERER.JS");

class RendererWrapper {
    constructor(width, height, bgColor, tileSize, texturePack, appendFn) {
        console.log("constructor of " + this.constructor.name, arguments)

        this.width = width;
        this.height = height;
        this.bgColor = bgColor;
        this.tileSize = tileSize;
        this.texturePack = texturePack;

        var options = {
            backgroundColor: this.bgColor
        };

        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, options);

        if (appendFn) {
            appendFn(this.renderer.view);
        }

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        this.state = "running";
       
        this.lastFrameTime = new Date();

        this.gridRenderer = null;
        this.unitRenderer = null;

        this.boundaries = null;

        this.gameLoop();
    }

    initMap(map) {
        console.log("init map", map);
        this.map = map;
        this.gridRenderer = new GridRenderer(map.tiles, this.tileSize, this.texturePack);
        this.stage.addChild(this.gridRenderer.container);

        this.boundaries = {
            "minX": -this.tileSize,
            "maxX": this.tileSize * this.gridRenderer.width,
            "minY": -this.tileSize,
            "maxY": this.tileSize * this.gridRenderer.height,
        };
    }

    initUnits(map) {
        this.unitRenderer = new UnitRenderer();
        this.stage.addChild(this.unitRenderer.container);

        for (let i = 0; i < 10; i++) {
            let texture = this.texturePack["monster#1"];
            let unit = new Unit(0, 0, this.tileSize, this.tileSize, 1, texture);
            unit.randomizePosition(this.boundaries.minX, this.boundaries.maxX, this.boundaries.minY, this.boundaries.maxY, this.tileSize, this.tileSize);

            this.unitRenderer.addUnit(unit);
        }
    }

    gameLoop() {
        let thisFrameTime = new Date();
        let dt = (thisFrameTime - this.lastFrameTime) / 1000.; // time difference

        requestAnimationFrame(() => this.gameLoop());
        this.update(dt);
        this.renderer.render(this.stage);

        this.lastFrameTime = thisFrameTime;
    }

    update(dt) {
        if (this.unitRenderer && this.gridRenderer) {
            this.unitRenderer.updatePositions(dt, this.tileSize, this.boundaries);
        }
    }
}
