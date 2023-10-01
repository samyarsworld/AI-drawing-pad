// function classify(classifier, data, point, featureIndex) {
//   switch (classifier) {
//     case "KNN":
//       return KNN(data, point, featureIndex);
//   }
// }

// function KNN(data, point, featureIndex = [0, 1, 2, 3, 4]) {
//   // Get all the points on the chart
//   let points = data.map((d) => d.features);
//   points = points.map((point) => {
//     let newPoint = [];
//     for (index of featureIndex) {
//       newPoint.push(point[index]);
//     }
//     return newPoint;
//   });
//   // Get indices of the k nearest points on the chart to current point
//   const indices = math.getNearest(point, points, (k = 50));
//   const nearestDrawings = indices.map((ind) => data[ind]);
//   const labels = nearestDrawings.map((d) => d.label);
//   const counts = {};
//   for (const label of labels) {
//     counts[label] = counts[label] ? counts[label] + 1 : 1;
//   }
//   const max = Math.max(...Object.values(counts));
//   const label = labels.find((l) => counts[l] == max);
//   return label;
// }

class KNN {
  constructor(data, k = 50) {
    this.k = k;
    this.data = data;
  }
  predict(point, featureIndex = [0, 1, 2, 3, 4]) {
    // Get all the points on the chart
    let points = this.data.map((d) => d.features);
    points = points.map((point) => {
      let newPoint = [];
      for (index of featureIndex) {
        newPoint.push(point[index]);
      }
      return newPoint;
    });
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
    return label;
  }
}

class MLP {
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
    const label = LABELS[index];
    return label;
  }

  fit(data, tries = 1000) {
    let bestNetwork = this.network;
    let bestAccuracy = this.evaluate(data);
    for (let i = 0; i < tries; i++) {
      this.network = new NeuralNetwork(this.neuronCounts);
      const accuracy = this.evaluate(data);
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestNetwork = this.network;
      }
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
