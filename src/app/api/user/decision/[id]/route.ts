// src/app/api/user/decision/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'       // ✅ also fix the typo “utlis” → “utils”
import User from '@/models/User'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ params is a Promise
) {
  await connectDB()

  const { id } = await params                      // ✅ await the params
  const { status } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    if (status === 'approved') {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
      )
      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ message: 'User approved' })
    }

    if (status === 'rejected') {
      const deletedUser = await User.findByIdAndDelete(id)
      if (!deletedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ message: 'User rejected and deleted' })
    }
  } catch (error) {
    console.error('Decision Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
