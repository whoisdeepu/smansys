const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, default: "A" },
    parentName: { type: String },
    parentEmail: { type: String, required: true, lowercase: true, trim: true },
    parentPhone: { type: String },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

studentSchema.index({ rollNumber: 1, school: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
