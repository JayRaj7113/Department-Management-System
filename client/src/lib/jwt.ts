import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'default_secret' // Put real secret in .env

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string }
  } catch (err) {
    return null
  }
}
