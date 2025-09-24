// app/api/marks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import { Marks } from '@/models/Marks'
import { verifyToken } from '@/lib/jwt'

interface Subject {
  name: string;
  marks?: Record<string, number | null>;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const url = new URL(req.url)
    const semester = url.searchParams.get('semester')
    const subject = url.searchParams.get('subject')
    const examType = url.searchParams.get('examType')

    const query: any = { studentId: decoded.id }
    if (semester) {
      query.semester = Number(semester)
    }

    // Step 1: Fetch relevant marks document(s)
    const docs = await Marks.find(query)

    if (!docs.length) {
      return NextResponse.json({ message: 'No marks found' }, { status: 404 })
    }

    // Step 2: If no subject or examType filter — return raw docs
    if (!subject && !examType) {
      return NextResponse.json(docs)
    }

    // Step 3: Filter by subject and/or examType
    const filtered = docs.map(doc => {
      const matchedSubjects = (doc.subjects as Subject[]).filter((s: Subject) => {
        return subject ? s.name.trim() === subject.trim() : true
      })

      const projectedSubjects = matchedSubjects.map((s: Subject) => {
        if (examType) {
          return {
            name: s.name,
            marks: {
              [examType]: s.marks?.[examType] ?? null
            }
          }
        }
        return s
      })

      return {
        studentId: doc.studentId,
        semester: doc.semester,
        subjects: projectedSubjects
      }
    })

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('GET Marks Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
