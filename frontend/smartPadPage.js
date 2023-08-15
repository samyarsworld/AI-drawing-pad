//// Page elements
const drawingsContainer = document.getElementById("drawingsContainer");
const chartContainer = document.getElementById("chartContainer");
const smartPadContainer = document.getElementById("smartPadContainer");
const confusionContainer = document.getElementById("confusionContainer");
const changeFeatures = document.getElementById("change-features");

//// UI elements
let f2 = false;
changeFeatures.onclick = () => {
  const query = `
    query {
      drawings {
        label
        features
      }
    }
  `;
  const ADD_DRAWINGS = `
    mutation {
      addUserDrawings(user: "hello",
      user_id: "3123123",
      userDrawings: {"bicycle": [[[1,2]]], "car": [[[2,3]]], "clock":[[[3, 4]]], "fish":[[[5, 6]]], "guitar":[[[7, 8]]], "house":[[[1,2]]], "pencil":[[[3, 4]]], "tree":[[[5, 6]]]}
      )
    }
  `;

  fetch("http://localhost:8000/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ADD_DRAWINGS,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data.data))
    .catch((error) => {
      console.error("Fetch error:", error);
    });
  // changeFeatures.innerHTML = f2
  //   ? "Switch to width and height (2D)"
  //   : "Switch to all 5 features (5D)";
  // if (f2) {
  //   featureFunctions[2].active = true;
  //   featureFunctions[3].active = true;
  //   featureFunctions[4].active = true;
  //   activeIndex = [0, 1, 2, 3, 4];
  // } else {
  //   featureFunctions[2].active = false;
  //   featureFunctions[3].active = false;
  //   featureFunctions[4].active = false;
  //   activeIndex = [0, 1];
  // }
  // f2 = !f2;
};

//// Data and ML elements

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
options.bg.src = "./static/images/decisionBoundary.png";
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
  let activeFeatureFunctions = getActiveFeatureFunctions();
  const drawingFeatures = activeFeatureFunctions.map((f) => f(drawing));
  normalizeFeatures(drawingFeatures, minMax);

  const label = classify(
    classifier,
    drawingsMetaData,
    drawingFeatures,
    activeIndex
  );

  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";

  // Update real time drawing location on the distribution chart (meaningless on the 3D+ feature charts)
  // chart.showRealTimeDrawing(drawingFeatures, label, nearestDrawings);
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
