import { model, Schema } from "mongoose";

const drawingsSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    predictedLabel: String,
    correct: Boolean,
    user: String,
    user_id: String,
    features: [Number],

    // comments: [
    //   {
    //     body: String,
    //     username: String,
    //   },
    // ],
  },
  { timestamps: true }
);

export default model("Drawing", drawingsSchema);

// relating to another schema
// user: {
//   type: Schema.Types.ObjectId,
//   ref: 'users'
// }
