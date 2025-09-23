// /app/api/user/all/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({ status: 'approved' })
    return NextResponse.json(users, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching all users:', error.message)
    return NextResponse.json({ error: 'Failed to fetch all users' }, { status: 500 })
  }
}
