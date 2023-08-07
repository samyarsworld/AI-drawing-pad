// Page elements
const drawingsContainer = document.getElementById("drawingsContainer");
const chartContainer = document.getElementById("chartContainer");
const smartPadContainer = document.getElementById("smartPadContainer");
const confusionContainer = document.getElementById("confusionContainer");

// Destruct data from dataset, sorted testing set and sorted training set
const { featureNames, drawingsMetaData, minMax } = dataset;
const { sortedTestingMetaData, testingDrawingsMetaData, accuracy } = testingSet;
const { sortedTrainingMetaData } = trainingSet;

// Create chart
graphics.generateImages(STYLES);
const options = {
  size: 500,
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

// Create rows of drawings of each user
for (const user_id in sortedTestingMetaData) {
  const user = sortedTestingMetaData[user_id][0].user;
  createRow(drawingsContainer, user, sortedTestingMetaData[user_id]);
}
for (const user_id in sortedTrainingMetaData) {
  const user = sortedTrainingMetaData[user_id][0].user;
  createRow(drawingsContainer, user, sortedTrainingMetaData[user_id]);
}

// Create the SmartPad
const smartPad = new Pad(smartPadContainer, (size = 400), drawingUpdate);

// Update chart while sketching on the smartPad
function drawingUpdate(drawing) {
  const activeFeatureFunctions = active.map((f) => f.function);
  const drawingFeatures = activeFeatureFunctions.map((f) => f(drawing));
  normalizeFeatures(drawingFeatures, minMax);

  const { label, nearestDrawings } = classify(
    classifier,
    drawingsMetaData,
    drawingFeatures
  );

  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";
  return;

  chart.showRealTimeDrawing(drawingFeatures, label, nearestDrawings);
}

// Testing page
// Add accuracy info to the webpage
const testingSub = document.getElementById("testing-subtitle");
testingSub.innerHTML = `Accuracy rate is ${accuracy}%`;

// Display confusion matrix
const confusionMatrix = new ConfusionMatrix(
  confusionContainer,
  testingDrawingsMetaData
);
