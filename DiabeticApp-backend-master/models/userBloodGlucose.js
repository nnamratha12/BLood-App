const mongoose = require("mongoose");

const userBloodGlucoseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mealDate: {
    type: String,
    default: new Date().toLocaleDateString("en-US"),
  },
  mealType: {
    type: String,
    default: "Meal", // Allowed values: 1 for breakfast, 2 for lunch, 3 for dinner
    required: true,
  },
  bloodGlucoseBeforeMeal: {
    type: String,
    required: true,
  },
  bloodglucoseentryTime: {
    type: Date,
    default : new Date().toLocaleString("en-US", {
      timeZone: "America/New_York", // Specify EST timezone
    })
  }
});

userBloodGlucose = mongoose.model("userBloodGlucose", userBloodGlucoseSchema);

module.exports = userBloodGlucose;
