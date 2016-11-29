"use strict";

console.log("LOADING MAP.JS");

class TDMap {
    constructor(mapString) {
        console.log("construct TDMap", mapString);
        let tiles = mapString.replace(/\r\n/g, "\n").split("\n").map((x) => x.split(""));

        console.log(tiles);

        this.tiles = tiles;
    }

    get tiles() {
        return this._tiles;
    }

    set tiles(tiles) {
        if (!tiles) {
            throw new Error("Must contain at least one tile.");
        }

        if (new Set(tiles.map((x) => x.length)).size != 1) {
            throw new Error("Every line must be the same length.");
        }

        this._tiles = tiles;
        this.w = tiles[0].length;
        this.h = tiles.length;
    }

    getPositionsByType(type) {
        let result = [];

        for (var x = 0; x < this.w; x++) {
            for (var y = 0; y < this.h; y++) {
                if (this._tiles[y][x] == type) {
                    result.push([x, y]);
                }
            }
        }

        return result;
    }

    get width() {
        return this.tiles[0].length;
    }

    get height() {
        return this.tiles.length;
    }

    getSpawnPoints() {
        return this.getPositionsByType("s");
    }

    getDestinationPoints() {
        return this.getPositionsByType("d");
    }

    isPathable(x, y) {
        const pathableTiles = ["o", "s", "d"];

        if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
            return false;
        } else {
            return pathableTiles.indexOf(this._tiles[y][x]) !== -1;
        }
    }
}

class GridRenderer {
    constructor(tiles, tileSize, texturePack) {
        this.tiles = tiles;
        this.tileSize = tileSize;
        this.texturePack = texturePack;

        this._width = 0;
        this._height = 0;

        //this._container = new PIXI.ParticleContainer();
        this._container = new PIXI.DisplayObjectContainer();
        this._container.interactive = true;

        if (this.tiles) {
            this.updateGrid();
        }
    }

    updateGrid() {
        if (!this.tiles) {
            throw new Error("Map array must be initialised.");
        }

        this.container.removeChildren();

        this._height = this.tiles.length
        this._width = this.tiles[0].length;

        for (var y = 0; y < this._height; y++) {
            for (var x = 0; x < this._width; x++) {
                var tileType = this.tiles[y][x];
                var tileSprite = new PIXI.Sprite(this.texturePack[tileType]);

                tileSprite.interactive = true;
                tileSprite.x = x * this.tileSize;
                tileSprite.y = y * this.tileSize;
                tileSprite.width = this.tileSize;
                tileSprite.height = this.tileSize;
                tileSprite._tileType = tileType;

                // tileSprite.on('mousedown', ((ctx, tile) => {
                //     return () => {} })(this, tileSprite));

                this.container.addChild(tileSprite);
            }
        }
    }

    get container() {
        return this._container;
    }

    get height() {
        return this._height;
    }

    get width() {
        return this._width;
    }
}
