const drawingPad = new Pad((size = 400));
const canvasDiv = document.querySelector(".canvas-div");
const buttonRow = document.querySelector(".button-row");

const startBtn = document.getElementById("start-btn");
const clearBtn = document.getElementById("clear-btn");
const undoBtn = document.getElementById("undo-btn");
const instructions = document.getElementById("instructions");

clearBtn.addEventListener("click", drawingPad.clear);
undoBtn.addEventListener("click", drawingPad.undo);
startBtn.onclick = start; // Could use remove event listeners but this is cleaner
canvasDiv.style.visibility = "hidden";
buttonRow.style.visibility = "hidden";

let index = 0;
const labels = ["car", "ball", "fish"];

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
  canvasDiv.style.visibility = "visible";
  buttonRow.style.visibility = "visible";
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
