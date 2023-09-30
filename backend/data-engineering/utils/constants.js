const constants = {};
constants.RAW_DATA_DIR = "./data/raw";
constants.DATASET_DIR = "./data/dataset";
constants.IMAGES_DIR = "../../frontend/static/images/drawings";
constants.FRONTEND_DATASET_DIR = "../../frontend/static/data";
constants.MODEL = "./data/models/model.json";
constants.MODEL_JS = "./data/models/model.js";

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

constants.CLASSES = [
  "car",
  "clock",
  "fish",
  "house",
  "pencil",
  "tree",
  "bicycle",
  "guitar",
];

constants.flaggedUsers = [];

export default constants;
