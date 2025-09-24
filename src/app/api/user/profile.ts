import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User' // assuming User model already exists

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const {
      firstName,
      middleName,
      lastName,
      semester,
      educationSystem,
      joinDate,
      passoutDate,
      profileImage,
      email // Optional: pass user email if needed to identify
    } = body

    // Validate important fields
    if (!firstName || !lastName || !semester || !educationSystem || !joinDate || !passoutDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update logic – assuming you're using session/user ID in production
    const user = await User.findOneAndUpdate(
      { email }, // or use req.user._id
      {
        $set: {
          firstName,
          middleName,
          lastName,
          semester,
          educationSystem,
          joinDate,
          passoutDate,
          profileImage,
          status: 'pending'
        }
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Profile Update Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
