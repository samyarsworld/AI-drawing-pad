// Used to group drawings by the user
function groupBy(dataset, key) {
  const sortedDataset = new Map();
  dataset.forEach((data) => {
    const value = data[key];
    if (!sortedDataset[value]) {
      sortedDataset[value] = [];
    }
    sortedDataset[value].push(data);
  });
  return sortedDataset;
}

module.exports = { groupBy };
