const { isMainThread } = require('worker_threads');

if (isMainThread) {
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
    const { Worker } = require('worker_threads');
    const fs = require('fs');
    const Point = require('./classes/point');
    const { performance } = require('perf_hooks');
    const { nameGenerator } = require('./helpers/generators');
    const cpus = require('os').cpus().length;

    const pool = [];
    const queue = [];
    let queueIndex = 0;
    const startingPoints = [];
    const randPoints = [];
    const t0 = performance.now();
    for (let i = 0; i < 1000; i += 1) {
        randPoints.push(new Point());
    }
    for (let i = 0; i < 1000; i += 1) {
        const newRandPoints = randPoints.map((it) => it);
        newRandPoints.unshift(newRandPoints.pop());
        queue.push([newRandPoints, nameGenerator(5)]);
    }

    const newWorker = () => {
        if (queue.length) {
            queueIndex++;
            const worker = new Worker(__filename, {
                workerData: queue.pop()
            });
            pool.push(worker);
            worker.on('message', (message) => {
                // console.log('Worker finished!');
                console.clear();
                console.log(`Progress: ${((1000 - queue.length) / 1000 * 100).toFixed(2)}%`);
                startingPoints.push(message);
            });
            worker.on('exit', () => {
                // console.log('worker died');
                pool.splice(pool.indexOf(worker), 1);
                if (queue.length && pool.length <= cpus) {
                    newWorker();
                } else if (pool.length === 0) {
                    console.log('Calculating and drawing best path...');
                    startingPoints.sort((p1, p2) => p1[1] - p2[1]);
                    const bestStartingPoint = startingPoints[0];
                    const bestStartingPointIndex = randPoints.indexOf(bestStartingPoint[0]);
                    console.log(`Best startingPointIndex: ${bestStartingPointIndex}`);
                    console.log(`X: ${bestStartingPoint[0].x} | Y: ${bestStartingPoint[0].y}`);
                    console.log(`Best Starting Point Total Distance: ${bestStartingPoint[1]}`);
                    randPoints.unshift(randPoints.splice(bestStartingPointIndex, 1)[0]);
                    
                    const bestPaths = require('./finder')(randPoints);
                    
                    const width = 5000; // px
                    const height = 5000; // px
                    const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
                    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
        
                    const configuration = {
                        type: 'scatter',   // for line chart
                        data: {
                            datasets: 
                            bestPaths.map((path) => {
                                return {
                                    label: path.pathId,
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    pointBackgroundColor: ['#000', '#00bcd6', '#d300d6'],
                                    pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
                                    pointRadius: 5,
                                    pointHoverRadius: 5,
                                    pointHoverRadius: 5,
                                    fill: false,
                                    tension: 0,
                                    showLine: true,
                                    ...path.getDataSetObj(),
        
                                }
                            })
                        },
                        options: {
                            legend: false,
                            tooltips: false,
                            scales: {
                                scales: {
                                    x: {
                                        suggestedMin: 0
                                    },
                                    y: {
                                        suggestedMin: 0,
                                    }
                                }
                            }
                        }
                    };
        
                    const run = async () => {
                        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
                        const base64Image = dataUrl
        
                        var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
        
        
                        fs.writeFile("out.png", base64Data, 'base64', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        fs.writeFile("outData.json", JSON.stringify(randPoints), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                        const t1 = performance.now();
                        console.log('Done!');
                        console.log(`Whole job took: ${((t1 - t0) / 1000 / 60).toFixed(2)} minutes!`);
                        return dataUrl
                    }
                    run();
                }
            });
        }
    };
    for (let i = 0; i < cpus; i++) {
        newWorker();
    }
} else {
    // console.log(`Worker ${process.pid} started!`);
    const {
        parentPort,
        workerData
    } = require('worker_threads');
    const { calculateTotalDistance } = require('./helpers/calculationFns');
    const newRandPoints = workerData;
    const foundedPaths = require('./finder')(newRandPoints[0]);
    const totalDistance = calculateTotalDistance(foundedPaths);
    const bestStartingPointAndDistance = [newRandPoints[0][0], totalDistance];
    parentPort.postMessage(bestStartingPointAndDistance);
    process.exit();
}
