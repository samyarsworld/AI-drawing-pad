import { model, Schema } from "mongoose";

const rawDrawingsSchema = new Schema({
  user_id: String,
  user: String,
  userDrawings: Schema.Types.Mixed,
});

export default model("RawDrawing", rawDrawingsSchema);
