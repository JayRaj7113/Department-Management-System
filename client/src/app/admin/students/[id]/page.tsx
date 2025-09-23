'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type User = {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  profileImage?: string
  PRN: string
  age?: number
  caste?: string
  semester?: string
  year?: number
  abcId?: string
  address?: string
  phone?: number
  addmissionType: 'DA' | 'Regular'
  joinDate?: string
  passoutDate?: string
  role: string
  status: 'pending' | 'approved'
  createdAt?: string
}

type Mark = {
  subject: string
  marks: number
  examType?: string
  createdAt?: string
}

export default function StudentDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [student, setStudent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [marks, setMarks] = useState<Mark[]>([])
  const [marksLoading, setMarksLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchStudent()
      fetchMarks()
    }
  }, [id])

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()

      if (res.ok) {
        setStudent(data)
      } else {
        toast.error(data.error || 'Student not found')
      }
    } catch (error) {
      toast.error('Failed to fetch student details')
    } finally {
      setLoading(false)
    }
  }

  const fetchMarks = async () => {
    try {
      const res = await fetch(`/api/marks/${id}`)
      const data = await res.json()

      if (res.ok) {
        setMarks(data)
      } else {
        toast.error(data.error || 'Marks not found')
      }
    } catch (error) {
      toast.error('Failed to fetch marks')
    } finally {
      setMarksLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  if (!student) {
    return <div className="p-8 text-center text-red-500">Student not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-orange-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-600">🎓 Student Profile</h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-orange-500 hover:underline"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col items-center">
            <img
              src={student.profileImage || '/images/NA.png'}
              alt="Profile"
              className="w-36 h-36 rounded-full border border-gray-300 object-cover shadow-sm"
            />
            <p className="mt-4 text-lg font-semibold text-gray-800">
              {student.firstName} {student.middleName} {student.lastName}
            </p>
            <span
              className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${
                student.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {student.status.toUpperCase()}
            </span>
          </div>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <Field label="Email" value={student.email} />
            <Field label="PRN" value={student.PRN} />
            <Field label="Phone" value={student.phone?.toString() || 'N/A'} />
            <Field label="Age" value={student.age?.toString() || 'N/A'} />
            <Field label="Caste" value={student.caste || 'N/A'} />
            <Field label="Semester" value={student.semester || 'N/A'} />
            <Field label="Year" value={student.year?.toString() || 'N/A'} />
            <Field label="ABC ID" value={student.abcId || 'N/A'} />
            <Field label="Address" value={student.address || 'N/A'} />
            <Field label="Admission Type" value={student.addmissionType} />
            <Field label="Join Date" value={formatDate(student.joinDate)} />
            <Field label="Passout Date" value={formatDate(student.passoutDate)} />

            <div className="col-span-full mt-6 text-right">
              <p className="text-xs text-gray-400">
                Created on: {formatDate(student.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="max-w-5xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">📊 Marks</h2>

        {marksLoading ? (
          <p className="text-sm text-gray-500">Loading marks...</p>
        ) : marks.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No marks data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead>
                <tr className="bg-orange-100 text-orange-700">
                  <th className="py-2 px-4 border">Subject</th>
                  <th className="py-2 px-4 border">Marks</th>
                  <th className="py-2 px-4 border">Exam</th>
                  <th className="py-2 px-4 border">Uploaded Date</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="py-2 px-4 border">{mark.subject || 'N/A'}</td>
                    <td className="py-2 px-4 border">{mark.marks}</td>
                    <td className="py-2 px-4 border">{mark.examType || 'N/A'}</td>
                    <td className="py-2 px-4 border">{formatDate(mark.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  )
}

function formatDate(date?: string) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
