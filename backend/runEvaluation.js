const constants = require("./utils/constants.js");
const { classify } = require("./utils/classifiers.js");
const fs = require("fs");
const { createCanvas } = require("canvas");

const canvas = createCanvas(300, 300);
const ctx = canvas.getContext("2d");

const data = JSON.parse(
  fs.readFileSync(constants.DATASET_DIR + "/" + "dataset.json")
);

let count = 0;
for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    const point = [x / canvas.width, 1 - y / canvas.height];
    const { label } = classify(constants.classifier, data, point);
    const color = constants.STYLES[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);

    // Log the progress of generating images
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    process.stdout.write(count + "/" + canvas.width * canvas.height);
    count += 1;
  }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DATASET_DIR + "/decisionBoundary.png", buffer);
