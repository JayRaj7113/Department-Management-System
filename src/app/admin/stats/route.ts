import connectDB from "@/utlis/db"
import  User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  await connectDB()
  const total = await User.countDocuments()
  const pending = await User.countDocuments({ status: 'pending' })
  const approved = await User.countDocuments({ status: 'approved' })
  const da = await User.countDocuments({ educationSystem: 'DA' })
  const regular = await User.countDocuments({ educationSystem: 'Regular' })
  return NextResponse.json({ total, pending, approved, da, regular })
}