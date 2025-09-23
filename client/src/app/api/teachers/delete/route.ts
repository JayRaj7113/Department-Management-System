import dbConnect from '@/utlis/db'
import {Teacher} from '@/models/Teacher'

export async function POST(req: Request) {
  await dbConnect()
  const { id } = await req.json()
  await Teacher.findByIdAndDelete(id)
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
