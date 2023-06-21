const fs = require("fs");
const { createCanvas } = require("canvas");

const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
const ctx = canvas.getContext("2d");

const fileNames = fs.readdirSync(RAW_DATA_DIR);
const totalDrawings = fileNames.length * NUM_OF_LABELS;
const drawingsMetaData = [];
let id = 1; // Image ID to be saved on the cloud

// Generate images using received JSON drawings
fileNames.forEach((fileName) => {
  const data = JSON.parse(fs.readFileSync(RAW_DATA_DIR + "/" + fileName));
  console.log(data);
  const { user, token, userDrawings } = data;

  for (let label in userDrawings) {
    drawingsMetaData.push({ id: id, label: label, user: user, user_id: token });

    fs.writeFileSync(
      JSON_DIR + "/" + id + ".json",
      JSON.stringify(userDrawings[label])
    );

    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(id + "/" + totalDrawings);

    // Generate PNG image file
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
