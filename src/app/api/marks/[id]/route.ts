import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { Marks } from '@/models/Marks'
import connectDB from '@/utlis/db'

interface SubjectMark {
  name: string
  marks: Record<string, number | null>
}

interface MarksDoc {
  semester: number
  subjects: SubjectMark[]
  createdAt: Date
}

export async function GET(req: Request) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/')
    const studentId = pathSegments[pathSegments.length - 1]

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    const marksDocsRaw = await Marks.find({ studentId }).lean()
    // Cast via unknown to silence TS error
    const marksDocs = marksDocsRaw as unknown as MarksDoc[]

    if (!marksDocs.length) {
      return NextResponse.json({ message: 'No marks found for this student' }, { status: 404 })
    }

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
