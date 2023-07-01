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

    // Handle click to show the corresponding drawing on the chart as well
    drawingContainer.onclick = () => handleDrawingClick(drawingMetaData);
    drawingContainer.classList.add("drawing-container");

    const drawingLabel = document.createElement("div");
    drawingLabel.innerHTML = label;
    drawingContainer.appendChild(drawingLabel);

    const img = document.createElement("img");
    img.src = IMG_DIR + id + ".png";
    img.classList.add("drawing");

    drawingContainer.appendChild(img);
    row.appendChild(drawingContainer);
  }
}

function handleDrawingClick(drawing) {
  // Remove previously selected drawing
  [...document.querySelectorAll(".highlight")].forEach((ele) =>
    ele.classList.remove("highlight")
  );
  if (!drawing) return;
  const drawingContainer = document.getElementById("drawing_" + drawing.id);
  drawingContainer.classList.add("highlight");
  drawingContainer.scrollIntoView({ behavior: "auto", block: "center" });

  chart.selectSample(drawing); // Select drawing on the chart
}
