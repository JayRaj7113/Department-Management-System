'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { toast } from 'react-hot-toast'

type StudentUser = {
  _id: string
  name: string
  email: string
  semester?: string
  educationSystem?: string
  status: 'pending' | 'approved' | 'rejected'
}

type StudentStat = {
  year: number
  passed: number
  failed: number
}

export default function AdminHome() {
  const [allUsers, setAllUsers] = useState<StudentUser[]>([])
  const [pendingUserList, setPendingUserList] = useState<StudentUser[]>([])
  const [studentStats, setStudentStats] = useState<StudentStat[]>([])

  const totalStudents = allUsers.length
  const pendingUsers = pendingUserList.filter((u) => u.status === 'pending')
  const approvedStudents = allUsers.filter((u) => u.status === 'approved')

  useEffect(() => {
    fetchAllUsers()
    fetchPendingUsers()
    fetchStudentStats()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/user/all')
      const data = await res.json()
      if (res.ok) {
        setAllUsers(data)
      } else {
        toast.error(data.error || 'Failed to load students')
      }
    } catch (err) {
      toast.error('Failed to connect to server')
      console.error(err)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/user/pending')
      const data = await res.json()
      if (res.ok) {
        setPendingUserList(data)
      } else {
        toast.error(data.error || 'Failed to load pending users')
      }
    } catch (err) {
      toast.error('Failed to connect to server')
      console.error(err)
    }
  }

  const fetchStudentStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (res.ok) {
        setStudentStats(data.stats || [])
      } else {
        toast.error(data.error || 'Failed to load stats')
      }
    } catch (err) {
      toast.error('Failed to connect to stats server')
      console.error(err)
    }
  }

  return (
    <div className="space-y-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Welcome, HOD</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-orange-400">
          <p className="text-gray-600">Total Students</p>
          <h2 className="text-3xl font-bold text-gray-800">{totalStudents}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-400">
          <p className="text-gray-600">Pending Approvals</p>
          <h2 className="text-3xl font-bold text-gray-800">{pendingUsers.length}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-400">
          <p className="text-gray-600">Approved</p>
          <h2 className="text-3xl font-bold text-gray-800">{approvedStudents.length}</h2>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Yearly Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="#34d399" name="Passed" />
            <Bar dataKey="failed" fill="#f87171" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
