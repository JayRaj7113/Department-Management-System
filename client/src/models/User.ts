// /models/User.ts
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  middleName: String,
  lastName: String,
  profileImage: 
  { type: String},
   PRN: String,
  age: Number,
  caste: String,
  semester: String,
  year: Number,
  abcId: String,
  address: String,
  phone: Number,
  addmissionType: { type: String, enum: ['DA', 'Regular'] },
  joinDate: Date,
  passoutDate: Date,
  role: {
    type: String,
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
