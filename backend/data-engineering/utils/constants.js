const constants = {};
constants.RAW_DATA_DIR = "../data/raw";
constants.DATASET_DIR = "../data/dataset";
constants.IMAGES_DIR = constants.DATASET_DIR + "/images";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.NUM_OF_LABELS = 8;
constants.CANVAS_SIZE = 400;
constants.classifier = "KNN";

constants.STYLES = {
  car: { color: "blue", text: "🚙" },
  clock: { color: "lightgray", text: "🕐" },
  fish: { color: "cyan", text: "🐟" },
  house: { color: "orange", text: "🏠" },
  pencil: { color: "magenta", text: "✏" },
  tree: { color: "green", text: "🌴" },
  bicycle: { color: "yellow", text: "🚴" },
  guitar: { color: "red", text: "🎸" },
};

constants.flaggedUsers = [];

module.exports = constants;
