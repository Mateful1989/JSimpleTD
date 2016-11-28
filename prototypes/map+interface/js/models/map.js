"use strict";


class TDMap {
    constructor(mapString) {
        let tiles = mapString.replace(/\r\n/g, "\n").split("\n").map((x) => x.split(""));

        console.log(tiles);

        if (new Set(tiles.map((x) => x.length)).size != 1) {
            throw Error("Every line must be the same length.");
        }

        this._tiles = tiles;
    }

    get tiles() {
        return this._tiles;
    }

    set tiles(tiles) {
        this._tiles = tiles;
    }
}

class GridRenderer {
    constructor(tiles, tileSize, texturePack) {
        this.tiles = tiles;
        this.tileSize = tileSize;
        this.texturePack = texturePack;

        this._width = 0;
        this._height = 0;

        this._container = new PIXI.ParticleContainer(); //DisplayObjectContainer();

        if (this.tiles) {
            this.updateGrid();
        }
    }

    updateGrid() {
        if (!this.tiles) {
            throw new Error("Map array must be initialised.");
        }

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
                // tileSprite._tileType = tileType;

                // tileSprite.on('mousedown', () => {
                //     this._tileType = (this._tileType + 1) % 2;
                //     this.setTexture(textureDict[this._tileType]);
                // });

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
