import dbConnect from '@/utlis/db'
import { Teacher } from '@/models/Teacher'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  try {
    await Teacher.findByIdAndDelete(params.id)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ success: false }), { status: 500 })
  }
}
