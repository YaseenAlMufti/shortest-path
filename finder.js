const Path = require('./classes/path');

const finder = (randPoints) => {
    if (randPoints) {
        const foundedPaths = [];
        for (let i = 0; i < randPoints.length; i += 1) {
            const pointZero = i === 0 
                ? randPoints[0] 
                : randPoints.find((point) => point.id === foundedPaths[foundedPaths.length - 1].p2.id);
            const otherPoints = [...randPoints].filter((point) => point !== pointZero);
            const paths = [];
            try {
                otherPoints.forEach((otherPoint) => {
                    const path = new Path(pointZero, otherPoint);
                    paths.push(path);
                });
                paths.sort((path1, path2) => path1.distance - path2.distance);
                // console.log(`point reached: ${i}`);
                if (foundedPaths.length === 0) {
                    foundedPaths.push(paths[0]);
                } else {
                    let foundedPath = undefined;
                    let currentPathIndex = 0;
                    while (!foundedPath) {
                        // console.log(currentPathIndex);
                        const pathZero = paths[currentPathIndex];
                        const isPathThere = foundedPaths.find((path) => (
                            pathZero.p2.id === path.p1.id
                        ));
                        if (isPathThere) {
                            currentPathIndex++;
                        } else if (foundedPaths.length >= 998) {
                            break;
                        } else {
                            foundedPaths.push(pathZero);
                            foundedPath = pathZero;
                        }
                    }
                }
                // console.log(`founded paths: ${foundedPaths.length}`);
            } catch (error) {
                console.log(error);
            }
    
        }
        return foundedPaths;
    }
};

module.exports = finder;