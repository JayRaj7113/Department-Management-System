// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  // Clear the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  return response
}
