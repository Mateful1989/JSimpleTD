"use strict";

class UnitRenderer {
    constructor() {
        this.container = new PIXI.ParticleContainer(); //DisplayObjectContainer();
        this.units = [];
    }

    addUnit(unit) {
        if (unit) {
            this.units.push(unit);
            this.container.addChild(unit.sprite);
        }
    }

    updatePositions(dt, speed, boundaries, type = "RANDOM") {
        // console.log("update positions");
        if (type == "RANDOM") {
            for (var u of this.units) {
                u.sprite.x += dt * u.sprite.speed;
                u.sprite.y += dt * u.sprite.speed;

                if (boundaries &&
                    (u.sprite.x < boundaries.minX ||
                        u.sprite.x > boundaries.maxX ||
                        u.sprite.y < boundaries.minY ||
                        u.sprite.y > boundaries.maxY)) {
                    u.randomizePosition(boundaries.minX, boundaries.maxX, boundaries.minY, boundaries.maxY, speed);
                };

            }
        } else {
            for (var u of this.units) {
                u.updatePosition(dt);
            }
        }
    }
}

class Unit {
    constructor(x, y, speed, scale, texture) {
        console.log("constructing unit", arguments);
        this.sprite = new PIXI.Sprite(texture);

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.speed = speed;
        this.sprite.scale.set(scale, scale);
        this.path = null;

        this.timeLastMovement = new Date();
    }


    followPath(path) {
        this.path = path;
    }

    updatePosition(dt) {
        if (this.path && this.path.length > 0) {
            // console.log("updating position according to path");

            let currentTime = new Date();
            if (currentTime - this.timeLastMovement > 200) {
                // console.log("updating position according to path", this.path);
                var pos = this.path.shift();
                this.sprite.x = pos[0];
                this.sprite.y = pos[1];
                this.timeLastMovement = currentTime;
            }
        }
    }

    randomizePosition(minX, maxX, minY, maxY, speed) {
        this.sprite.x = Math.floor((Math.random() * (maxX - minX)) + minX);
        this.sprite.y = Math.floor((Math.random() * (maxY - minY)) + minY);
        this.sprite.speed = Math.random() > 0.5 ? speed : -speed;
    }
}
