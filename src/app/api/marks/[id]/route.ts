// app/api/marks/[id]/route.ts
import { NextResponse } from 'next/server'
import connectToDB from '@/utlis/db'
import mongoose from 'mongoose'
import { Marks } from '@/models/Marks'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()

    const studentId = params.id

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    // Step 1: Fetch marks document(s)
    const marksDocs = await Marks.find({ studentId }).lean()

    if (!marksDocs.length) {
      return NextResponse.json({ message: 'No marks found for this student' }, { status: 404 })
    }

    // Step 2: Flatten subjects and marks
    const flattenedMarks = marksDocs.flatMap(doc =>
      doc.subjects.flatMap(subject =>
        Object.entries(subject.marks || {})
          .filter(([_, value]) => value !== null)
          .map(([examType, score]) => ({
            semester: doc.semester,
            subject: subject.name.trim(),
            examType,
            marks: score,
            createdAt: doc.createdAt
          }))
      )
    )

    return NextResponse.json(flattenedMarks, { status: 200 })
  } catch (error) {
    console.error('[GET_MARKS_BY_STUDENT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
