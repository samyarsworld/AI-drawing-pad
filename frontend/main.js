const drawingPad = new Pad(drawingPadContainer, (size = 400));
const instructions = document.getElementById("instructions");
const startBtn = document.getElementById("start-btn");
startBtn.onclick = start; // Could use remove event listeners but this is cleaner
drawingPadContainer.style.visibility = "hidden";

const smartPadBtn = document.getElementById("smartPad-btn");
const contributeBtn = document.getElementById("contribute-btn");
const sketchBtn = document.getElementById("navbar-btn");
const smartPadPage = document.getElementById("smartPad");
const contributePage = document.getElementById("contribute");
const smartPadContainer = document.getElementById("smartPadContainer");

smartPadBtn.onclick = () => {
  contributePage.style.display = "none";
  sketchBtn.style.display = "block";
  smartPadPage.style.display = "block";
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  smartPadBtn.classList.add("active");
};

contributeBtn.onclick = () => {
  contributePage.style.display = "block";
  sketchBtn.style.display = "none";
  smartPadPage.style.display = "none";
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  contributeBtn.classList.add("active");
};

sketchBtn.onclick = () => {
  if (sketchBtn.innerHTML == "SKETCH!") {
    smartPadContainer.style.display = "block";
    sketchBtn.innerHTML = "DRAWINGS";
    sketchBtn.style.backgroundColor = "green";
    smartPad.triggerChartUpdate();
  } else {
    smartPadContainer.style.display = "none";
    sketchBtn.innerHTML = "SKETCH!";
    sketchBtn.style.backgroundColor = "rgb(170, 32, 142)";
    chart.hideRealTimeDrawing();
  }
};

let index = 0;
// Contribute page
const data = {
  user: null,
  token: new Date().getTime(),
  userDrawings: {},
};

function start() {
  if (user.value == "") {
    alert("Please type your name first!");
    return;
  }
  data.user = user.value;
  user.style.display = "none";
  drawingPadContainer.style.visibility = "visible";
  const label = LABELS[index];
  instructions.innerHTML = "Please draw a " + label;
  startBtn.innerHTML = "NEXT";
  startBtn.onclick = next;
}

function next() {
  if (drawingPad.drawing.length == 0) {
    alert("Draw something first!");
    return;
  }

  const label = LABELS[index];
  data.userDrawings[label] = drawingPad.drawing;
  drawingPad.clear();
  index++;
  if (index < LABELS.length) {
    const nextLabel = LABELS[index];
    instructions.innerHTML = "Please draw a " + nextLabel;
  } else {
    canvasDiv.style.visibility = "hidden";
    buttonRow.style.visibility = "hidden";

    instructions.innerHTML = "Thank you!";
    startBtn.innerHTML = "SAVE";
    startBtn.onclick = save;
  }
}

function save() {
  startBtn.style.display = "none";
  instructions.innerHTML =
    "Take your downloaded file and place it alongside the others in the dataset!";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data))
  );

  const fileName = data.token + ".json";
  element.setAttribute("download", fileName);
  element.click();
}

// SmartPad page
const activeFeatureFunctions = [
  //{featureName:"Segment Count",function:getDrawingSegmentCount},
  //{featureName:"Point Count",function:getDrawingPointCount},
  { featureName: "Drawing Width", function: getDrawingWidth },
  { featureName: "Drawing Height", function: getDrawingHeight },
];

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

function normalizedFeaturePoints(featurePoints, minMax) {
  let min, max;
  const dimensions = featurePoints[0].length;
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...featurePoints[0]];
    max = [...featurePoints[0]];
    for (let i = 1; i < featurePoints.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        min[j] = Math.min(min[j], featurePoints[i][j]);
        max[j] = Math.max(max[j], featurePoints[i][j]);
      }
    }
  }
  for (let i = 0; i < featurePoints.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      featurePoints[i][j] = invLerp(min[j], max[j], featurePoints[i][j]);
    }
  }
  return { min, max };
}

function invLerp(a, b, v) {
  return (v - a) / (b - a);
}
