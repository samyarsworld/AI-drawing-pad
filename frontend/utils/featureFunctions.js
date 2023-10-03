// Feature functions
function getDrawingSegmentCount(drawing) {
  return drawing.length;
}

function getDrawingPointCount(drawing) {
  return drawing.flat().length;
}

function getDrawingWidth(drawing) {
  const points = drawing.flat();
  if (points.length == 0) {
    return 0;
  }
  const allX = points.map((p) => p[0]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  return maxX - minX;
}

function getDrawingHeight(drawing) {
  const points = drawing.flat();
  if (points.length == 0) {
    return 0;
  }
  const allY = points.map((p) => p[1]);
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

  const imgData = ctx.getImageData(0, 0, size, size).data;
  const pixels = new Array(size);
  let i = 3;
  let j = 0;
  while (i < imgData.length) {
    pixels[j] = imgData[i];
    j += 1;
    i += 4;
  }

  // return imgData.filter((val, index) => index % 4 == 3); // Built-in version of the above but slower

  return pixels;
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

const featureFunctions = [
  {
    name: "Pixel Array",
    function: (paths) => {
      return getPixels(paths, 20);
    },
  },
  // { featureName: "Drawing Width", function: getDrawingWidth, active: true },
  // { featureName: "Drawing Height", function: getDrawingHeight, active: true },
  // { featureName: "Elongation", function: getElongation, active: true },
  // { featureName: "Roundness", function: getRoundness, active: true },
  // { featureName: "Complexity", function: getComplexity, active: true },
];

function getActiveFeatureFunctions() {
  // return featureFunctions.filter((item) => item.active).map((f) => f.function);
  return featureFunctions[0].function;
}

let activeIndex = [0, 1, 2, 3, 4];
