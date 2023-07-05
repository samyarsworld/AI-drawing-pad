const constants = require("./utils/constants.js");
const { classify } = require("./utils/classifiers.js");
const fs = require("fs");
const { createCanvas } = require("canvas");

const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");
const classifier = "KNN";

const data = JSON.parse(
  fs.readFileSync(constants.DATASET_DIR + "/" + "dataset.json")
);

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    const point = [x / canvas.width, 1 - y / canvas.height];
    const { label } = classify(classifier, data, point);
    const color = constants.STYLES[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DATASET_DIR + "/decisionBoundary.png", buffer);
