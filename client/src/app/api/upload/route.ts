// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import cloudinary from '@/utlis/cloudinary'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'user_profiles' }, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    }).end(buffer)
  })

  return NextResponse.json({ success: true, data: uploadResult })
}
