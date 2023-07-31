// Used to calculate distance between two points on the chart
function distance(point1, point2) {
  return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

// Used to calculate the k nearest points to the new point on the chart
function getNearest(newPointLoc, points, k = 1) {
  const obj = points.map((val, ind) => {
    return { ind, val };
  });
  const sorted = obj.sort((l, r) => {
    return distance(newPointLoc, l.val) - distance(newPointLoc, r.val);
  });
  const indices = sorted.map((obj) => obj.ind);
  return indices.slice(0, k);
}

function draw(ctx, points, color = "black") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
}
