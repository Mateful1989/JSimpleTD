class GameController {
    constructor(texturePack, config, bindCanvasFnc) {
        this.config = config;
        this.stageRenderer = new StageRenderer(0, 0, this.config.autoresize, this.config.bgColor, this.config.tileSize, texturePack, bindCanvasFnc);
        this.map = null;

        // import and render map
        Utils.getText(config.mapFilename).then((mapString) => {
            this.map = new TDMap(mapString);
            this.stageRenderer.initMap(this.map);
            this.stageRenderer.initUnits(0);
            this.stageRenderer.initTowers();
            this.stageRenderer.initMenus(-1);
        });

        this.selectionMode = false;


        var onEscape = InputController.key(27);
        var onPressS = InputController.key('S'.charCodeAt(0));

        this.state = "game";
        this.tileSize = this.config.tileSize

        onEscape.release = (event) => {
            console.log(this, event);
            switch (this.state) {
                case "game":
                    this.stageRenderer.showMenu("main");
                    this.stageRenderer.pause();
                    this.state = "menu_main";
                    break;

                case "menu_main":
                    this.stageRenderer.hideMenu("main");
                    this.stageRenderer.unpause();
                    this.state = "game";
                    break;
            }
        }

        onPressS.release = (event) => {
            console.log(this, event);

            if (this.selectionMode) {
                this.leaveSelectionMode();
            } else {
                this.enterSelectionMode();
            }
        }

        this.stageRenderer.stage.on("mousemove", (event) => {
            if (!this.stageRenderer) {
                return;
            }

            let currTower = this.stageRenderer.towerRenderer.selection

            if (!this.selectionMode || !currTower) {
                return;
            }

            currTower.x = event.data.global.x - event.data.global.x % this.tileSize;
            currTower.y = event.data.global.y - event.data.global.y % this.tileSize;
        });

        this.stageRenderer.stage.on("mousedown", (event) => {
            console.log("mouse down on game.js", event);
            if (this.selectionMode) {
                console.log("build tower");
                this.stageRenderer.towerRenderer.addAndResetSelection();
                this.selectionMode = false;
                this.enterSelectionMode();
            }
        });

    }

    spawnUnit() {
        let unitHitpoints = 100;

        console.log("spawn");
        if (this.map) {
            let spawnPoints = this.map.getSpawnPoints(0);
            let destinationPoints = this.map.getDestinationPoints(0);

            if (spawnPoints.length == 0 || destinationPoints == 0) {
                alert("Need at least one spawn and destination point!");
                return;
            }

            for (var spawn of spawnPoints) {
                for (var goal of destinationPoints) {
                    let path = calculateShortestPath(this.map, spawn, goal, (x, y) => this.stageRenderer.isSquarePathable(x, y));

                    if (path && path.length > 0) {
                        console.log(path.length);
                        path = path.map((p) => [p.x * this.stageRenderer.tileSize, p.y * this.stageRenderer.tileSize]);
                        console.log(path);

                        let x = path[0][0],
                            y = path[0][1];

                        let texture = [this.stageRenderer.texturePack["monster#1"], this.stageRenderer.texturePack["monster#2"]];
                        // texture = texture[0];
                        // let mask = this.stageRenderer.texturePack["monster#1_mask"];
                        //let texture = this.stageRenderer.texturePack["monster#1"];

                        let unit = new Unit(x, y, this.stageRenderer.tileSize * 2, unitHitpoints, 1, texture);
                        unit.followPath(path);

                        this.stageRenderer.unitRenderer.addUnit(unit);
                    } else {
                        console.error("No valid path found!", spawn, goal);
                    }
                }
            }
        }
    }

    clearTowers() {
        console.log("clear towers");

        this.stageRenderer.towerRenderer.removeAll();
    }

    leaveSelectionMode() {
        this.selectionMode = false;
        this.stageRenderer.towerRenderer.selection = null;
        console.log("selection reset:", this.stageRenderer.towerRenderer.selection);
    }

    enterSelectionMode(x = -99, y = -99) {
        if (this.selectionMode) {
            return;
        }

        let attackDamage = 50,
            attackRange = 4 * this.tileSize,
            attackSpeed = 3,
            projectileSpeed = 10 * this.tileSize;

        let onAddProjectile = (p) => this.stageRenderer.towerRenderer.addProjectile(p);
        let onRemoveProjectile = (p) => this.stageRenderer.towerRenderer.removeProjectile(p);
        // constructor(x, y, size, attackRange, attackSpeed, attackDamage, projectileSpeed, texture, projectileTexture, onAddProjectile, onRemoveProjectile)
        this.stageRenderer.towerRenderer.selection = new Tower(x, y, this.tileSize, attackRange, attackSpeed, attackDamage, projectileSpeed, this.stageRenderer.texturePack["tower#1"], this.stageRenderer.texturePack["projectile#1"],
            onAddProjectile, onRemoveProjectile);
        this.selectionMode = true;
    }
}
