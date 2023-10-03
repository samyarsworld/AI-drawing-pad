import math from "./math.js";
import NeuralNetwork from "./network.js";
import constants from "./constants.js";

// function classify(classifier, data, point) {
//   switch (classifier) {
//     case "KNN":
//       return KNN(data, point);
//   }
// }

export class KNN {
  constructor(data, k = 50) {
    this.k = k;
    this.data = data;
  }
  predict(point) {
    // Get all the points on the chart
    const points = this.data.map((d) => d.features);
    // Get indices of the k nearest points on the chart to current point
    const indices = math.getNearest(point, points, this.k);
    const nearestDrawings = indices.map((ind) => this.data[ind]);
    const labels = nearestDrawings.map((d) => d.label);
    const counts = {};
    for (const label of labels) {
      counts[label] = counts[label] ? counts[label] + 1 : 1;
    }
    const max = Math.max(...Object.values(counts));
    const label = labels.find((l) => counts[l] == max);
    return { label, nearestDrawings };
  }
}

export class MLP {
  constructor(neuronCounts) {
    this.neuronCounts = neuronCounts;
    this.network = new NeuralNetwork(neuronCounts);
  }

  load(mLP) {
    this.neuronCounts = mLP.neuronCounts;
    this.network = mLP.network;
  }

  predict(point) {
    const output = NeuralNetwork.feedForward(point, this.network);
    const max = Math.max(...output);
    const index = output.indexOf(max);
    const label = constants.CLASSES[index];
    return { label };
  }

  fit(data, tries = 1000) {
    let bestNetwork = this.network;
    let bestAccuracy = this.evaluate(data);
    let id = 0;
    for (let i = 0; i < tries; i++) {
      this.network = new NeuralNetwork(this.neuronCounts);
      const accuracy = this.evaluate(data);
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestNetwork = this.network;
      }
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(id + "/" + tries);
      id += 1;
    }
    this.network = bestNetwork;
  }

  evaluate(data) {
    let correctCount = 0;
    for (const sample of data) {
      const { label } = this.predict(sample.features);
      correctCount += sample.label == label ? 1 : 0;
    }

    // return the accuracy
    return correctCount / data.length;
  }
}

// export default classify;
