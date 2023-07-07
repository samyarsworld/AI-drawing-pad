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
  bg: new Image(),
};

options.bg.src = "../data/dataset/decisionBoundary.png";

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
  const { label, nearestDrawings } = classify(
    classifier,
    drawingsMetaData,
    point
  );
  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";
  chart.showRealTimeDrawing(point, label, nearestDrawings);
}
