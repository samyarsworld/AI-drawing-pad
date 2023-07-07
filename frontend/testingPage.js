const testDrawingsContainer = document.getElementById("testDrawingsContainer");
const decisionContainer = document.getElementById("decisionContainer");

const { testingFeatureNames, testingDrawingsMetaData } = testingSet;
const { trainingDrawingsMetaData, minMaxTraining } = trainingSet;

// Group drawings meta data using user_id
const sortedTrainingMetaData = groupBy(trainingDrawingsMetaData, "user_id");
const sortedTestingMetaData = groupBy(testingDrawingsMetaData, "user_id");

let correctCount = 0;
let totalCount = testingDrawingsMetaData.length;

for (let drawing of testingDrawingsMetaData) {
  const { label } = classify(
    classifier,
    trainingDrawingsMetaData,
    drawing.features
  );
  drawing.label = label;
  drawing.correct = drawing.label == drawing.realLabel;
  if (drawing.correct) {
    correctCount += 1;
  }
}

// Create rows of drawings of each user
for (const user_id in sortedTrainingMetaData) {
  const metaData = sortedTrainingMetaData[user_id];
  const user = metaData[0].user;
  createRow(testDrawingsContainer, user, metaData);
}

for (const user_id in sortedTestingMetaData) {
  const metaData = sortedTestingMetaData[user_id];
  const user = metaData[0].user;
  createRow(testDrawingsContainer, user, metaData);
}

const testingSub = document.getElementById("testing-subtitle");
testingSub.innerHTML = `Accuracy rate is ${(correctCount / totalCount) * 100}%`;

const decisionMatrix = new DecisionMatrix(
  decisionContainer,
  testingDrawingsMetaData
);
