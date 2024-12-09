import User from "../model/User.js";
import Earnings from "../model/Earning.js";
import { validatePurchase } from "../config/validatePurchase.js";

export const handlePurchase = async (req, res) => {
  const { userId, amount } = req.body;

  if (!validatePurchase(amount)) {
    return res
      .status(400)
      .json({ message: "Purchase does not meet criteria." });
  }

  try {
    const user = await User.findById(userId).populate("referredBy");
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const earnings = [];
    let parent = user.referredBy;

    // Direct earnings (5%)
    if (parent) {
      const directEarning = (amount * 5) / 100;
      parent.earnings += directEarning;
      earnings.push({
        user: parent._id,
        amount: directEarning,
        source: "Direct",
      });
      await parent.save();
       req.io.emit("direct", {
         earnings: directEarning,
         userId: parent.id,
       });
    }

    // Indirect earnings (1%)
    if (parent && parent.referredBy) {
      const grandparent = await User.findById(parent.referredBy);
      if (grandparent) {
        const indirectEarning = (amount * 1) / 100;
        grandparent.earnings += indirectEarning;
        earnings.push({
          user: grandparent._id,
          amount: indirectEarning,
          source: "Indirect",
        });
        await grandparent.save();
         req.io.emit("indirect", {
           earnings: indirectEarning,
           userId: grandparent.id,
         });
      }
    }

    // Save earnings records
    if (earnings.length > 0) {
      await Earnings.insertMany(earnings);
      console.log("Earnings distributed:", earnings);
    }

    res.status(200).json({ message: "Earnings distributed successfully!" });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res
      .status(500)
      .json({ message: "Error processing purchase.", error: error.message });
  }
};
