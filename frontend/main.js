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
    smartPad.triggerUpdate();
  } else {
    smartPadContainer.style.display = "none";
    sketchBtn.innerHTML = "SKETCH!";
    sketchBtn.style.backgroundColor = "rgb(170, 32, 142)";
    chart.hideRealTimeDrawing();
  }
};

let index = 0;
const labels = [
  "car",
  "ball",
  "fish",
  "house",
  "pen",
  "box",
  "phone",
  "tree",
  "hat",
  "person",
];

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
  const label = labels[index];
  instructions.innerHTML = "Please draw a " + label;
  startBtn.innerHTML = "NEXT";
  startBtn.onclick = next;
}

function next() {
  if (drawingPad.drawing.length == 0) {
    alert("Draw something first!");
    return;
  }

  const label = labels[index];
  data.userDrawings[label] = drawingPad.drawing;
  drawingPad.clear();
  index++;
  if (index < labels.length) {
    const nextLabel = labels[index];
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
