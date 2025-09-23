  //Contents model

  import mongoose from 'mongoose'
 const ConstentSchema = new mongoose.Schema({
  images: [String], // 👈 array of image URLs
  AboutUs: String,
  Mission: String,
  Vision: String,
  OurLegacy: String,
  PLacementRecords: String,
  Acheivements: String,
  Events: String,
})
export const Content = mongoose.models.Content || mongoose.model('Content', ConstentSchema)