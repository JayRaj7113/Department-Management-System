'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface TeacherInfo {
  id: string
  name: string
  lname: string
  email: string
  phone: string
}

export default function TeacherDashboard() {
  const [assignedSubjects, setAssignedSubjects] = useState<any[]>([])
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const teacherRes = await axios.get('/api/teachers')
        setTeacherInfo(teacherRes.data)

        const subjectsRes = await axios.get('/api/teachers/subjects')
        setAssignedSubjects(subjectsRes.data)
      } catch (error) {
        console.error('Error fetching teacher or subject data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSubjectClick = (subject: any) => {
    router.push(`/teacher/marks?subjectId=${subject._id}&semester=${subject.semester}`)
  }

  return (
    <div className="text-gray-900 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {teacherInfo?.name || 'Teacher'}</h1>
        <p className="text-gray-500">{teacherInfo?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border-l-4 border-orange-500 rounded-xl shadow p-6">
          <h2 className="text-sm text-gray-500">Assigned Subjects</h2>
          <p className="text-3xl font-bold text-orange-600">{assignedSubjects.length}</p>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        {assignedSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {assignedSubjects.map(sub => (
              <div
                key={sub._id}
                onClick={() => handleSubjectClick(sub)}
                className="rounded-lg cursor-pointer p-4 border bg-white hover:shadow-md hover:border-orange-300 transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">{sub.courseTitle}</h3>
                <p className="text-sm text-gray-500">Semester: {sub.semester}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subjects assigned.</p>
        )}
      </section>
    </div>
  )
}
