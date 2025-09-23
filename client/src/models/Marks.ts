// models/Marks.ts
import mongoose from 'mongoose'

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: {
    CA1: { type: Number, default: null },
    CA2: { type: Number, default: null },
    'Mid Sem': { type: Number, default: null },
    'End Sem': { type: Number, default: null }
  }
}, { _id: false })

const MarksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  subjects: [SubjectSchema]
}, { timestamps: true })

export const Marks = mongoose.models.Marks || mongoose.model('Marks', MarksSchema)
