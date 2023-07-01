const constants = require("./utils/constants.js");
const fs = require("fs");
const { createCanvas } = require("canvas");

const canvas = createCanvas(constants.CANVAS_SIZE, constants.CANVAS_SIZE);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(constants.RAW_DATA_DIR);
const totalDrawings = fileNames.length * constants.NUM_OF_LABELS;
const drawingsMetaData = [];
let id = 1; // Image ID to be saved on the cloud

// Generate images using received JSON drawings
fileNames.forEach((fileName) => {
  const data = JSON.parse(
    fs.readFileSync(constants.RAW_DATA_DIR + "/" + fileName)
  );
  const { user, token, userDrawings } = data;

  for (let label in userDrawings) {
    drawingsMetaData.push({ id: id, label: label, user: user, user_id: token });

    fs.writeFileSync(
      constants.JSON_DIR + "/" + id + ".json",
      JSON.stringify(userDrawings[label])
    );

    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(id + "/" + totalDrawings);

    // Generate PNG image file
    imageGenerator(
      constants.IMAGES_DIR + "/" + id + ".png",
      userDrawings[label]
    );
    id += 1;
  }
});

//// Generate the dataset by including the feature points and minMax for scaling
const ff = require("./utils/featureFunctions");

for (const metaData of drawingsMetaData) {
  const drawing = JSON.parse(
    fs.readFileSync(constants.JSON_DIR + "/" + metaData.id + ".json")
  );
  // Add the important features to the drawing meta data
  const activeFeatureFunctions = ff.active.map((f) => f.function);
  metaData.features = activeFeatureFunctions.map((f) => f(drawing));
}

const minMax = ff.normalizedFeaturePoints(
  drawingsMetaData.map((d) => d.features)
);

const featureNames = ff.active.map((f) => f.featureName);

fs.writeFileSync(
  constants.DATASET_DIR + "/dataset.js",
  "const dataset = " +
    JSON.stringify({ featureNames, drawingsMetaData, minMax }) +
    ";"
);

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
