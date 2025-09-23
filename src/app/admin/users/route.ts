// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'
    const users = await User.find({ status })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
