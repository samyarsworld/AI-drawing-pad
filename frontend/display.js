const container = document.getElementById("drawingsContainer");

function createRow(userName, metaData) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerHTML = userName;
  rowLabel.classList.add("row-label");
  row.appendChild(rowLabel);

  for (const drawingMetaData of metaData) {
    const { id, label } = drawingMetaData;

    const drawingContainer = document.createElement("div");
    drawingContainer.id = "drawing_" + id;
    drawingContainer.onclick = () => handleClick(drawingMetaData);
    drawingContainer.classList.add("drawing-container");

    const drawingLabel = document.createElement("div");
    drawingLabel.innerHTML = label;
    drawingContainer.appendChild(drawingLabel);

    const img = document.createElement("img");
    img.src = "../data/dataset/images/" + id + ".png";
    img.classList.add("drawing");

    drawingContainer.appendChild(img);

    row.appendChild(drawingContainer);
  }
}

function handleClick(drawing) {
  // Remove previously selected drawing
  [...document.querySelectorAll(".highlight")].forEach((ele) =>
    ele.classList.remove("highlight")
  );
  if (!drawing) return;
  const drawingContainer = document.getElementById("drawing_" + drawing.id);
  drawingContainer.classList.add("highlight");
  drawingContainer.scrollIntoView({ behavior: "auto", block: "center" });

  chart.selectSample(drawing);
}
