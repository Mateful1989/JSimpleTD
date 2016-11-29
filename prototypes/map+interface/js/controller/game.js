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

                        let texture = this.stageRenderer.texturePack["monster#1"];
                        let unit = new Unit(x, y, this.stageRenderer.tileSize * 5, 1, texture);
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
