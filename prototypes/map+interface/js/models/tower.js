class TowerRenderer {
    constructor() {
        this.container = new PIXI.DisplayObjectContainer(); //ParticleContainer();
        this.towers = [];
        this._selection = null;
    }

    addTower(tower) {
        console.log("add tower", tower);
        if (tower) {
            this.towers.push(tower);
            this.container.addChild(tower.sprite);
        }
    }

    addProjectile(projectile) {
        this.container.addChild(projectile.sprite);
    }

    removeProjectile(projectile) {
        this.container.removeChild(projectile.sprite);
    }

    set selection(tower) {
        if (tower) {
            this._selection = tower;
            //tower.sprite.anchor.set(0.5, 0.5);
            this.container.addChild(tower.sprite);
        } else {
            if (this._selection) {
                this._selection.sprite.destroy();
            }
            this._selection = null;
        }
    }

    get selection() {
        return this._selection;
    }

    addAndResetSelection() {
        if (this.selection) {
            console.log("add and reset selection");
            this.towers.push(this.selection);
            this._selection = null;
        }
    }

    removeAll() {
        console.log("removeAll");
        for (var t of this.towers) {
            t.kill();
        }

        this.towers = [];
    }


    update(dt, targets) {
        for (let t of this.towers) {
            t.update(dt, targets);
        }
    }
}


class Tower {
    constructor(x, y, size, attackRange, attackSpeed, attackDamage, projectileSpeed, texture, projectileTexture, onAddProjectile, onRemoveProjectile) {
        this.size = size;
        this.texture = texture;
        this.projectileTexture = projectileTexture;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;


        this.attackRange = attackRange;
        this.attackSpeed = attackSpeed;
        this.projectileSpeed = projectileSpeed;
        this.attackDamage = attackDamage;

        this.projectiles = [];
        this.currentTarget = null;
        this.timeOflastShot = null;


        this.onAddProjectile = onAddProjectile;
        this.onRemoveProjectile = onRemoveProjectile;
    }

    kill() {
        this.sprite.destroy();
        this.sprite = null;

        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].kill();
        }

        this.projectiles = [];
    }

    get x() {
        return this.sprite.x;
    }

    get y() {
        return this.sprite.y;
    }

    set x(x) {
        this.sprite.x = x;
    }

    set y(y) {
        this.sprite.y = y;
    }

    changeCurrentTarget(targets) {
        // console.log("choose target");

        // if tower has current target and current target is in range => leave
        if (this.currentTarget && this.currentTarget.isVisible &&
            Utils.distanceBetweenTwoPoints(this.x, this.y, this.currentTarget.x, this.currentTarget.y) <= this.attackRange) {
            return this.currentTarget;
        }

        // check for every target if in range and select nearest one
        let minDistance = Infinity,
            nearestTarget = null;

        if (targets) {
            for (let t of targets) {

                let d = Utils.distanceBetweenTwoPoints(this.x, this.y, t.x, t.y);

                // console.log("set nearest target to ", d, minDistance, this.attackRange);

                if (d <= this.attackRange && d < minDistance) {

                    minDistance = d;
                    nearestTarget = t;
                }
            }
        }

        // set current Target
        this.currentTarget = nearestTarget;

        // console.log("target =", this.currentTarget);

        // returns a valid target or null (if no valid target could be found)
        return nearestTarget;
    }

    addProjectile(projectile) {
        // console.log("add projectile");
        this.projectiles.push(projectile);
        this.onAddProjectile(projectile);
    }

    // removeProjectile(projectile) {
    //     console.log("remove projectile");
    //     this.projectiles.push(projectile);
    //     this.onAddProjectile(projectile);
    // }

    fireProjectilesIfNecessary(dt, targets) {
        var currentTime = new Date();
        var timeSinceLastShot = this.timeOflastShot ? currentTime - this.timeOflastShot : 0;

        // if it is time to shoot again (first shot OR time since last shot > 1/attack speed)
        if (!this.timeOflastShot || timeSinceLastShot > 1000.0 / this.attackSpeed) {
            // select target if it is in range
            let t = this.changeCurrentTarget(targets);
            if (t) {
                let projectile = new Projectile(this, t, this.projectileSpeed, this.attackDamage, this.projectileTexture);
                this.addProjectile(projectile);
            }

            // set time of last shot
            this.timeOflastShot = currentTime;
        }
    }

    updateProjectiles(dt) {
        // console.log("update projectiles");
        if (this.projectiles) {
            // update all current projectiles
            for (let p of this.projectiles) {
                p.updatePosition(dt);
            }

            this.projectiles = this.projectiles.filter((p) => p.isVisible);
        }
    }

    update(dt, targets) {
        // console.log("update", dt, targets);
        // if projectiles exist:
        this.updateProjectiles(dt);

        // TODO: if target has been destroyed set current target = null

        // if current target exists and it is in range, fire projectiles
        this.fireProjectilesIfNecessary(dt, targets);
    }
}

class Projectile {
    constructor(tower, target, speed, damage, texture) {
        this.tower = tower;
        this.target = target;

        this.speed = speed;
        this.damage = damage;

        this.texture = texture;
        this.sprite = new PIXI.Sprite(texture);

        this.x = tower.x;
        this.y = tower.y;

    }

    kill() {
        this.sprite.destroy();
        this.sprite = null;
    }

    updatePosition(dt) {
        // console.log("updating coordinates of projectile", this);
        if (!this.target || !this.target.isVisible) {
            // console.log("detroy texture");
            this.kill();
            return;
        }

        let distanceThisTimeFrame = dt * this.speed;
        let distanceToTarget = Utils.distanceBetweenTwoPoints(this.x, this.y, this.target.x, this.target.y);

        if (distanceThisTimeFrame > distanceToTarget) {
            // console.log("detroy texture");
            this.target.reduceHitpoints(this.damage);
            this.kill();
        } else {
            // console.log("update coordinates");
            let [xNew, yNew] = Utils.interpolateCoordinates(this.x, this.y, this.target.x, this.target.y, distanceThisTimeFrame);
            this.x = xNew;
            this.y = yNew;
        }

    }

    get isVisible() {
        return this.sprite != null;
    }

    get x() {
        return this.sprite.x;
    }

    set x(v) {
        this.sprite.x = v;
    }

    get y() {
        return this.sprite.y
    }

    set y(v) {
        this.sprite.y = v;
    }

}
