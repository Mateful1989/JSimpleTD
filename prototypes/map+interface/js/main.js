"use strict";

window.GameController = {};

function init(configurationFilename) {
    let cfg = new Config(configurationFilename);

    function loadTextures() {
        let onProgress = (loader, resource) => console.log("loading", resource.url, "(" + loader.progress + "%)");
        let textureLoader = new TextureLoader(cfg.textureFilenames, onProgress);
        textureLoader.onLoaded(startGame);
    }

    function startGame() {
        // const w = window.innerWidth;
        // const h = window.innerHeight;

        console.log(PIXI.utils.TextureCache);

        let texturePack = PIXI.utils.TextureCache // {};

        window.GameController = new GameController(texturePack, cfg, (r) => { document.body.appendChild(r); });
    }

    cfg.onLoaded(() => {
        Utils.loadScripts(cfg.scripts, loadTextures);
    });


    document.getElementById("btn-spawn").addEventListener("click", function(event) {
        window.GameController.spawnUnit();
    });

    document.getElementById("btn-clear-towers").addEventListener("click", function(event) {
        window.GameController.clearTowers();
    });

    document.getElementById("btn-select-tower").addEventListener("click", function(event) {
        window.GameController.enterSelectionMode();
    });

    document.getElementById("btn-unselect-tower").addEventListener("click", function(event) {
        window.GameController.leaveSelectionMode();
    });
}
