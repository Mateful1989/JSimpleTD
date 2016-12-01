class TowerRenderer {
    constructor() {
        this.container = new PIXI.DisplayObjectContainer(); //ParticleContainer();
        this.towers = [];
        this._selection = null;
    }

    addUnit(tower) {
        if (tower) {
            this.towers.push(tower);
            this.container.addChild(tower.sprite);
        }
    }

    set selection(tower) {
        if (tower) {
            this._selection = tower;
            //tower.sprite.anchor.set(0.5, 0.5);
            this.container.addChild(tower.sprite);
        }
    }

    get selection() {
        return this._selection;
    }
}


class Tower {
    constructor(x, y, size, texture) {
        this.size = size;
        this.texture = texture;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
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
}
