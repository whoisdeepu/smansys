const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    class: { type: String, required: true },
    feeType: {
      type: String,
      enum: ["Tuition", "Transport", "Library", "Lab", "Sports", "Other"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Annual"],
      default: "Monthly",
    },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
