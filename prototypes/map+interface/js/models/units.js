"use strict";


class UnitRenderer {
    constructor() {
        this.container = new PIXI.DisplayObjectContainer(); //ParticleContainer();
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
    constructor(x, y, speed, hitpoints, scale, texture, mask) {
        console.log("constructing unit", arguments);

        if (!texture) {
            throw new Error("Texture required");
        }

        if (texture.constructor === Array) {
            this.sprite = new PIXI.extras.MovieClip(texture);
            this.sprite.position.set(0);
            this.sprite.animationSpeed = 0.05;
            this.sprite.loop = true;
            // this.sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
            this.sprite.play(); //or gotoAndPlay(0)
        } else {
            // texture = mask;
            this.sprite = new PIXI.Sprite(texture);
        }

        if (mask) {
            this.sprite.mask = new PIXI.Sprite(mask);
        }

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(scale, scale);
        this.speed = speed;
        this.hitpoints = hitpoints;
        this.path = null;

        this.timeLastMovement = new Date();
    }

    get x() {
        return this.sprite ? this.sprite.x : null;
    }

    get y() {
        return this.sprite ? this.sprite.y : null;
    }

    die() {
        this.sprite.destroy();
        this.sprite = null;
    }

    reduceHitpoints(damageTaken) {
        console.log("unit got hit by tower", this, damageTaken);
        this.hitpoints -= damageTaken;

        if (this.hitpoints <= 0) {
            this.die();
        }
    }


    followPath(path) {
        this.path = path;
        // this.sprite.play();
    }

    get isVisible() {
        return this.sprite != null;
    }

    hasDied() {
        return !this.isVisisble;
    }

    updatePosition(dt) {
        const epsilon = 0.0001;

        if (!this.path || !(this.sprite != null)) {
            return;
        }

        if (this.path.length == 0) {
            console.log("destroying unit", this);
            this.die();
            return;
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
