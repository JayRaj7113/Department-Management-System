// app/api/teachers/all/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import { Teacher } from '@/models/Teacher'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface DecodedToken {
  email: string
  role: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    

    const teachers = await Teacher.find({ role: 'Teacher' })

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('Error fetching all teachers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
