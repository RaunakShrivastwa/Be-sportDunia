import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  earnings: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
export default User;
