import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import Subject from '@/models/Subject'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface DecodedToken {
  userId: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 })
    }

    let decoded: DecodedToken
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    // Convert string userId to MongoDB ObjectId
    const teacherId = new mongoose.Types.ObjectId(decoded.userId)

    const subjects = await Subject.find({ assignedTeacher: teacherId })

    return NextResponse.json(subjects)
    
  } catch (error) {
    console.error('GET Subjects Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
