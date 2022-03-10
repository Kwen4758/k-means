import fs = require('fs');
import { createCanvas } from 'canvas';
import { Centroid, Vector2 } from './classes';

const readInputData = (fileName: string) => {
  const rawData = fs.readFileSync(fileName, 'utf8').split(/\s+/g);
  const formattedData = [...Array(rawData.length / 2)].map((empty, index) => {
    const convertedIndex = Math.floor(index * 2);
    const source = rawData.slice(convertedIndex, convertedIndex + 2);
    return new Vector2(+source[0], +source[1]);
  });
  return formattedData;
};

const writeOutputData = (fileName: string, centroids: Centroid[]) => {
  let txt = '';
  centroids.forEach((centroid, index) => {
    centroid.cluster.forEach((datapoint) => {
      txt += `${datapoint.x}\t\t${datapoint.y}\t\t${index + 1}\n`;
    });
  });
  fs.writeFileSync(`${fileName}`, txt);
};

const drawOutputData = (centroids: Centroid[], fileName: string) => {
  const canvas = createCanvas(1000, 1000, 'svg');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 1000, 1000);
  const colors = [
    'red',
    'green',
    'blue',
    'black',
    'pink',
    'yellow',
    'purple',
    'orange',
  ];
  centroids.forEach((centroid, i) => {
    ctx.fillStyle = colors[i];
    centroid.cluster.forEach((datapoint) => {
      ctx.beginPath();
      ctx.arc(datapoint.x, datapoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  });
  fs.writeFileSync(fileName, canvas.toBuffer());
};

const getRandomCentroids = (data: Vector2[], k: number) => {
  const indexes = Array<number>();
  while (indexes.length < k) {
    const i = Math.floor(Math.random() * data.length);
    if (!indexes.includes(i)) indexes.push(i);
  }
  const centroids = indexes.map((i) => new Centroid(data[i]));
  return centroids;
};

const assignDataToCentroids = (data: Vector2[], centroids: Centroid[]) => {
  data.forEach((datapoint) => {
    let closestCentroid = centroids[0];
    let shortestDistance = datapoint.distanceTo(closestCentroid);
    centroids.slice(1).forEach((centroid) => {
      const myDistance = datapoint.distanceTo(centroid);
      if (myDistance < shortestDistance) {
        shortestDistance = myDistance;
        closestCentroid = centroid;
      }
    });
    closestCentroid.cluster.push(datapoint);
  });
  return centroids;
};

const getClusterMean = (cluster: Vector2[]) => {
  const mean = new Vector2();
  cluster.forEach((datapoint) => {
    mean.add(datapoint);
  });
  mean.divideScalar(cluster.length);
  return mean;
};

const recalculateCentroids = (data: Vector2[], centroids: Centroid[]) => {
  let numSame = 0;
  centroids.forEach((centroid) => {
    if (centroid.cluster.length === 0) {
      centroid.copy(data[Math.floor(Math.random() * data.length)]);
    } else if (centroid.hasNotChanged()) {
      centroid.settled = true;
      numSame++;
    } else {
      centroid.copy(getClusterMean(centroid.cluster));
    }
  });
  return numSame;
};

const main = (() => {
  const k = +(process.argv[2] ?? 1);
  const inputFileName = process.argv[3] ?? 'input.txt';
  const outputFilePrefix =
    process.argv[4]?.split('.')[0] ?? `${inputFileName.split('.')[0]}_output`;
  const data = readInputData(inputFileName);
  const centroids = getRandomCentroids(data, k);
  const maxIterations = +(process.argv[5] ?? 1000);
  let numSame = 0;
  let numIterations = 0;
  while (numSame < centroids.length && numIterations < maxIterations) {
    centroids.forEach((centroid) => centroid.resetCluster());
    assignDataToCentroids(data, centroids);
    numSame = recalculateCentroids(data, centroids);
    numIterations++;
  }
  writeOutputData(outputFilePrefix + '.txt', centroids);
  if (k < 9) drawOutputData(centroids, outputFilePrefix + '.svg');
})();
