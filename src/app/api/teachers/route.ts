import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import { Teacher } from '@/models/Teacher'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface DecodedToken {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// ✅ GET TEACHER DETAILS BASED ON JWT COOKIE
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    const teacher = await Teacher.findOne({ email: decoded.email }, )
    console.log('Decoded Token:', decoded.email)
    

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: teacher._id,
      name: teacher.firstName,
      lname: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      // Add more fields if needed
    })
  } catch (error) {
    console.error('GET Teacher Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
