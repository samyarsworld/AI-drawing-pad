DATA_DIR = "../data";
RAW_DATA_DIR = DATA_DIR + "/raw";
DATASET_DIR = DATA_DIR + "/dataset";
IMAGES_DIR = DATASET_DIR + "/images";
JSON_DIR = DATASET_DIR + "/json";
NUM_OF_LABELS = 10;

const fs = require("fs");
const { logProgress } = require("./utils.js");

const { createCanvas } = require("canvas");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(RAW_DATA_DIR);
const drawingsMetaData = [];
let id = 1;
fileNames.forEach((fileName) => {
  const data = JSON.parse(fs.readFileSync(RAW_DATA_DIR + "/" + fileName));
  const { user, token, userDrawings } = data;

  for (let label in userDrawings) {
    drawingsMetaData.push({ id: id, label: label, user: user, user_id: token });

    fs.writeFileSync(
      JSON_DIR + "/" + id + ".json",
      JSON.stringify(userDrawings[label])
    );

    // Log the progress of generating images
    logProgress(id, fileNames.length * NUM_OF_LABELS);
    imageGenerator(IMAGES_DIR + "/" + id + ".png", userDrawings[label]);

    id += 1;
  }
});

// Json
fs.writeFileSync(
  DATASET_DIR + "/drawingsMetaData.json",
  JSON.stringify(drawingsMetaData)
);

// Directly readable for javascript
fs.writeFileSync(
  DATASET_DIR + "/drawingsMetaData.js",
  "const drawingsMetaData = " + JSON.stringify(drawingsMetaData) + ";"
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
