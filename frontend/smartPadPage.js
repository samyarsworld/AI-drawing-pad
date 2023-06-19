// Page elements
const drawingsContainer = document.getElementById("drawingsContainer");
const chartContainer = document.getElementById("chartContainer");
const smartPadContainer = document.getElementById("smartPadContainer");
const { drawingsMetaData, featureNames } = features;
const sortedMetaData = groupBy(drawingsMetaData, "user_id");

for (const user_id in sortedMetaData) {
  const metaData = sortedMetaData[user_id];
  const user = metaData[0].user;
  createRow(user, metaData);
}

graphics.generateImages(STYLES);

const options = {
  size: 400,
  axisLabels: featureNames,
  styles: STYLES,
  transparency: 0.7,
  icon: "text",
};
const chart = new Chart(chartContainer, drawingsMetaData, options, handleClick);
const smartPad = new Pad(smartPadContainer, (size = 400), drawingUpdate);

const activeFeatureFunctions = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: getDrawingWidth },
  { featureName: "Drawing Height", function: getDrawingHeight },
];

function drawingUpdate(drawing) {
  const featureFunctions = activeFeatureFunctions.map((f) => f.function);
  const point = featureFunctions.map((f) => f(drawing));
  normalizedFeaturePoints([point], minMax);
  const { label, nearestDrawings } = classify(point);
  predictedLabelContainer.innerHTML = "Is it a " + label + " ?";
  chart.showRealTimeDrawing(point, label, nearestDrawings);
}

function classify(point) {
  // Get all the points on the chart
  const points = drawingsMetaData.map((d) => d.features);
  // Get indices of the k nearest points on the chart to current point
  const indices = getNearest(point, points, (k = 10));
  const nearestDrawings = indices.map((ind) => drawingsMetaData[ind]);
  const labels = nearestDrawings.map((d) => d.label);
  const counts = {};
  for (const label of labels) {
    counts[label] = counts[label] ? counts[label] + 1 : 1;
  }
  const max = Math.max(...Object.values(counts));
  const label = labels.find((l) => counts[l] == max);
  return { label, nearestDrawings };
}

function createRow(userName, metaData) {
  const row = document.createElement("div");
  row.classList.add("row");
  drawingsContainer.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerHTML = userName;
  rowLabel.classList.add("row-label");
  row.appendChild(rowLabel);

  for (const drawingMetaData of metaData) {
    const { id, label } = drawingMetaData;

    const drawingContainer = document.createElement("div");
    drawingContainer.id = "drawing_" + id;
    drawingContainer.onclick = () => handleClick(drawingMetaData);
    drawingContainer.classList.add("drawing-container");

    const drawingLabel = document.createElement("div");
    drawingLabel.innerHTML = label;
    drawingContainer.appendChild(drawingLabel);

    const img = document.createElement("img");
    img.src = "../data/dataset/images/" + id + ".png";
    img.classList.add("drawing");

    drawingContainer.appendChild(img);

    row.appendChild(drawingContainer);
  }
}

function handleClick(drawing) {
  // Remove previously selected drawing
  [...document.querySelectorAll(".highlight")].forEach((ele) =>
    ele.classList.remove("highlight")
  );
  if (!drawing) return;
  const drawingContainer = document.getElementById("drawing_" + drawing.id);
  drawingContainer.classList.add("highlight");
  drawingContainer.scrollIntoView({ behavior: "auto", block: "center" });

  chart.selectSample(drawing);
}
