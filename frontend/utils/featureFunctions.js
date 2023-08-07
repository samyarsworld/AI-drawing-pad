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

function getPixels(drawing, size = 400, scale = true) {
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
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
}

function getComplexity(drawing, size, scale) {
  const pixels = getPixels(drawing, size, scale);
  return pixels.filter((alpha) => alpha != 0).length;
}

function getElongation(drawing) {
  const allPoints = drawing.flat();
  const { width, height } = geometry.minBoundingBox({ points: allPoints });
  return (Math.max(width, height) + 1) / (Math.min(width, height) + 1); // Add 1 to avoid division by 0
}

function getRoundness(drawing) {
  const allPoints = drawing.flat();
  const { convexHull } = geometry.minBoundingBox({ points: allPoints });
  return geometry.roundness(convexHull);
}

// Normalize feature points
function normalizeFeatures(features, minMax) {
  let min, max;
  const dimensions = features.length;
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...features];
    max = [...features];
    for (let i = 0; i < dimensions; i++) {
      min[i] = Math.min(min[i], features[i]);
      max[i] = Math.max(max[i], features[i]);
    }
  }
  for (let i = 0; i < dimensions; i++) {
    // Change the features by reference
    features[i] = math.invLerp(min[i], max[i], features[i]);
  }
  return { min, max };
}

const active = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: getDrawingWidth },
  { featureName: "Drawing Height", function: getDrawingHeight },
  { featureName: "Elongation", function: getElongation },
  { featureName: "Roundness", function: getRoundness },
  // { featureName: "Complexity", function: getComplexity },
];
