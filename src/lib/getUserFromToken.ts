import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function getUserFromToken() {
  const token = (await cookies()).get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
