const mongoose = require("mongoose");

const userMealDateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mealDate: {
    type: String,
    default: new Date().toLocaleDateString("en-US"),
  },
});

userMealDate = mongoose.model("userMealDate", userMealDateSchema);

module.exports = userMealDate;
