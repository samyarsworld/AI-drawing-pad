import Drawing from "../models/drawingsModel.js";

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
    addNewDrawings: async (parent, args) => {
      return "hello mutated worlds";
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
