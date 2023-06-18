const { drawingsMetaData, featuresNames } = features;
const sortedMetaData = groupBy(drawingsMetaData, "user_id");

for (const user_id in sortedMetaData) {
  const metaData = sortedMetaData[user_id];
  const user = metaData[0].user;
  createRow(user, metaData);
}

graphics.generateImages(styles);

const options = {
  size: 400,
  axisLabels: featuresNames,
  styles: styles,
  transparency: 0.7,
  icon: "text",
};

const chart = new Chart(chartContainer, drawingsMetaData, options, handleClick);

const smartPad = new Pad(smartPadContainer, (size = 400), drawingUpdate);

function drawingUpdate(drawing) {
  const feature = [drawing.length, drawing.flat().length];
  chart.showRealTimeDrawing(feature);
}
