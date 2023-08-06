// Single page application page change
const smartPadPage = document.getElementById("smartPad");
const contributePage = document.getElementById("contribute");
const testingPage = document.getElementById("testing");

// Navbar
const smartPadBtn = document.getElementById("smartPad-btn");
const contributeBtn = document.getElementById("contribute-btn");
const testingBtn = document.getElementById("testing-btn");
const sketchBtn = document.getElementById("navbar-btn");

// Testing elements
const testingH1 = document.getElementById("testing-h1");
const testingSubtitle = document.getElementById("testing-subtitle");

// SmartPad elements
const smartPadH1 = document.getElementById("smartPad-h1");
const smartPadSubtitle = document.getElementById("smartPad-subtitle");

// Hidden or shown
let isSmartPad = true;
let isTesting = false;
let isContribute = false;
let isSketchBtn = false;

smartPadBtn.onclick = () => {
  if (isSmartPad) return;
  if (isContribute) contributeHide();
  if (isTesting) testingHide();
  if (isSketchBtn) sketchBtnOff();
  smartPadShow();
};

testingBtn.onclick = () => {
  if (isTesting) return;
  if (isContribute) contributeHide();
  if (isSmartPad) smartPadHide();
  if (isSketchBtn) sketchBtnOff();
  testingShow();
};

contributeBtn.onclick = () => {
  if (isContribute) return;
  if (isTesting) testingHide();
  if (isSmartPad) smartPadHide();
  if (isSketchBtn) sketchBtnOff();
  contributeShow();
};

sketchBtn.onclick = () => {
  if (isSketchBtn) {
    sketchBtnOff();
  } else {
    sketchBtnOn();
  }
};

function sketchBtnOff() {
  smartPadContainer.style.display = "none";
  sketchBtn.innerHTML = "SKETCH!";
  sketchBtn.style.backgroundColor = "rgb(170, 32, 142)";
  chart.hideRealTimeDrawing(); // Hides the CSS and dynamic point associated with the drawing on the pad while the pad is closed
  isSketchBtn = false;
}

function sketchBtnOn() {
  smartPadContainer.style.display = "block";
  sketchBtn.innerHTML = "DRAWINGS";
  sketchBtn.style.backgroundColor = "green";
  smartPad.triggerChartUpdate(); // Update chart to the state of last state of the pad which was maintained before closing
  isSketchBtn = true;
}

function smartPadShow() {
  isSmartPad = true;
  sketchBtn.style.display = "block";
  smartPadPage.style.display = "block";

  // Show SmartPad elements
  chartContainer.style.display = "block";
  smartPadH1.style.display = "block";
  smartPadSubtitle.style.display = "block";

  // Update navbar
  smartPadBtn.classList.add("active");
}

function smartPadHide() {
  isSmartPad = false;
  sketchBtn.style.display = "none";
  smartPadPage.style.display = "none";

  // Hide SmartPad elements
  chartContainer.style.display = "none";
  smartPadH1.style.display = "none";
  smartPadSubtitle.style.display = "none";
  smartPadContainer.style.display = "none";

  // Update navbar
  smartPadBtn.classList.remove("active");
}

function testingShow() {
  isTesting = true;
  smartPadPage.style.display = "block";

  // Show testing elements
  decisionContainer.style.display = "block";
  testingH1.style.display = "block";
  testingSubtitle.style.display = "block";

  // Update navbar
  testingBtn.classList.add("active");
}

function testingHide() {
  isTesting = false;
  smartPadPage.style.display = "none";

  // Hide testing elements
  decisionContainer.style.display = "none";
  testingH1.style.display = "none";
  testingSubtitle.style.display = "none";

  // Update navbar
  testingBtn.classList.remove("active");
}

function contributeShow() {
  isContribute = true;
  contributePage.style.display = "block";

  // Update navbar
  contributeBtn.classList.add("active");
}

function contributeHide() {
  isContribute = false;
  contributePage.style.display = "none";

  // Update navbar
  contributeBtn.classList.remove("active");
}
