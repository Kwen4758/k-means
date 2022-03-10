"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var classes_1 = require("./classes");
var readInputData = function (fileName) {
    var rawData = fs.readFileSync(fileName, 'utf8').split(/\s+/g);
    var formattedData = __spreadArray([], Array(rawData.length / 2), true).map(function (empty, index) {
        var convertedIndex = Math.floor(index * 2);
        var source = rawData.slice(convertedIndex, convertedIndex + 2);
        return new classes_1.Vector2(+source[0], +source[1]);
    });
    return formattedData;
};
var writeOutputData = function (fileName, centroids, numIterations) {
    var report = {
        'Number of Iterations': numIterations,
        Clusters: [],
    };
    var txt = '';
    centroids.forEach(function (centroid, index) {
        var myReport = {
            'Cluster Centroid': { x: centroid.x, y: centroid.y },
            'Cluster Settled?': centroid.settled,
            'Data Points': centroid.cluster,
        };
        report['Clusters'].push(myReport);
        centroid.cluster.forEach(function (datapoint) {
            txt += "".concat(datapoint.x, "\t\t").concat(datapoint.y, "\t\t").concat(index + 1, "\n");
        });
    });
    fs.writeFileSync("".concat(fileName, ".json"), JSON.stringify(report, null, '\t'));
    fs.writeFileSync("".concat(fileName, ".txt"), txt);
};
var getRandomCentroids = function (data, k) {
    var indexes = Array();
    while (indexes.length < k) {
        var i = Math.floor(Math.random() * data.length);
        if (!indexes.includes(i))
            indexes.push(i);
    }
    var centroids = indexes.map(function (i) { return new classes_1.Centroid(data[i]); });
    return centroids;
};
var assignDataToCentroids = function (data, centroids) {
    data.forEach(function (datapoint) {
        var closestCentroid = centroids[0];
        var shortestDistance = datapoint.distanceTo(closestCentroid);
        centroids.slice(1).forEach(function (centroid) {
            var myDistance = datapoint.distanceTo(centroid);
            if (myDistance < shortestDistance) {
                shortestDistance = myDistance;
                closestCentroid = centroid;
            }
        });
        closestCentroid.cluster.push(datapoint);
    });
    return centroids;
};
var getClusterMean = function (cluster) {
    var mean = new classes_1.Vector2();
    cluster.forEach(function (datapoint) {
        mean.add(datapoint);
    });
    mean.divideScalar(cluster.length);
    return mean;
};
var recalculateCentroids = function (data, centroids) {
    var numSame = 0;
    centroids.forEach(function (centroid) {
        if (centroid.cluster.length === 0) {
            centroid.copy(data[Math.floor(Math.random() * data.length)]);
        }
        else if (centroid.hasNotChanged()) {
            centroid.settled = true;
            numSame++;
        }
        else {
            centroid.copy(getClusterMean(centroid.cluster));
        }
    });
    return numSame;
};
var main = (function () {
    var _a, _b, _c, _d;
    var k = +((_a = process.argv[2]) !== null && _a !== void 0 ? _a : 1);
    var data = readInputData((_b = process.argv[3]) !== null && _b !== void 0 ? _b : 'input.txt');
    var centroids = getRandomCentroids(data, k);
    var maxIterations = +((_c = process.argv[5]) !== null && _c !== void 0 ? _c : 1000);
    var numSame = 0;
    var numIterations = 0;
    while (numSame < centroids.length && numIterations < maxIterations) {
        centroids.forEach(function (centroid) { return centroid.resetCluster(); });
        assignDataToCentroids(data, centroids);
        numSame = recalculateCentroids(data, centroids);
        numIterations++;
    }
    writeOutputData((_d = process.argv[4]) !== null && _d !== void 0 ? _d : 'output', centroids, numIterations);
})();
