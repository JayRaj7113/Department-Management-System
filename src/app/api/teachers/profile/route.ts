import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dbConnect from '@/utlis/db'
import { Teacher } from '@/models/Teacher'

const verifyToken = (req: NextRequest) => {
  const token = req.cookies.get('token')?.value
  if (!token) throw new Error('Token not found')

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not configured')

  return jwt.verify(token, secret) as { userId: string; email: string }
}

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const decoded = verifyToken(req)
    const teacher = await Teacher.findOne({ _id: decoded.userId, email: decoded.email })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: teacher._id.toString(),
      firstName: teacher.firstName,
      middleName: teacher.middleName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      age: teacher.age,
      caste: teacher.caste,
      qualification: teacher.qualification,
      department: teacher.department,
      address: teacher.address,
      joinDate: teacher.joinDate,
      resumeUrl: teacher.resumeUrl,
      profileImageUrl: teacher.profileImageUrl,
      role: teacher.role,
      classInCharge: teacher.classInCharge,
      password: teacher.password, // WARNING: send only if secure and hashed
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const decoded = verifyToken(req)
    const body = await req.json()

    const updateData: Record<string, any> = {
  firstName: body.firstName,
  middleName: body.middleName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      age: body.age,
      caste: body.caste,
      qualification: body.qualification,
      department: body.department,
      address: body.address,
      joinDate: body.joinDate,
      resumeUrl: body.resumeUrl,
      profileImageUrl: body.profileImageUrl,
      role: body.role,
      classInCharge: body.classInCharge,
    }

    // Only hash and update password if it's changed
    if (body.password && body.password !== '') {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      updateData['password'] = hashedPassword
    }

    const updated = await Teacher.findOneAndUpdate(
      { _id: decoded.userId, email: decoded.email },
      { $set: updateData },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Teacher not found or update failed' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
