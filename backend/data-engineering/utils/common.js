// Used to group drawings by the user
export const groupBy = (dataset, key) => {
  const sortedDataset = new Map();
  dataset.forEach((data) => {
    const value = data[key];
    if (!sortedDataset[value]) {
      sortedDataset[value] = [];
    }
    sortedDataset[value].push(data);
  });
  return sortedDataset;
};

export const draw = (ctx, points, color = "black") => {
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
};
