//// Page elements
const drawingsContainer = document.getElementById("drawingsContainer");
const chartContainer = document.getElementById("chartContainer");
const smartPadContainer = document.getElementById("smartPadContainer");
const confusionContainer = document.getElementById("confusionContainer");
const changeFeatures = document.getElementById("change-features");
const networkCanvas = document.getElementById("networkCanvas");

//// UI elements
let f2 = false;
changeFeatures.onclick = () => {
  changeFeatures.innerHTML = f2
    ? "Switch to width and height (2D)"
    : "Switch to all 5 features (5D)";
  if (f2) {
    featureFunctions[2].active = true;
    featureFunctions[3].active = true;
    featureFunctions[4].active = true;
    activeIndex = [0, 1, 2, 3, 4];
  } else {
    featureFunctions[2].active = false;
    featureFunctions[3].active = false;
    featureFunctions[4].active = false;
    activeIndex = [0, 1];
  }
  f2 = !f2;
};

//// Data and ML elements

// Destruct data from dataset, sorted testing set and sorted training set
const { featureNames, drawingSamples, minMax } = dataset;
const { sortedTestingSamples, testingSamples, accuracy } = testingSet;
const { sortedTrainingSamples } = trainingSet;

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
options.bg.src = "./static/images/decisionBoundary.png";
const chart = new Chart(
  chartContainer,
  drawingSamples,
  options,
  handleDrawingClick
);

// Create rows of drawings of each user
for (const user_id in sortedTestingSamples) {
  const user = sortedTestingSamples[user_id][0].user;
  createRow(drawingsContainer, user, sortedTestingSamples[user_id]);
}
for (const user_id in sortedTrainingSamples) {
  const user = sortedTrainingSamples[user_id][0].user;
  createRow(drawingsContainer, user, sortedTrainingSamples[user_id]);
}

// Create the SmartPad
const smartPad = new Pad(smartPadContainer, (size = 400), drawingUpdate);

// Create the classification model
// const kNN = new KNN(drawingSamples);

const mLP = new MLP([]);
mLP.load(model);

networkCanvas.width = 500;
networkCanvas.height = 500;
const networkCtx = networkCanvas.getContext("2d");

// Display neural network
const outputLabels = Object.values(STYLES).map((s) => s.image);
Visualizer.drawNetwork(networkCtx, mLP.network, outputLabels);

// Update chart while sketching on the smartPad
function drawingUpdate(drawing) {
  let activeFeatureFunctions = getActiveFeatureFunctions();
  const drawingFeatures = activeFeatureFunctions.map((f) => f(drawing));
  normalizeFeatures(drawingFeatures, minMax);

  // const label = kNN.predict(drawingFeatures, activeIndex);
  const label = mLP.predict(drawingFeatures);

  Visualizer.drawNetwork(networkCtx, mLP.network, outputLabels);
  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";

  // Update real time drawing location on the distribution chart (meaningless on the 3D+ feature charts)
  // chart.showRealTimeDrawing(drawingFeatures, label, nearestDrawings);
}

// Testing page
// Add accuracy info to the webpage
const testingSub = document.getElementById("testing-subtitle");
testingSub.innerHTML = `Accuracy rate is ${accuracy}%`;

// Display confusion matrix
const confusionMatrix = new ConfusionMatrix(confusionContainer, testingSamples);
