function drawRectangle(x, y, w, h, strokeWidth, strokeColor, fillColor) {
    var graphics = new PIXI.Graphics();

    graphics.beginFill(fillColor);
    graphics.lineStyle(strokeWidth, strokeColor);
    graphics.drawRect(x, y, w, h);


    return graphics;
}

class Menu {
    constructor(x, y, w, h, id, name) {
        console.log("Constructing new menu:", x, y, w, h, id, name);

        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this._container = new PIXI.DisplayObjectContainer();
        this._container.interactive = true;

        var title = new PIXI.Text(name, { font: "32px sans-serif", fill: "black" });
        title.position.set(this.x + 5, this.y + 5);
        title.interactive = true;

        title.on("click", function(event) {
            console.log("onclick", event);
            alert("You clicked the heading!");
        });

        this._container.addChild(drawRectangle(this.x, this.y, this.w, this.h, 2, 0xFF00FF, 0xFFFF00));
        this._container.addChild(title);
    }

    get container() {
        return this._container;
    }
}
