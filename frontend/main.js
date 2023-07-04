// Single page application page change
const smartPadPage = document.getElementById("smartPad");
const contributePage = document.getElementById("contribute");
const testingPage = document.getElementById("testing");

// Navbar
const smartPadBtn = document.getElementById("smartPad-btn");
const contributeBtn = document.getElementById("contribute-btn");
const testingBtn = document.getElementById("testing-btn");
const sketchBtn = document.getElementById("navbar-btn");

smartPadBtn.onclick = () => {
  contributePage.style.display = "none";
  testingPage.style.display = "none";
  sketchBtn.style.display = "block";
  smartPadPage.style.display = "block";
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  smartPadBtn.classList.add("active");
};

contributeBtn.onclick = () => {
  testingPage.style.display = "none";
  sketchBtn.style.display = "none";
  smartPadPage.style.display = "none";
  contributePage.style.display = "block";
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  testingBtn.classList.remove("active");
  contributeBtn.classList.add("active");
};

testingBtn.onclick = () => {
  contributePage.style.display = "none";
  smartPadPage.style.display = "none";
  sketchBtn.style.display = "none";
  testingPage.style.display = "block";
  smartPadBtn.classList.remove("active");
  contributeBtn.classList.remove("active");
  testingBtn.classList.add("active");
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
