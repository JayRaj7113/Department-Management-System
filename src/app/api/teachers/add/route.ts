import dbConnect from '@/utlis/db'
import { Teacher } from '@/models/Teacher'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  await dbConnect()

  try {
    const data = await req.json()
    const { email, firstName, lastName, password, phone } = data

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !phone) {
      return new Response(JSON.stringify({ success: false, message: 'Missing required fields' }), { status: 400 })
    }

    // Check if teacher with same email already exists
    const existingTeacher = await Teacher.findOne({ email })
    if (existingTeacher) {
      return new Response(JSON.stringify({ success: false, message: 'Teacher with this email already exists' }), { status: 409 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare and save teacher data
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword
    })

    await newTeacher.save()

    return new Response(JSON.stringify({ success: true, teacher: newTeacher }), { status: 200 })
  } catch (error) {
    console.error('Error adding teacher:', error)
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 })
  }
}
