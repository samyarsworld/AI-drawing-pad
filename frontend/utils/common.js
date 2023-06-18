// Used to group drawings by the user
function groupBy(dataset, key) {
  const sortedDataset = [];
  for (const data of dataset) {
    const value = data[key];
    if (!sortedDataset[value]) {
      sortedDataset[value] = [];
    }
    sortedDataset[value].push(data);
  }
  return sortedDataset;
}

// Used to calculate distance between two points on the chart
function distance(point1, point2) {
  return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

// Used to calculate the k nearest points to the new point on the chart
function getNearest(newPointLoc, points, k = 1) {
  const obj = points.map((val, ind) => {
    return { ind, val };
  });
  const sorted = obj.sort((l, r) => {
    return distance(newPointLoc, l.val) - distance(newPointLoc, r.val);
  });
  const indices = sorted.map((obj) => obj.ind);
  return indices.slice(0, k);
}
