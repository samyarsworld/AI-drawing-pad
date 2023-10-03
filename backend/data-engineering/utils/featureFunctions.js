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
  const points = drawing.flat();
  if (points.length == 0) {
    return 0;
  }
  const allX = points.map((p) => p[0]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  return maxX - minX;
};

ff.getDrawingHeight = (drawing) => {
  const points = drawing.flat();
  if (points.length == 0) {
    return 0;
  }
  const allY = points.map((p) => p[1]);
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
  {
    name: "Pixel Array",
    function: (paths) => {
      return ff.getPixels(paths, 20);
    },
  },
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  // { featureName: "Drawing Width", function: ff.getDrawingWidth },
  // { featureName: "Drawing Height", function: ff.getDrawingHeight },
  // { featureName: "Elongation", function: ff.getElongation },
  // { featureName: "Roundness", function: ff.getRoundness },
  // { featureName: "Complexity", function: ff.getComplexity },
];

// Normalize feature points
ff.normalizeFeatures = (drawingsFeatures, minMax) => {
  let min, max;
  const featureCount = drawingsFeatures[0].length;

  // Find min and max of each feature
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...drawingsFeatures[0]];
    max = [...drawingsFeatures[0]];
    for (let i = 1; i < drawingsFeatures.length; i++) {
      for (let j = 0; j < featureCount; j++) {
        min[j] = Math.min(min[j], drawingsFeatures[i][j]);
        max[j] = Math.max(max[j], drawingsFeatures[i][j]);
      }
    }
  }

  // Normalize the features
  for (let i = 0; i < drawingsFeatures.length; i++) {
    for (let j = 0; j < featureCount; j++) {
      // Simple normalization technique is used (Z-score normalization could be used later to see if it improves the results)
      drawingsFeatures[i][j] =
        (drawingsFeatures[i][j] - min[j]) / (max[j] - min[j]);
    }
  }
  return { min, max };
};

export default ff;
