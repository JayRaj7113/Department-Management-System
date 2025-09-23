'use client'

import { useEffect, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

interface TeacherProfile {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone: number
  age: number
  caste: string
  qualification: string
  department: string
  address?: string
  joinDate?: string
  resumeUrl?: string
  profileImageUrl?: string
  role: string
  classInCharge?: string
  // Password is only for changes
  password?: string
}

export default function ProfileUpdate() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        const res = await fetch('/api/teachers/profile', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (key: keyof TeacherProfile, value: any) => {
    setProfile(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const payload = { ...profile }
      // ensure password is sent only if changed
      if (!payload.password) delete payload.password

      const res = await fetch('/api/teachers/profile', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setSuccess('Profile updated successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile) return <p className="text-gray-500 text-center">Loading...</p>
  if (error && !profile) return <p className="text-red-600 text-center">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Update Profile</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {profile && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['firstName', 'First Name', 'text'],
            ['middleName', 'Middle Name', 'text'],
            ['lastName', 'Last Name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
            ['age', 'Age', 'number'],
            ['caste', 'Caste', 'text'],
            ['qualification', 'Qualification', 'text'],
            ['department', 'Department', 'text'],
            ['address', 'Address', 'text'],
            ['joinDate', 'Join Date', 'date'],
            ['resumeUrl', 'Resume URL', 'url'],
            ['profileImageUrl', 'Profile Image URL', 'url'],
            ['role', 'Role', 'text'],
            ['classInCharge', 'Class In‑Charge', 'text'],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-gray-700 text-sm mb-1">{label}</label>
              <input
                type={type}
                value={profile[key as keyof TeacherProfile] ?? ''}
                onChange={e => handleChange(key as keyof TeacherProfile,
                  type === 'number' ? Number(e.target.value) : e.target.value
                )}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}

          {/* Password Change Section */}
          <div className="md:col-span-2 mt-4 border-t border-gray-200 pt-4">
            <label className="block text-gray-700 text-sm mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={profile.password ?? ''}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-2 text-gray-600 focus:outline-none"
              >
                {showPassword ? (
  <EyeSlashIcon className="h-5 w-5" />
) : (
  <EyeIcon className="h-5 w-5" />
)}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
