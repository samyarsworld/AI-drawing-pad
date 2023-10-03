import constants from "./utils/constants.js";
import fs from "fs";
import { KNN, MLP } from "./utils/classifiers.js";

console.log("RUNNING CLASSIFICATION ...");

const { trainingSamples } = JSON.parse(
  fs.readFileSync(constants.DATASET_DIR + "/trainingSet.json")
);

const mlp = new MLP(
  [trainingSamples[0].features.length, 50, 20, constants.CLASSES.length],
  constants.CLASSES
);

if (fs.existsSync(constants.MODEL)) {
  mlp.load(JSON.parse(fs.readFileSync(constants.MODEL)));
}

mlp.fit(trainingSamples, 1000);

fs.writeFileSync(constants.MODEL, JSON.stringify(mlp));
fs.writeFileSync(constants.MODEL_JS, `const model = ${JSON.stringify(mlp)};`);

const { testingSamples } = JSON.parse(
  fs.readFileSync(constants.DATASET_DIR + "/testingSet.json")
);

let totalCount = 0;
let correctCount = 0;
for (const sample of testingSamples) {
  const { label } = mlp.predict(sample.features);

  correctCount += label == sample.label;
  totalCount++;
}

console.log("ACCURACY: " + (correctCount / totalCount) * 100);
