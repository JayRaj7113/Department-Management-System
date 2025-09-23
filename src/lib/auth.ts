// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/User' // Assuming you have a Mongoose model
import bcrypt from 'bcryptjs'
import connectDB from '@/utlis/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()

        if (!credentials?.email || !credentials?.password) return null

        const user = await User.findOne({ email: credentials.email })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login', // Make sure this page exists
  },
  secret: process.env.NEXTAUTH_SECRET,
}
