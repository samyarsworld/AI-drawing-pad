/// For the purpose of training, half of the data will be used as known images and other
/// half will be tested with respect to their actual labels using the first half of the data

import fs from "fs";
import ff from "./utils/featureFunctions.js";
import { KNN, MLP } from "./utils/classifiers.js";
import { groupBy, toCSV } from "./utils/common.js";
import constants from "./utils/constants.js";

function test(drawingSamples, featureNames) {
  const trainingSamplesCount = Math.floor(drawingSamples.length * 0.5);
  const trainingSamples = [];
  const testingSamples = [];

  for (let i = 0; i < trainingSamplesCount; i++) {
    trainingSamples.push(drawingSamples[i]);
  }

  for (let i = trainingSamplesCount; i < drawingSamples.length; i++) {
    testingSamples.push(drawingSamples[i]);
  }

  // Calculate minMax and normalize the training set
  const minMaxTraining = ff.normalizeFeatures(
    trainingSamples.map((d) => d.features)
  );

  // Normalize the testing data
  ff.normalizeFeatures(
    testingSamples.map((d) => d.features),
    minMaxTraining
  );

  // Create the classification model
  // K-nearest neighbor model
  const kNN = new KNN(trainingSamples);

  // Deep learning model
  const mLP = new MLP([
    trainingSamples[0].features.length,
    50,
    20,
    constants.CLASSES.length,
  ]);

  // Use existing model
  if (fs.existsSync(constants.MODEL)) {
    mLP.load(JSON.parse(fs.readFileSync(constants.MODEL)));
  }

  console.log("\nBuild the MLP model using training samples...");
  mLP.fit(trainingSamples, 1000);

  fs.writeFileSync(constants.MODEL, JSON.stringify(mLP));
  fs.writeFileSync(constants.MODEL_JS, `const model = ${JSON.stringify(mLP)}`);

  console.log("\nClassify testing set...");
  let id = 1;
  // Classify each testing image
  let correctCount = 0;
  let totalCount = testingSamples.length;
  for (let drawing of testingSamples) {
    // const { label } = kNN.predict(drawing.features);
    const { label } = mLP.predict(drawing.features);

    drawing.predictedLabel = label;
    drawing.correct = drawing.predictedLabel == drawing.label;
    if (drawing.correct) {
      correctCount += 1;
    }
    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(id + "/" + testingSamples.length);
    id += 1;
  }

  // Print accuracy
  console.log("\n", (correctCount / totalCount) * 100);

  // Group drawings sets using user_id
  const sortedTrainingSamples = groupBy(trainingSamples, "user_id");
  const sortedTestingSamples = groupBy(testingSamples, "user_id");

  fs.writeFileSync(
    constants.DATASET_DIR + "/trainingSet.js",
    "const trainingSet = " +
      JSON.stringify({
        trainingSamples,
        sortedTrainingSamples,
      })
  );

  fs.writeFileSync(
    constants.FRONTEND_DATASET_DIR + "/trainingSet.js",
    "const trainingSet = " +
      JSON.stringify({
        trainingSamples,
        sortedTrainingSamples,
      })
  );

  fs.writeFileSync(
    constants.DATASET_DIR + "/testingSet.js",
    "const testingSet = " +
      JSON.stringify({
        featureNames,
        sortedTestingSamples,
        testingSamples,
        accuracy: (correctCount / totalCount) * 100,
      })
  );

  fs.writeFileSync(
    constants.DATASET_DIR + "/testingSet.json",
    JSON.stringify({ testingSamples })
  );
  fs.writeFileSync(
    constants.DATASET_DIR + "/trainingSet.json",
    JSON.stringify({ trainingSamples })
  );

  fs.writeFileSync(
    constants.FRONTEND_DATASET_DIR + "/testingSet.js",
    "const testingSet = " +
      JSON.stringify({
        featureNames,
        sortedTestingSamples,
        testingSamples,
        accuracy: (correctCount / totalCount) * 100,
      })
  );

  // CSV form
  fs.writeFileSync(
    constants.TRAINING_CSV,
    toCSV(
      [...featureNames, "Label"],
      trainingSamples.map((d) => [...d.features, d.label])
    )
  );
  fs.writeFileSync(
    constants.TESTING_CSV,
    toCSV(
      [...featureNames, "Label"],
      testingSamples.map((d) => [...d.features, d.label])
    )
  );

  return minMaxTraining;
}

export default test;
