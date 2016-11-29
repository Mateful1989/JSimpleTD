console.log("LOADING SEARCH.JS");

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    toString() {
        return String(this.x) + ";" + String(this.y);
    }

    static fromString(key) {
        var [x, y] = key.split(";").map((x) => parseInt(x));
        return new Point(x, y);
    };

    static fromArray(arr) {
        if (arr.length != 2) {
            throw new Error("Expect an array with 2 elements");
        }

        return new Point(arr[0], arr[1]);
    }
}

class Node {
    constructor(pos, score) {
        this.pos = pos;
        this.score = score || 0;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    toString() {
        return this.pos.toString();
    }
}

/*
@param map - Map object
@param start - start node
@param end - goal node
*/
function search(map, start, end) {
    console.log("searching", map, start, end);

    function heuristic(a, b) {
        //return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function getNeighbours(pos) {
        const directions = [
            [0, -1],
            [-1, 0],
            [1, 0],
            [0, 1]
        ]; // [[x_offset, y_offset], ...]

        let result = [];

        for (var dir of directions) {
            let x = pos.x + dir[0],
                y = pos.y + dir[1];

            if (map.isPathable(x, y)) {
                result.push(new Point(x, y));
            }
        }

        return result;
    };

    function insertNodeSorted(node, array) {
        let i = array.length - 1;

        while (i >= 0 && node.score < array[i].score) {
            i -= 1
        }

        array.splice(i + 1, 0, node);

        return array;
    }


    let frontier = [];
    frontier.push(new Node(start, 0));

    let cameFrom = {};
    let gCostSoFar = {};
    let isGoalReached = false;

    cameFrom[start.toString()] = null;
    gCostSoFar[start.toString()] = 0

    // function logFrontier(msg, x) {
    //     var frontierToText = (x) => {
    //         return x.map((x) => String(x.score) + ";" + x.toString()).join(", ");
    //     }

    //     console.log(msg, frontierToText(x));
    // }

    while (frontier.length > 0) {
        // logFrontier("pre shift", frontier);

        let current = frontier.shift();

        // logFrontier("post shift", frontier);

        // console.log("  >current pos", current.pos, "compare to", end);

        if (current.pos.equals(end)) {
            isGoalReached = true;
            break;
        }

        let neighbours = getNeighbours(current);

        // console.log("neighbours", neighbours);

        for (var next of neighbours) {
            let gCost = gCostSoFar[current] + 1;

            if (!(next.toString() in gCostSoFar) || gCost < gCostSoFar[next.toString()]) {
                gCostSoFar[next.toString()] = gCost;
                let hCost = heuristic(next, end);
                let fCost = gCost + hCost;
                frontier = insertNodeSorted(new Node(next, fCost), frontier);
                cameFrom[next.toString()] = current;
                // console.log("neighbour:", next, fCost);
            }
        }
        // console.log("after insertion:", frontier);
    }

    // console.log("Came from array", cameFrom);

    return [isGoalReached, cameFrom];
}

function reconstructPath(cameFrom, start, end) {
    let current = end;
    let path = [current];

    while (current && !(current.equals(start))) {
        current = cameFrom[current.toString()];
        path.push(current.pos ? current.pos : current);
    }
    path.reverse();
    return path
}

function calculateShortestPath(map, a, b) {
    if (!a || !b) {
        return [];
    }
    
    let startPoint = Point.fromArray(a),
        endPoint = Point.fromArray(b);

    let [isPathFound, cameFrom] = search(map, startPoint, endPoint);

    let path = [];

    if (isPathFound) {
        path = reconstructPath(cameFrom, startPoint, endPoint);
    }

    console.log("found path:", path);
    console.log(path.map((x) => x.toString()));

    return path;
}


function testSearch1() {
    Utils.getText("assets/maps/default.txt").then((mapString) => {
        var myMap = new TDMap(mapString);

        var starts = myMap.getSpawnPoints();
        var end = myMap.getDestinationPoints();

        let startPoint = Point.fromArray(starts[0]);
        let endPoint = Point.fromArray(end[0]);

        console.log(starts);
        console.log(end);

        var result = search(myMap, startPoint, endPoint);
        console.log("Search result", result);
        if (result[0]) {
            var path = reconstructPath(result[1], startPoint, endPoint);
            console.log(path);
            console.log(path.map((x) => x.toString()));
        }
    });
}

function testSearch2() {
    Utils.getText("assets/maps/test1.txt").then((mapString) => {
        var myMap = new TDMap(mapString);

        var starts = myMap.getSpawnPoints();
        var end = myMap.getDestinationPoints();

        let startPoint = Point.fromArray(starts[0]);
        let endPoint = Point.fromArray(end[0]);

        console.log(starts);
        console.log(end);

        var result = search(myMap, startPoint, endPoint);
        console.log("Search result", result);
        if (result[0]) {
            var path = reconstructPath(result[1], startPoint, endPoint);
            console.log(path);
            console.log(path.map((x) => x.toString()));
        }
    });
}

function testSearch3() {
    Utils.getText("assets/maps/test2.txt").then((mapString) => {
        var myMap = new TDMap(mapString);

        var starts = myMap.getSpawnPoints();
        var end = myMap.getDestinationPoints();

        let startPoint = Point.fromArray(starts[0]);
        let endPoint = Point.fromArray(end[0]);

        console.log(starts);
        console.log(end);

        var result = search(myMap, startPoint, endPoint);
        console.log("Search result", result);
        if (result[0]) {
            var path = reconstructPath(result[1], startPoint, endPoint);
            console.log(path);
            console.log(path.map((x) => x.toString()));
        }
    });
}
