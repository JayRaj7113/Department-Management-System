import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'sms_dashboard', 
    })
    console.log('MongoDB connected!')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    throw err
  }
}

export default connectDB
