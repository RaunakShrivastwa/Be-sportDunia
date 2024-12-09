import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  source: { type: String, enum: ["Direct", "Indirect"], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Earnings", earningsSchema);
