const drawingPadContainer = document.getElementById("drawingPadContainer");
const instructions = document.getElementById("instructions");
const startBtn = document.getElementById("start-btn");

const drawingPad = new Pad(drawingPadContainer, (size = 400));
startBtn.onclick = start; // Could use remove event listeners but this is cleaner
drawingPadContainer.style.visibility = "hidden";

// Initialize labels index and users data each time the page is reloaded
let index = 0;
const data = {
  user: null,
  token: new Date().getTime(),
  userDrawings: {},
};

// Start drawing if user has their name filled out
function start() {
  if (user.value == "") {
    alert("Please type your name first!");
    return;
  }
  user.style.display = "none";
  drawingPadContainer.style.visibility = "visible";
  startBtn.innerHTML = "NEXT";

  data.user = user.value; // Add user's name to user
  const label = LABELS[index]; // Going through each label (object for drawing)
  instructions.innerHTML = "Please draw a " + label;
  startBtn.onclick = next;
}

function next() {
  if (drawingPad.drawing.length == 0) {
    alert("Please make a drawing.");
    return;
  }
  const label = LABELS[index];
  data.userDrawings[label] = drawingPad.drawing;
  drawingPad.clear.click(); // Clear drawingPad for the next prompt

  index++; // Next label from LABELS (from constants.js)
  if (index < LABELS.length) {
    const nextLabel = LABELS[index];
    instructions.innerHTML = "Please draw a " + nextLabel;
  } else {
    canvasDiv.style.visibility = "hidden";
    buttonRow.style.visibility = "hidden";

    instructions.innerHTML = "We are all done! Feel free to redo!";
    startBtn.innerHTML = "SAVE";
    startBtn.onclick = save;
  }
}

function save() {
  startBtn.style.display = "none";
  instructions.innerHTML = "!!!NEED TO IMPLEMENT DATABASE!!!";

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