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


        var onEscape = InputController.key(27);

        this.state = "game";

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

        this.stageRenderer.stage.on("mousemove", (event) => {
            // console.log("mouse moved", event);
            if (!this.stageRenderer.towerRenderer.selection) {
                this.stageRenderer.towerRenderer.selection = new Tower(0, 0, this.tileSize, texturePack["tower#1"]);
            }

            let currTower = this.stageRenderer.towerRenderer.selection 
            currTower.x = event.data.global.x - event.data.global.x % this.config.tileSize;
            currTower.y = event.data.global.y - event.data.global.y % this.config.tileSize;
        });

    }

    spawnUnit() {
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
                    let path = calculateShortestPath(this.map, spawn, goal);

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
                        let unit = new Unit(x, y, this.stageRenderer.tileSize * 2, 1, texture);
                        unit.followPath(path);

                        this.stageRenderer.unitRenderer.addUnit(unit);
                    } else {
                        console.error("No valid path found!", spawn, goal);
                    }
                }
            }


        }
    }
}
