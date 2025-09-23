import dbConnect from '@/utlis/db'
import {Teacher} from '@/models/Teacher'

export async function POST(req: Request) {
  await dbConnect()
  const { id, role, classInCharge } = await req.json()
  await Teacher.findByIdAndUpdate(id, { role, classInCharge: classInCharge || '' })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
