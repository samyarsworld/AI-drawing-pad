import Drawing from "../models/drawingsModel.js";
import ff from "../../data-engineering/utils/featureFunctions.js";
import classify from "../../data-engineering/utils/classifiers.js";

import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./data-engineering/data/dataset/dataset.json")
);
const minmax = JSON.parse(
  fs.readFileSync("./data-engineering/data/dataset/minmax.json")
);

export const resolvers = {
  Query: {
    drawings: async () => {
      try {
        const allDrawings = await Drawing.find({});
        return allDrawings;
      } catch (error) {
        throw new Error(`Error fetching drawing: ${error.message}`);
      }
    },
    drawing: async (parent, args) => {
      try {
        const drawing = await Drawing.findById(args.id);
        return drawing;
      } catch (error) {
        throw new Error(`Error fetching drawing: ${error.message}`);
      }
    },
  },
  Mutation: {
    addNewUserDrawings: async (parent, args) => {
      const activeFeatureFunctions = ff.active.map((f) => f.function);
      const classifier = "KNN";

      const { user_id, user, newDrawings } = args.newUserDrawings;

      for (let label in newDrawings) {
        const features = activeFeatureFunctions.map((f) =>
          f(newDrawings[label])
        );

        // Normalize features
        for (let i = 0; i < features.length; i++) {
          features[i] =
            (features[i] - minmax.min[i]) / (minmax.max[i] - minmax.min[i]);
        }

        const { label: predictedLabel } = classify(classifier, data, features);

        const drawing = new Drawing({
          label: label,
          predictedLabel: predictedLabel,
          correct: predictedLabel == label,
          user: user,
          user_id: user_id,
          features: features,
        });

        const savedDrawing = await drawing.save();
        if (savedDrawing) {
          drawing.id = savedDrawing._id;
          fs.writeFileSync(
            "./data-engineering/data/dataset/json/" +
              savedDrawing._id +
              ".json",
            JSON.stringify(drawing)
          );
        } else {
          console.log("Something went wrong when saving the object on Mongo");
          break;
        }
      }

      return "Everything went as requested! Your drawings are live now.";
    },
  },
};

// Example of creating a new drawing
// const newDrawing = new Drawing({
//   label: "meh",
//   predictedLabel: "predictedValue",
//   correct: true,
//   user: "sam",
//   user_id: "userIdValue",
//   features: [1, 2, 3], // Example array of numbers
// });

// newDrawing
//   .save()
//   .then((savedDrawing) => {
//     console.log("Drawing saved:", savedDrawing);
//   })
//   .catch((error) => {
//     console.error("Error saving drawing:", error);
//   });
