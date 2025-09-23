import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import { Marks } from '@/models/Marks'

export async function DELETE(req: NextRequest) {
  await connectDB()
  const { studentId, semester, subject, examType } = await req.json()

  try {
    await Marks.updateOne(
      { studentId, semester, 'marks.subject': subject },
      { $unset: { [`marks.$.${examType}`]: '' } }
    )
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error('Delete mark error', err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
