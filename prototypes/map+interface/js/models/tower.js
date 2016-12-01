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

    set selection(tower) {
        if (tower) {
            this._selection = tower;
            //tower.sprite.anchor.set(0.5, 0.5);
            this.container.addChild(tower.sprite);
        } else {
        	if (this._selection) {
        		this._selection.sprite.destroy();
        	}
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
    		t.sprite.destroy();
    	}

    	this.towers = [];
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
