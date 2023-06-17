const fs = require("fs");

const drawingsMetaData = JSON.parse(
  fs.readFileSync("../data/dataset/drawingsMetaData.json")
);

for (const metaData of drawingsMetaData) {
  const drawing = fs.readFileSync(
    "../data/dataset/json/" + metaData.id + ".json"
  );
}

function getSegmentCount(drawing) {
  return drawing.length;
}

function getPointCount(drawing) {
  return drawing.flat().length;
}
