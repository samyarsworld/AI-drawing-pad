const constants = require("./utils/constants.js");
const fs = require("fs");
const ff = require("./utils/featureFunctions");
const { createCanvas } = require("canvas");
const { test } = require("./testingAndTraining.js");

const canvas = createCanvas(constants.CANVAS_SIZE, constants.CANVAS_SIZE);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(constants.RAW_DATA_DIR);
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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(segment[0][0], segment[0][1]);
    for (let i = 1; i < segment.length; i++) {
      ctx.lineTo(segment[i][0], segment[i][1]);
    }
    ctx.stroke();
  }
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);
}
