// src/app/api/hero-images/route.ts

import { NextResponse } from 'next/server'
import dbConnect from '@/utlis/db'
import {Content} from '@/models/Content'

export async function GET() {
  await dbConnect()
  try {
    const content = await Content.findOne()
    return NextResponse.json({ images: content?.images || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
