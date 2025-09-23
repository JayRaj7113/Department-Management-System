import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import Student from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface DecodedToken {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const semesterParam = req.nextUrl.searchParams.get('semester')

    // CASE 1: Fetch students by semester
    if (semesterParam) {
      const semester = Number(semesterParam)

      const students = await Student.find({ semester, role: 'student' })
      return NextResponse.json(students)
    }

    // CASE 2: Fetch current logged-in user
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    const student = await Student.findOne({ email: decoded.email })

    if (!student) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      name: student.firstName,
      lname: student.lastName,
      email: student.email,
      semester: student.semester,
      id: student._id,
      // Add other fields if needed
    })
  } catch (error) {
    console.error('GET /api/students Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
