import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseCategory: { type: String, enum: ["PCC", "PEC", "OEC", "LC", "Project", "Internship"], required: true },
  semester: {
    type: String,
    required: true
  },
  credits: { type: Number, required: true },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: false
  }
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
