"use strict";

var Utils = Utils || {};

Utils.get = function(url, responseType) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = responseType;
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                console.log("response", xhr.response);
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
};


Utils.getJSON = function(url) {
    return Utils.get(url, "json");
};

Utils.getText = function(url) {
    return Utils.get(url, "text");
};


Utils.loadScripts = function(array, callback) {
    var loader = function(src, handler) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function() {
            script.onreadystatechange = script.onload = null;
            handler();
        };
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild(script);
    };
    (function run() {
        if (array.length != 0) {
            loader(array.shift(), run);
        } else {
            callback && callback();
        }
    })();
}


Utils.distanceBetweenTwoPoints = function(x1, y1, x2, y2) {
    let xd = x1 - x2,
        yd = y1 - y2;

    return Math.sqrt(xd * xd + yd * yd);
}

Utils.interpolateCoordinates = function(x1, y1, x2, y2, d) {
    // calculates p3 (x/y) that lies on the straight p1|p2 with distance(p1, p3) = d
    let xd = x2 - x1,
        yd = y2 - y1;
    let len = Math.sqrt(xd * xd + yd * yd);

    return [x1 + (xd / len) * d, y1 + (yd / len) * d];
}



class Config {
    constructor(filename, onSuccess, onFail) {
        console.log("constructor of " + this.constructor.name, arguments, filename)

        if (!filename) {
            throw Error("A valid filename must be provided.");
        }

        this.filename = filename;
        this.config = {};

        var onMySuccess = (data) => {
            console.log(data);

            this.config = data;

            if (onSuccess) {
                onSuccess(data);
            }
        };

        var onMyFail = function(status) { //error detection....
            console.error(status);
            if (onFail) {
                onFail(status);
            }
        };

        this._promise = Utils.getJSON(filename).then(onMySuccess, onMyFail);
    }

    get bgColor() {
        return typeof this.config["bgColor"] !== "undefined" ? this.config["bgColor"] : 0x333333;
    }

    get mapFilename() {
        return this.config["mapFilename"] || "map.txt";
    }

    get tileSize() {
        return this.config["tileSize"] || 64;
    }

    get textureFilenames() {
        return this.config["textureFilenames"] || [];
    }

    get textureField() {
        return this.config["textureField"] || [];
    }

    get scripts() {
        return this.config["scripts"] || [];
    }

    get autoresize() {
        return this.config["autoresize"] || true;
    }

    onLoaded(fnc) {
        if (fnc) {
            this._promise.then(fnc);
        }
    }
}
