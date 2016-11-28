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

    updatePositions(dt, speed, boundaries) {
        // console.log("update positions");
        for (var u of this.units) {
            u.sprite.x += dt * u.sprite.vx;
            u.sprite.y += dt * u.sprite.vy;

            if (boundaries &&
                (u.sprite.x < boundaries.minX ||
                    u.sprite.x > boundaries.maxX ||
                    u.sprite.y < boundaries.minY ||
                    u.sprite.y > boundaries.maxY)) {
                u.randomizePosition(boundaries.minX, boundaries.maxX, boundaries.minY, boundaries.maxY, speed, speed);
            };

        }
    }
}

class Unit {
    constructor(x, y, vx, vy, scale, texture) {
        this.sprite = new PIXI.Sprite(texture);

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.vx = vx;
        this.sprite.vy = vy;
        this.sprite.scale.set(scale, scale);
    }

    randomizePosition(minX, maxX, minY, maxY, speedX, speedY) {
        this.sprite.x = Math.floor((Math.random() * (maxX - minX)) + minX);
        this.sprite.y = Math.floor((Math.random() * (maxY - minY)) + minY);
        this.sprite.vx = Math.random() > 0.5 ? speedX : -speedX;
        this.sprite.vy = Math.random() > 0.5 ? speedY : -speedY;
    }
}
