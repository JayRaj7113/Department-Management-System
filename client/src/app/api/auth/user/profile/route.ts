// app/api/user/profile/route.ts
import connectDB from '@/utlis/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  await connectDB()
  const body = await req.json()
  const { email, firstName, lastName, semester, educationSystem, joinDate, passoutDate } = body

  const user = await User.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      semester,
      educationSystem,
      joinDate,
      passoutDate
    },
    { new: true }
  )

  return NextResponse.json({ message: 'Profile updated', user })
}
