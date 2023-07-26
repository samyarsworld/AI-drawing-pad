const flaggedDrawings = [];

function flagDrawing(drawing) {
  if (flaggedDrawings.includes(drawing.id)) {
    const indx = flaggedDrawings.indexOf(drawing.id);
    flaggedDrawings.splice(indx, 1);
  } else {
    flaggedDrawings.push(drawing.id);
  }

  [...document.querySelectorAll(".flagged")].forEach((e) =>
    e.classList.remove("flagged")
  );

  for (const id of flaggedDrawings) {
    const el = document.getElementById("sample_" + id);
    el.classList.add("flagged");
  }
}
