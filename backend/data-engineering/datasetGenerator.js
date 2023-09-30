import constants from "./utils/constants.js";
import fs from "fs";
import ff from "./utils/featureFunctions.js";
import { createCanvas } from "canvas";
import test from "./testingAndTraining.js";
import geometry from "./utils/geometry.js";
import { draw } from "./utils/common.js";

const canvas = createCanvas(constants.CANVAS_SIZE, constants.CANVAS_SIZE);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(constants.RAW_DATA_DIR).slice(0, 40);
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
  const { user, user_id, userDrawings } = data;

  // Skip the flagged users
  if (constants.flaggedUsers.includes(user_id)) {
    id += 8;
    return;
  }
  for (let label in userDrawings) {
    // Generate PNG image file for each drawing
    imageGenerator(
      constants.IMAGES_DIR + "/" + id + ".png",
      userDrawings[label]
    );

    // Add the important features to the drawing meta data
    const features = activeFeatureFunctions.map((f) => f(userDrawings[label]));
    drawingsMetaData.push({
      id: id,
      label: label,
      predictedLabel: label,
      correct: false,
      user: user,
      user_id: user_id,
      features: features,
    });

    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(id + "/" + totalDrawings);
    id += 1;
  }
});

const minMax = ff.normalizeFeatures(drawingsMetaData.map((d) => d.features));

fs.writeFileSync(
  constants.DATASET_DIR + "/dataset.js",
  "const dataset = " +
    JSON.stringify({ featureNames, drawingsMetaData, minMax }) +
    ";"
);

fs.writeFileSync(
  constants.FRONTEND_DATASET_DIR + "/dataset.js",
  "const dataset = " +
    JSON.stringify({ featureNames, drawingsMetaData, minMax }) +
    ";"
);

fs.writeFileSync(
  constants.DATASET_DIR + "/dataset.json",
  JSON.stringify(drawingsMetaData)
);

fs.writeFileSync(
  constants.DATASET_DIR + "/minmax.json",
  JSON.stringify(minMax)
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
