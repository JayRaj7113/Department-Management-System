// app/api/user/pending/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()

    const pendingUsers = await User.find({ status: 'pending' })

    return NextResponse.json(pendingUsers, { status: 200 })
  } catch (error) {
    console.error('Pending User Fetch Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
