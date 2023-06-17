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

const styles = {
  car: { color: "gray", text: "🚙" },
  ball: { color: "red", text: "🏀" },
  fish: { color: "blue", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  pen: { color: "magenta", text: "✏" },
  box: { color: "brown", text: "🥡" },
  phone: { color: "cyan", text: "📱" },
  tree: { color: "green", text: "🌴" },
  hat: { color: "purple", text: "🎩" },
  person: { color: "lightgray", text: "🧍" },
};
