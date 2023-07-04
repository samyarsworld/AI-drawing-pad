const testDrawingsContainer = document.getElementById("testDrawingsContainer");

const { testingFeatureNames, testingDrawingsMetaData } = testingSet;
const { trainingDrawingsMetaData, minMaxTraining } = trainingSet;

// Group drawings meta data using user_id
const sortedTrainingMetaData = groupBy(trainingDrawingsMetaData, "user_id");
const sortedTestingMetaData = groupBy(testingDrawingsMetaData, "user_id");

for (let drawing of testingDrawingsMetaData) {
  const { label } = classify(trainingDrawingsMetaData, drawing.features);
  drawing.label = label;
  drawing.correct = drawing.label == drawing.realLabel;
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
