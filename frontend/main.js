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

smartPadBtn.onclick = () => {
  if (isSmartPad) return;
  isSmartPad = true;
  isTesting = false;
  isContribute = false;

  contributePage.style.display = "none";
  smartPadPage.style.display = "block";

  // Hide testing elements
  decisionContainer.style.display = "none";
  testingH1.style.display = "none";
  testingSubtitle.style.display = "none";
  // Show SmartPad elements
  chartContainer.style.display = "block";
  smartPadH1.style.display = "block";
  smartPadSubtitle.style.display = "block";
  sketchBtn.style.display = "block";

  // Update navbar
  testingBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  smartPadBtn.classList.add("active");
};

testingBtn.onclick = () => {
  if (isTesting) return;
  isTesting = true;
  isContribute = false;
  isSmartPad = false;

  contributePage.style.display = "none";
  smartPadPage.style.display = "block";

  // Hide SmartPad elements
  chartContainer.style.display = "none";
  smartPadH1.style.display = "none";
  smartPadSubtitle.style.display = "none";
  sketchBtn.style.display = "none";
  // Show testing elements
  decisionContainer.style.display = "block";
  testingH1.style.display = "block";
  testingSubtitle.style.display = "block";

  // Update navbar
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  testingBtn.classList.add("active");
};

contributeBtn.onclick = () => {
  if (isContribute) return;
  isContribute = true;
  isTesting = false;
  isSmartPad = false;

  sketchBtn.style.display = "none";
  smartPadPage.style.display = "none";
  contributePage.style.display = "block";

  // Update navbar
  smartPadBtn.classList.remove("active");
  testingBtn.classList.remove("active");
  contributeBtn.classList.add("active");
};

sketchBtn.onclick = () => {
  if (sketchBtn.innerHTML == "SKETCH!") {
    smartPadContainer.style.display = "block";
    sketchBtn.innerHTML = "DRAWINGS";
    sketchBtn.style.backgroundColor = "green";
    smartPad.triggerChartUpdate(); // Update chart to the state of last state of the pad which was maintained before closing
  } else {
    smartPadContainer.style.display = "none";
    sketchBtn.innerHTML = "SKETCH!";
    sketchBtn.style.backgroundColor = "rgb(170, 32, 142)";
    chart.hideRealTimeDrawing(); // Hides the CSS and dynamic point associated with the drawing on the pad while the pad is closed
  }
};
