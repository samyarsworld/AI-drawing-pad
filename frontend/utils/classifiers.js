function classify(classifier, data, point, featureIndex) {
  switch (classifier) {
    case "KNN":
      return KNN(data, point, featureIndex);
  }
}

function KNN(data, point, featureIndex = [0, 1, 2, 3, 4]) {
  // Get all the points on the chart
  let points = data.map((d) => d.features);
  points = points.map((point) => {
    let newPoint = [];
    for (index of featureIndex) {
      newPoint.push(point[index]);
    }
    return newPoint;
  });
  // Get indices of the k nearest points on the chart to current point
  const indices = math.getNearest(point, points, (k = 50));
  const nearestDrawings = indices.map((ind) => data[ind]);
  const labels = nearestDrawings.map((d) => d.label);
  const counts = {};
  for (const label of labels) {
    counts[label] = counts[label] ? counts[label] + 1 : 1;
  }
  const max = Math.max(...Object.values(counts));
  const label = labels.find((l) => counts[l] == max);
  return label;
}
