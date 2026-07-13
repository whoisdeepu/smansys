const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    subject: { type: String, required: true },
    qualification: { type: String },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

// A teacher email should be unique within a given school (not globally,
// since two different schools could coincidentally import the same row)
teacherSchema.index({ email: 1, school: 1 }, { unique: true });

module.exports = mongoose.model("Teacher", teacherSchema);
