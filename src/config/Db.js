import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.DB_URL);

const DB = mongoose.connection;
DB.on("error", (err) => {
  console.log("There is Error", err);
});

DB.on("open", () => {
  console.log("DB connected");
});

export default DB;
