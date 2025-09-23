// /api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      age,
      PRN,
      address,
      caste,
      semester,
      abcId,
      phone,
      year,
      joinDate,
      passoutDate,
      addmissionType,
      profileImage,
    } = body


    // ✅ Basic validation
    // if (
    //   !firstName || !lastName || !email || !password || !age || !caste ||
    //   !semester || !joinDate || !passoutDate || !address || !PRN ||
    //   !addmissionType || !abcId || !phone
    // ) {
    //   return NextResponse.json({ error: 'Please fill all required fields. 1' }, { status: 400 })
    // }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // ✅ Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12)

    // ✅ Create new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      age,
      caste,
      semester,
      abcId,
      phone,
      year,
      joinDate,
      profileImage,
      passoutDate,
      address,
      PRN,
      addmissionType,
      status: 'pending' // default status
    })

    await newUser.save()

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 })
  } catch (error) {
    console.error('Signup Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
