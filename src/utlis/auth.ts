// utils/authMiddleware.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
  } catch (err) {
    return null
  }
}
