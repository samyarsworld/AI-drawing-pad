const container = document.getElementById("container");

function createRow(userName, metaData) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerHTML = userName;
  rowLabel.classList.add("row-label");
  row.appendChild(rowLabel);

  const drawingsContainer = document.createElement("div");
  drawingsContainer.classList.add("drawings-container");
  row.appendChild(drawingsContainer);

  for (const data of metaData) {
    const { id, label } = data;

    const drawingContainer = document.createElement("div");
    drawingContainer.id = "drawing_" + id;
    drawingContainer.classList.add("drawing-container");

    const drawingLabel = document.createElement("div");
    drawingLabel.innerHTML = label;
    drawingContainer.appendChild(drawingLabel);

    const img = document.createElement("img");
    img.src = "../data/dataset/images/" + id + ".png";
    img.classList.add("drawing");

    drawingContainer.appendChild(img);

    drawingsContainer.appendChild(drawingContainer);
  }
}
