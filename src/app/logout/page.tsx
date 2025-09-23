'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('/api/logout')
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        router.replace('/login')
      }
    }

    logout()
  }, [router])

  return null
}
