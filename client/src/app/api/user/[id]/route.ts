import { NextResponse } from 'next/server'
import connectToDB from '@/utlis/db' // adjust path based on your setup
import Student from '@/models/User' // your Mongoose model

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params is async now
) {
  try {
    await connectToDB()

    const { id: studentId } = await params  // Await params here

    const student = await Student.findById(studentId).lean()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student, { status: 200 })
  } catch (error) {
    console.error('[GET_STUDENT_BY_ID]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
