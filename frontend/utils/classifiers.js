function classify(classifier, data, point) {
  switch (classifier) {
    case "KNN":
      return KNN(data, point);
  }
}

function KNN(data, point) {
  // Get all the points on the chart
  const points = data.map((d) => d.features);
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
  return { label, nearestDrawings };
}
