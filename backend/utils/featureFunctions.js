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

const active = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: getDrawingWidth },
  { featureName: "Drawing Height", function: getDrawingHeight },
];

// Normalize feature points
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
      featurePoints[i][j] = (featurePoints[i][j] - min[j]) / (max[j] - min[j]);
    }
  }
  return { min, max };
}

module.exports = {
  active,
  getDrawingSegmentCount,
  getDrawingPointCount,
  getDrawingWidth,
  getDrawingHeight,
  normalizedFeaturePoints,
};
