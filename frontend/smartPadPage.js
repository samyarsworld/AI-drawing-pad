// Page elements
const drawingsContainer = document.getElementById("drawingsContainer");
const chartContainer = document.getElementById("chartContainer");
const smartPadContainer = document.getElementById("smartPadContainer");

// Destruct data from dataset which stores meta data of all drawings, minMax for scale, and selected feature names
const { featureNames, drawingsMetaData, minMax } = dataset;

// Group drawings meta data using user_id
const sortedMetaData = groupBy(drawingsMetaData, "user_id");

// Create rows of drawings of each user
for (const user_id in sortedMetaData) {
  const metaData = sortedMetaData[user_id];
  const user = metaData[0].user;
  createRow(drawingsContainer, user, metaData);
}

// Create chart
graphics.generateImages(STYLES);

const options = {
  size: 400,
  axisLabels: featureNames,
  styles: STYLES,
  transparency: 0.7,
  icon: "image",
};
const chart = new Chart(
  chartContainer,
  drawingsMetaData,
  options,
  handleDrawingClick
);

// Create the smartPad
const smartPad = new Pad(smartPadContainer, (size = 400), drawingUpdate);

// Update chart while sketching on the smartPad
function drawingUpdate(drawing) {
  const activeFeatureFunctions = active.map((f) => f.function);
  const point = activeFeatureFunctions.map((f) => f(drawing));
  normalizedFeaturePoints([point], minMax);
  const { label, nearestDrawings } = classify(drawingsMetaData, point);
  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";
  chart.showRealTimeDrawing(point, label, nearestDrawings);
}

function classify(data, point) {
  // Get all the points on the chart
  const points = data.map((d) => d.features);
  // Get indices of the k nearest points on the chart to current point
  const indices = getNearest(point, points, (k = 10));
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
