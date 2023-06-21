const constants = require("./utils/constants.js");
const fs = require("fs");
const ff = require("./utils/featureFunctions");

const drawingsMetaData = JSON.parse(
  fs.readFileSync("../data/dataset/drawingsMetaData.json")
);

for (const metaData of drawingsMetaData) {
  const drawing = JSON.parse(
    fs.readFileSync(constants.JSON_DIR + "/" + metaData.id + ".json")
  );
  // Add the important features to the drawing meta data
  const activeFeatureFunctions = ff.active.map((f) => f.function);
  metaData.features = activeFeatureFunctions.map((f) => f(drawing));
}
const minMax = ff.normalizedFeaturePoints(
  drawingsMetaData.map((d) => d.features)
);

const featureNames = ff.active.map((f) => f.featureName);

fs.writeFileSync(
  constants.DATASET_DIR + "/features.js",
  "const features = " +
    JSON.stringify({ featureNames, drawingsMetaData, minMax }) +
    ";"
);
