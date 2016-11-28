"use strict";

function init(configurationFilename) {
    let cfg = new Config(configurationFilename);

    function loadTextures() {
        let onProgress = (loader, resource) => console.log("loading", resource.url, "(" + loader.progress + "%)");
        let textureLoader = new TextureLoader(cfg.textureFilenames, onProgress);
        textureLoader.onLoaded(startGame);
    }

    function startGame() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        console.log(PIXI.utils.TextureCache);

        let texturePack = PIXI.utils.TextureCache // {};

        // init renderer, appends canvas to document.body
        let rendererWrapper = new RendererWrapper(w, h, cfg.bgColor, cfg.tileSize, texturePack, (r) => { document.body.appendChild(r); });

        // import and render map
        Utils.getText(cfg.mapFilename).then((mapString) => {
            rendererWrapper.initMap(new TDMap(mapString))
            rendererWrapper.initUnits();
        });
    }

    cfg.onLoaded(() => {
        Utils.loadScripts(cfg.scripts, loadTextures);
    });
}
