import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'

// PATCH /api/user/decision/[id]
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = context.params
    const { status } = await req.json()

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

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
