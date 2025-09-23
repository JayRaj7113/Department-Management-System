import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  age: Number,
  caste: String,
  qualification: String,
  department: String,
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  phone: Number,
  joinDate: Date,
  resumeUrl: String,
  address: String,
  profileImageUrl: String,
  role: {
    type: String,
    enum: ['Teacher', 'Clerk', 'HOD'],
    default: 'Teacher',
  },
  classInCharge: {
    type: String, // FE, SE, TE, BE
    default: '',
  },
})

export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema)
