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

// Feature functions
function getDrawingSegmentCount(drawing) {
  return drawing.length;
}

function getDrawingPointCount(drawing) {
  return drawing.flat().length;
}

function getDrawingWidth(drawing) {
  const allPoints = drawing.flat();
  const allX = allPoints.map((p) => p[0]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  return maxX - minX;
}

function getDrawingHeight(drawing) {
  const allPoints = drawing.flat();
  const allY = allPoints.map((p) => p[1]);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  return maxY - minY;
}

function normalizedFeaturePoints(featurePoints, minMax) {
  let min, max;
  const dimensions = featurePoints[0].length;
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...featurePoints[0]];
    max = [...featurePoints[0]];
    for (let i = 1; i < featurePoints.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        min[j] = Math.min(min[j], featurePoints[i][j]);
        max[j] = Math.max(max[j], featurePoints[i][j]);
      }
    }
  }
  for (let i = 0; i < featurePoints.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      featurePoints[i][j] = invLerp(min[j], max[j], featurePoints[i][j]);
    }
  }
  return { min, max };
}

function invLerp(a, b, v) {
  return (v - a) / (b - a);
}
