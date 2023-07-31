const constants = require("./utils/constants.js");
const fs = require("fs");
const ff = require("./utils/featureFunctions");
const { createCanvas } = require("canvas");
const { test } = require("./testingAndTraining.js");
const geometry = require("./utils/geometry.js");
const { draw } = require("./utils/common.js");

const canvas = createCanvas(constants.CANVAS_SIZE, constants.CANVAS_SIZE);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(constants.RAW_DATA_DIR).slice(0, 1);
const totalDrawings = fileNames.length * constants.NUM_OF_LABELS;
const drawingsMetaData = [];
const featureNames = ff.active.map((f) => f.featureName);
const activeFeatureFunctions = ff.active.map((f) => f.function);

let id = 1; // Image ID to be saved on the cloud

// Generate images using received JSON drawings
fileNames.forEach((fileName) => {
  const data = JSON.parse(
    fs.readFileSync(constants.RAW_DATA_DIR + "/" + fileName)
  );
  const { student: user, session: token, drawings: userDrawings } = data;

  for (let label in userDrawings) {
    if (!constants.flaggedSamples.includes(id)) {
      // Generate PNG image file for each drawing
      imageGenerator(
        constants.IMAGES_DIR + "/" + id + ".png",
        userDrawings[label]
      );

      // Generate JSON files for each drawing
      fs.writeFileSync(
        constants.JSON_DIR + "/" + id + ".json",
        JSON.stringify(userDrawings[label])
      );

      // Add the important features to the drawing meta data
      const features = activeFeatureFunctions.map((f) =>
        f(userDrawings[label])
      );
      drawingsMetaData.push({
        id: id,
        label: label,
        predictedLabel: label,
        correct: false,
        user: user,
        user_id: token,
        features: features,
      });
    }

    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(id + "/" + totalDrawings);
    id += 1;
  }
});

const minMax = ff.normalizedFeaturePoints(
  drawingsMetaData.map((d) => d.features)
);

fs.writeFileSync(
  constants.DATASET_DIR + "/dataset.js",
  "const dataset = " +
    JSON.stringify({ featureNames, drawingsMetaData, minMax }) +
    ";"
);

fs.writeFileSync(
  constants.DATASET_DIR + "/dataset.json",
  JSON.stringify(drawingsMetaData)
);

// Create testing and training files
test(drawingsMetaData, featureNames, constants.classifier);

// Generate images
function imageGenerator(filePath, drawing) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const segment of drawing) {
    draw(ctx, segment);
  }

  let { vertices, convexHull } = geometry.minBoundingBox({
    points: drawing.flat(),
  });

  // Draw minimum bounding box
  vertices = [...vertices, vertices[0]];
  draw(ctx, vertices, "green");

  // Draw convex hull while color is based on roundness (more round, more red)
  convexHull = [...convexHull, convexHull[0]];
  const roundness = geometry.roundness(convexHull) ** 4; // Power 4 is to emphasize on the roundness more
  const r = Math.floor(roundness * 255);
  const g = 0;
  const b = Math.floor((1 - roundness) * 255);
  const RGB = `rgb(${r},${g},${b})`;
  draw(ctx, convexHull, RGB);

  //// To display scales drawings
  // const pixels = ff.getPixels(drawing);
  // const size = Math.sqrt(pixels.length);
  // const imgData = ctx.getImageData(0, 0, size, size);
  // for (let i = 0; i < pixels.length; i++) {
  //   const alpha = pixels[i];
  //   const startIndex = i * 4;
  //   imgData.data[startIndex] = 0;
  //   imgData.data[startIndex + 1] = 0;
  //   imgData.data[startIndex + 2] = 0;
  //   imgData.data[startIndex + 3] = alpha;
  // }
  // ctx.putImageData(imgData, 0, 0);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);
}
