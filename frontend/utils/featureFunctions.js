// Feature functions
function getDrawingSegmentCount(drawing) {
  return drawing.length;
}

function getDrawingPointCount(drawing) {
  return drawing.flat().length;
}

function getDrawingWidth(drawing) {
  const allPoints = drawing.flat();
  const allX = allPoints.map((p) => p[0]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  return maxX - minX;
}

function getDrawingHeight(drawing) {
  const allPoints = drawing.flat();
  const allY = allPoints.map((p) => p[1]);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  return maxY - minY;
}
