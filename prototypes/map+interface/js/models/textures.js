"use strict";

class TextureLoader {
    constructor(files, onProgress) {
        for (var o of files) {
            console.log("adding", o, "to loader");
            if (o.name) {
                PIXI.loader.add(o.name, o.url);
            } else {
                PIXI.loader.add(o);
            }
        }

        if (onProgress) {
            PIXI.loader.on("progress", onProgress);
        }
    }

    onLoaded(fnc) {
        if (fnc) {
            PIXI.loader.load(fnc);
        }
    }
}