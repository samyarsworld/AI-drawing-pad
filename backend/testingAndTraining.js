/// For the purpose of training, half of the data will be used as known images and other
/// half will be tested with respect to their actual labels using the first half of the data
const fs = require("fs");
const ff = require("./utils/featureFunctions");
const { classify } = require("./utils/classifiers.js");
const { groupBy } = require("./utils/common.js");

const constants = require("./utils/constants");

function test(drawingsMetaData, featureNames, classifier) {
  const trainingAmount = Math.floor(drawingsMetaData.length / 2);
  trainingData = [];
  testingData = [];

  for (let i = 0; i < trainingAmount; i++) {
    trainingData.push(drawingsMetaData[i]);
  }

  for (let i = trainingAmount; i < drawingsMetaData.length; i++) {
    testingData.push(drawingsMetaData[i]);
  }

  // Calculate minMax
  const minMaxTraining = ff.normalizeFeatures(
    trainingData.map((d) => d.features)
  );

  // Normalize the testing data
  ff.normalizeFeatures(
    testingData.map((d) => d.features),
    minMaxTraining
  );

  // Classify each testing image
  let correctCount = 0;
  let totalCount = testingData.length;
  for (let drawing of testingData) {
    const { label } = classify(classifier, trainingData, drawing.features);
    drawing.predictedLabel = label;
    drawing.correct = drawing.predictedLabel == drawing.label;
    if (drawing.correct) {
      correctCount += 1;
    }
  }

  // Group drawings meta data using user_id
  const sortedTrainingMetaData = groupBy(trainingData, "user_id");
  const sortedTestingMetaData = groupBy(testingData, "user_id");

  fs.writeFileSync(
    constants.DATASET_DIR + "/trainingSet.js",
    "const trainingSet = " +
      JSON.stringify({
        sortedTrainingMetaData,
      })
  );
  fs.writeFileSync(
    constants.DATASET_DIR + "/testingSet.js",
    "const testingSet = " +
      JSON.stringify({
        featureNames,
        sortedTestingMetaData,
        testingDrawingsMetaData: testingData,
        accuracy: (correctCount / totalCount) * 100,
      })
  );
}

module.exports = { test };
