import { NextResponse } from 'next/server'
import connectDB from '@/utlis/db'
import User from '@/models/User'
import { Teacher } from '@/models/Teacher'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    await connectDB()

    let account = await User.findOne({ email })
    let role = 'student'
    if(account.status !== 'approved'){
      return NextResponse.json({ error: 'Your account is not approved yet.' }, { status: 403 })
    }

    if (!account) {
      account = await Teacher.findOne({ email })
      role = account.role
    }

    if (!account) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password)
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    const token = jwt.sign(
      {
        userId: account.id,
        email: account.email,
        role: role ,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      {
        message: 'Login successful.',
        user: {
          id: account._id,
          name: `${account.firstName || ''} ${account.lastName || ''}`.trim(),
          email: account.email,
          role: role,
        },
      },
      { status: 200 }
    )

    // Set JWT in HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
