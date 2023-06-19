const drawingPadContainer = document.getElementById("drawingPadContainer");
const instructions = document.getElementById("instructions");
const startBtn = document.getElementById("start-btn");

const drawingPad = new Pad(drawingPadContainer, (size = 400));
startBtn.onclick = start; // Could use remove event listeners but this is cleaner
drawingPadContainer.style.visibility = "hidden";

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
  drawingPad.clear.click();
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
