'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaLock, FaUser } from 'react-icons/fa'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !password) {
      return toast.error('All fields are required')
    }

    if (!emailRegex.test(email)) {
      return toast.error('Enter a valid email address')
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Login successful!')

        const role = data?.user?.role?.trim() || ''

        localStorage.setItem('userRole', role)

        // Redirect according to role
        switch (role) {
          case 'student':
            router.push('/student')
            break
          case 'Teacher':
            router.push('/teacher')
            break
          case 'clerk':
            router.push('/clerk')
            break
          case 'hod':
            router.push('/admin')
            break
          default:
            toast.error('Unknown user role')
            break
        }
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side Image */}
      <div className="h-80 md:h-auto md:flex md:w-1/2 bg-gradient-to-br from-orange-100 to-yellow-50 items-center justify-center px-7">
        <Image
          src="/images/teacher.png"
          alt="Login Image"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center px-7 py-12">
        <motion.div
          className="w-full max-w-md bg-white rounded-xl p-8 md:p-10 shadow-2xl border border-orange-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
            Login to Your Account
          </h1>

          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3.5 text-orange-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="mb-6 relative">
            <FaLock className="absolute left-3 top-3.5 text-orange-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white font-semibold py-3 rounded-lg"
          >
            Login
          </button>

          <p className="text-center mt-5 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-orange-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
