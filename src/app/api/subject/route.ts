import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import Subject from '@/models/Subject'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const semester = searchParams.get('semester') // e.g., 'semester5'

    const filter: any = {}

    // Apply semester filter if present and not 'all'
    if (semester && semester !== 'all') {
      filter.semester = semester
    }

    const subjects = await Subject.find(filter)
    return NextResponse.json(subjects, { status: 200 })

  } catch (error: any) {
    console.error('Error fetching subjects:', error.message)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const subject = new Subject(body)
    await subject.save()
    return NextResponse.json(subject)
  } catch (error) {
    console.error('POST Subject Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
