const fs = require("fs");

const drawingsMetaData = JSON.parse(
  fs.readFileSync("../data/dataset/drawingsMetaData.json")
);

for (const metaData of drawingsMetaData) {
  const drawing = JSON.parse(
    fs.readFileSync("../data/dataset/json/" + metaData.id + ".json")
  );
  // Add some features to the drawing meta data
  metaData.features = [getSegmentCount(drawing), getPointCount(drawing)];
}

const featuresNames = ["Segment Count", "Point Count"];

fs.writeFileSync(
  "../data/dataset/features.js",
  "const features = " +
    JSON.stringify({ featuresNames, drawingsMetaData }) +
    ";"
);

fs.writeFileSync(
  "../data/dataset/only-features.json",
  JSON.stringify({
    featuresNames,
    drawingsMetaData: drawingsMetaData.map((d) => {
      return { features: d.features, label: d.label };
    }),
  })
);

function getSegmentCount(drawing) {
  return drawing.length;
}

function getPointCount(drawing) {
  return drawing.flat().length;
}
