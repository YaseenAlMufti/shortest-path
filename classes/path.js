const { nameGenerator } = require('../helpers/generators');
const { getDistance } = require('../helpers/calculationFns');

class Path {
    p1;
    p2;
    distance;
    pathId;
    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = getDistance(p1, p2);
        this.pathId = nameGenerator(5);
    }

    getDataSetObj() {
        return {
            data: [
                {...this.p1.getPointObj()},
                {...this.p2.getPointObj()},
                {...this.p1.getPointObj()}
            ]
        };
    }
}

module.exports = Path;
