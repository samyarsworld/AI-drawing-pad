/// For the purpose of training, half of the data will be used as known images and other
/// half will be tested with respect to their actual labels using the first half of the data

import fs from "fs";
import ff from "./utils/featureFunctions.js";
import { KNN, MLP } from "./utils/classifiers.js";
import { groupBy } from "./utils/common.js";
import constants from "./utils/constants.js";

function test(drawingsMetaData, featureNames, classifier) {
  const trainingAmount = Math.floor(drawingsMetaData.length * 0.5);
  const trainingData = [];
  const testingData = [];

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

  const kNN = new KNN(trainingData);
  const mLP = new MLP([
    trainingData[0].features.length,
    constants.CLASSES.length,
  ]);

  if (fs.existsSync(constants.MODEL)) {
    mLP.load(JSON.parse(fs.readFileSync(constants.MODEL)));
  }

  mLP.fit(trainingData, 1000);

  fs.writeFileSync(constants.MODEL, JSON.stringify(mLP));
  fs.writeFileSync(constants.MODEL_JS, `const model = ${JSON.stringify(mLP)}`);

  // Classify each testing image
  let correctCount = 0;
  let totalCount = testingData.length;
  for (let drawing of testingData) {
    // const { label } = kNN.predict(drawing.features);
    const { label } = mLP.predict(drawing.features);

    drawing.predictedLabel = label;
    drawing.correct = drawing.predictedLabel == drawing.label;
    if (drawing.correct) {
      correctCount += 1;
    }
  }

  // Print accuracy
  console.log("\n", (correctCount / totalCount) * 100);

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
    constants.FRONTEND_DATASET_DIR + "/trainingSet.js",
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

  fs.writeFileSync(
    constants.FRONTEND_DATASET_DIR + "/testingSet.js",
    "const testingSet = " +
      JSON.stringify({
        featureNames,
        sortedTestingMetaData,
        testingDrawingsMetaData: testingData,
        accuracy: (correctCount / totalCount) * 100,
      })
  );
}

export default test;
