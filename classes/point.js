const { nameGenerator } = require('../helpers/generators');

class Point {
    x;
    y;
    id;
    constructor() {
        this.x = +((Math.random() + 1) * 100).toFixed(4);
        this.y = +((Math.random() + 1) * 100).toFixed(4);
        this.id = nameGenerator(8);
    }

    getPointObj() {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    }
};

module.exports = Point;
