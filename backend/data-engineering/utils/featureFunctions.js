import geometry from "./geometry.js";
import math from "./math.js";
import { draw } from "./common.js";
import { createCanvas } from "canvas";

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

ff.getPixels = (drawing, size = 400, scale = true) => {
  let canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Scales the drawings to expand to the entire canvas width and height
  if (scale) {
    const points = drawing.flat();
    const bounds = {
      left: Math.min(...points.map((p) => p[0])),
      right: Math.max(...points.map((p) => p[0])),
      top: Math.min(...points.map((p) => p[1])),
      bottom: Math.max(...points.map((p) => p[1])),
    };

    const newDrawing = [];
    for (const path of drawing) {
      const newPoints = path.map((p) => [
        math.invLerp(bounds.left, bounds.right, p[0]) * size,
        math.invLerp(bounds.top, bounds.bottom, p[1]) * size,
      ]);
      newDrawing.push(newPoints);
    }
    for (const segment of newDrawing) {
      draw(ctx, segment);
    }
  } else {
    for (const segment of drawing) {
      draw(ctx, segment);
    }
  }

  const imgData = ctx.getImageData(0, 0, size, size);
  return imgData.data.filter((val, index) => index % 4 == 3); // Returns 4th element which is alpha (visibility)
};

ff.getComplexity = (drawing, size, scale) => {
  const pixels = ff.getPixels(drawing, size, scale);
  return pixels.filter((alpha) => alpha != 0).length;
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
  { featureName: "Complexity", function: ff.getComplexity },
];

// Normalize feature points
ff.normalizeFeatures = (features, minMax) => {
  let min, max;
  const dimensions = features[0].length;
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...features[0]];
    max = [...features[0]];
    for (let i = 1; i < features.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        min[j] = Math.min(min[j], features[i][j]);
        max[j] = Math.max(max[j], features[i][j]);
      }
    }
  }
  for (let i = 0; i < features.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      // Change the features by reference
      // Simple normalization technique is used (Z-score normalization could be used later to see if it improves the results)
      features[i][j] = (features[i][j] - min[j]) / (max[j] - min[j]);
    }
  }
  return { min, max };
};

export default ff;
