'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<any>(null)
  const [marks, setMarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.get('/api/logout')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const studentRes = await axios.get('/api/students')
        setStudentData(studentRes.data)

        const marksRes = await axios.get('/api/marks/student')
        setMarks(marksRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8 text-xl text-orange-600">Loading...</div>
  if (!studentData) return <div className="p-8 text-red-500">Student not found or session expired.</div>

  // Flatten subjects with their exam types
  const flattenedMarks = marks.flatMap((entry: any) =>
    entry.subjects.flatMap((subject: any) =>
      Object.entries(subject.marks)
        .filter(([_, value]) => value !== null) // Skip null marks
        .map(([examType, score]) => ({
          subject: subject.name.trim(),
          marks: score,
          examType,
          semester: entry.semester
        }))
    )
  )

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gray-100">

      {/* Main Content */}
      <main className="flex-1 md:p-10">
        <h1 className="text-2xl font-semibold text-black mb-8">
          Welcome, {studentData.name} {studentData.lname}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-orange-500">
            <p className="text-gray-500">Total Marks Entries</p>
            <p className="text-3xl font-bold text-gray-800">{flattenedMarks.length}</p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Marks</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Semester</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Subject</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Exam Type</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Marks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {flattenedMarks.map((m, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-gray-800">{m.semester}</td>
                    <td className="px-6 py-4 text-gray-800">{m.subject}</td>
                    <td className="px-6 py-4 text-gray-800">{m.examType}</td>
                    <td className="px-6 py-4 text-gray-800">{m.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
