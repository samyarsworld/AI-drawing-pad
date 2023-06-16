const drawingPad = new Pad((size = 400));

const clearBtn = document.getElementById("clear-btn");
const undoBtn = document.getElementById("undo-btn");

clearBtn.addEventListener("click", drawingPad.clear);
undoBtn.addEventListener("click", drawingPad.undo);
