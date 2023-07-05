RAW_DATA_DIR = "../data/raw";
DATASET_DIR = "../data/dataset";
IMAGES_DIR = DATASET_DIR + "/images";
JSON_DIR = DATASET_DIR + "/json";
NUM_OF_LABELS = 8;
CANVAS_SIZE = 400;

const STYLES = {
  car: { color: "blue", text: "🚙" },
  clock: { color: "red", text: "🕐" },
  fish: { color: "cyan", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  pencil: { color: "magenta", text: "✏" },
  tree: { color: "green", text: "🌴" },
  bicycle: { color: "red", text: "🚴" },
  guitar: { color: "lightgray", text: "🎸" },
};

module.exports = {
  RAW_DATA_DIR,
  DATASET_DIR,
  IMAGES_DIR,
  JSON_DIR,
  NUM_OF_LABELS,
  CANVAS_SIZE,
  STYLES,
};
