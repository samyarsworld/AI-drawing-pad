const activeFeatureFunctions = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: getDrawingWidth },
  { featureName: "Drawing Height", function: getDrawingHeight },
];
const fs = require("fs");

const drawingsMetaData = JSON.parse(
  fs.readFileSync("../data/dataset/drawingsMetaData.json")
);

for (const metaData of drawingsMetaData) {
  const drawing = JSON.parse(
    fs.readFileSync("../data/dataset/json/" + metaData.id + ".json")
  );
  // Add the important features to the drawing meta data
  const featureFunctions = activeFeatureFunctions.map((f) => f.function);
  metaData.features = featureFunctions.map((f) => f(drawing));
}
const minMax = normalizedFeaturePoints(drawingsMetaData.map((d) => d.features));

const featureNames = activeFeatureFunctions.map((f) => f.featureName);

fs.writeFileSync(
  "../data/dataset/features.js",
  "const features = " + JSON.stringify({ featureNames, drawingsMetaData }) + ";"
);

fs.writeFileSync(
  "../data/dataset/only-features.json",
  JSON.stringify({
    featureNames,
    drawingsMetaData: drawingsMetaData.map((d) => {
      return { features: d.features, label: d.label };
    }),
  })
);

fs.writeFileSync(
  "../data/dataset/minMax.js",
  `const minMax=
  ${JSON.stringify(minMax)}
  ;`
);
