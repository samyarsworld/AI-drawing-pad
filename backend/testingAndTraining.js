/// For the purpose of training, half of the data will be used as known images and other
/// half will be tested with respect to their actual labels using the first half of the data
const fs = require("fs");
const ff = require("./utils/featureFunctions");

const constants = require("./utils/constants");

function test(drawingsMetaData, featureNames) {
  const trainingAmount = Math.floor(drawingsMetaData.length / 2);
  trainingData = [];
  testingData = [];

  for (let i = 0; i < trainingAmount; i++) {
    trainingData.push(drawingsMetaData[i]);
  }

  for (let i = trainingAmount; i < drawingsMetaData.length; i++) {
    drawingsMetaData[i].realLabel = drawingsMetaData[i].label;
    drawingsMetaData[i].label = "?";
    testingData.push(drawingsMetaData[i]);
  }

  const minMaxTraining = ff.normalizedFeaturePoints(
    trainingData.map((d) => d.features)
  );

  ff.normalizedFeaturePoints(
    testingData.map((d) => d.features),
    minMaxTraining
  );

  fs.writeFileSync(
    constants.DATASET_DIR + "/trainingSet.js",
    "const trainingSet = " +
      JSON.stringify({
        trainingDrawingsMetaData: trainingData,
        minMaxTraining,
      })
  );
  fs.writeFileSync(
    constants.DATASET_DIR + "/testingSet.js",
    "const testingSet = " +
      JSON.stringify({ featureNames, testingDrawingsMetaData: testingData })
  );
}

module.exports = { test };
