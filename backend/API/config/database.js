import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});

const databaseConnect = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }) // Add the options to avoid depreciation error
    .then(() => console.log("Connected to Mongo Atlas"))
    .catch((err) => {
      console.error("Failed to connect with Mongo Atlas");
      console.error(err);
    });
};

export default databaseConnect;
