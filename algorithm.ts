import fs = require('fs');
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

const writeOutputData = (
  fileName: string,
  centroids: Centroid[],
  numIterations: number
) => {
  const report = {
    'Number of Iterations': numIterations,
    Clusters: [],
  };
  let txt = '';
  centroids.forEach((centroid, index) => {
    const myReport = {
      'Cluster Centroid': { x: centroid.x, y: centroid.y },
      'Cluster Settled?': centroid.settled,
      'Data Points': centroid.cluster,
    };
    report['Clusters'].push(myReport);
    centroid.cluster.forEach((datapoint) => {
      txt += `${datapoint.x}\t\t${datapoint.y}\t\t${index + 1}\n`;
    });
  });
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(report, null, '\t'));
  fs.writeFileSync(`${fileName}.txt`, txt);
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
  const data = readInputData(process.argv[3] ?? 'input.txt');
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
  writeOutputData(process.argv[4] ?? 'output', centroids, numIterations);
})();
