const mongoose = require("mongoose");

const feeReminderLogSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    parentEmail: { type: String, required: true },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      required: true,
    },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeReminderLog", feeReminderLogSchema);
