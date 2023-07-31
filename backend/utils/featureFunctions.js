const geometry = require("./geometry.js");

const ff = {};

// Feature functions
ff.getDrawingSegmentCount = (drawing) => {
  return drawing.length;
};

ff.getDrawingPointCount = (drawing) => {
  return drawing.flat().length;
};

ff.getDrawingWidth = (drawing) => {
  const allPoints = drawing.flat();
  const allX = allPoints.map((p) => p[0]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  return maxX - minX;
};

ff.getDrawingHeight = (drawing) => {
  const allPoints = drawing.flat();
  const allY = allPoints.map((p) => p[1]);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  return maxY - minY;
};

ff.getElongation = (drawing) => {
  const allPoints = drawing.flat();
  const { width, height } = geometry.minBoundingBox({ points: allPoints });
  return (Math.max(width, height) + 1) / (Math.min(width, height) + 1); // Add 1 to avoid division by 0
};

ff.getRoundness = (drawing) => {
  const allPoints = drawing.flat();
  const { convexHull } = geometry.minBoundingBox({ points: allPoints });
  return geometry.roundness(convexHull);
};

ff.active = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: ff.getDrawingWidth },
  { featureName: "Drawing Height", function: ff.getDrawingHeight },
  { featureName: "Elongation", function: ff.getElongation },
  { featureName: "Roundness", function: ff.getRoundness },
];

// Normalize feature points
ff.normalizedFeaturePoints = (featurePoints, minMax) => {
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
      // Change the features by reference
      // Simple normalization technique is used (Z-score normalization could be used later to see if it improves the results)
      featurePoints[i][j] = (featurePoints[i][j] - min[j]) / (max[j] - min[j]);
    }
  }
  return { min, max };
};

module.exports = ff;
