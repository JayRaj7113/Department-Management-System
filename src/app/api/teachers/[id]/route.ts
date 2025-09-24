// src/app/api/teachers/[id]/route.ts
import dbConnect from '@/utlis/db'
import { Teacher } from '@/models/Teacher'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 👈 key change: Promise<{ id: string }>
) {
  const { id } = await params                      // 👈 await params
  await dbConnect()

  try {
    await Teacher.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
