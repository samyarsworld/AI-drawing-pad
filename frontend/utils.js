function groupBy(dataset, key) {
  const sortedDataset = [];
  for (const data of dataset) {
    const value = data[key];
    if (!sortedDataset[value]) {
      sortedDataset[value] = [];
    }
    sortedDataset[value].push(data);
  }
  return sortedDataset;
}
