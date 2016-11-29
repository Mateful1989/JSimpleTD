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

            this.units = this.units.filter((u) => u.sprite !== null);
        }
    }
}

class Unit {
    constructor(x, y, speed, scale, texture) {
        console.log("constructing unit", arguments);
        this.sprite = new PIXI.Sprite(texture);

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(scale, scale);

        this.speed = speed;
        this.path = null;

        this.timeLastMovement = new Date();
    }


    followPath(path) {
        this.path = path;
    }

    updatePosition(dt) {
        const epsilon = 0.01;



        if (!this.path || this.path.length == 0) {
            this.sprite.destroy();
            this.sprite = null;
        }

        let distanceThisTimeFrame = dt * this.speed;

        while (this.path.length > 0) {
            let currentGoal = this.path[0];

            let x1 = this.sprite.x,
                y1 = this.sprite.y,
                x2 = currentGoal[0],
                y2 = currentGoal[1];
            let distance = Utils.distanceBetweenTwoPoints(x1, y1, x2, y2);

            if (distance > distanceThisTimeFrame + epsilon) {
                let [xNew, yNew] = Utils.interpolateCoordinates(x1, y1, x2, y2, distanceThisTimeFrame);
                this.sprite.x = xNew;
                this.sprite.y = yNew;
                break;
            } else {
                this.sprite.x = x2;
                this.sprite.y = y2;
                this.path.shift();
            }
            distanceThisTimeFrame -= distance;
        }
    }

    randomizePosition(minX, maxX, minY, maxY, speed) {
        this.sprite.x = Math.floor((Math.random() * (maxX - minX)) + minX);
        this.sprite.y = Math.floor((Math.random() * (maxY - minY)) + minY);
        this.speed = Math.random() > 0.5 ? speed : -speed;
    }
}
