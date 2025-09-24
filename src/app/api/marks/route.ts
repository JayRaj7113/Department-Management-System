// app/api/marks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import { Marks } from '@/models/Marks'

// Define Subject type used in the Marks model
interface Subject {
  name: string;
  marks: Record<string, number>;
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()

  // Support both single object and array
  const entries = Array.isArray(body.data) ? body.data : [body.data]

  try {
    for (const entry of entries) {
      const { studentId, semester, subject, examType, marks } = entry

      if (!studentId || !semester || !subject || !examType || marks == null) {
        continue  // Skip invalid entry
      }

      // 1. Find existing document for student and semester
      let marksDoc = await Marks.findOne({ studentId, semester })

      if (!marksDoc) {
        // Create new document
        marksDoc = await Marks.create({
          studentId,
          semester,
          subjects: [{
            name: subject,
            marks: { [examType]: marks }
          }]
        })
      } else {
        // 2. Check if subject exists
        const subjectIndex = marksDoc.subjects.findIndex((s: Subject) => s.name === subject)

        if (subjectIndex === -1) {
          // Push new subject
          marksDoc.subjects.push({
            name: subject,
            marks: { [examType]: marks }
          })
        } else {
          // Update specific examType
          marksDoc.subjects[subjectIndex].marks[examType] = marks
        }

        await marksDoc.save()
      }
    }

    return NextResponse.json({ message: 'Marks uploaded successfully' }, { status: 200 })
  } catch (error) {
    console.error('[UPLOAD_MARKS_ERROR]', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
