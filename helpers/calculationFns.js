exports.getDistance = (p1, p2) => {
    const x1 = p1.x;
    const x2 = p2.x;
    const y1 = p1.y;
    const y2 = p2.y;

    const xs = (x2 - x1)**2;
    const ys = (y2 - y1)**2;
	return +Math.sqrt(xs + ys).toFixed(4);
};

exports.calculateTotalDistance = (paths) => {
    let totalDistance = 0;
    paths.forEach((path) => totalDistance += path.distance);
    return totalDistance;
};
