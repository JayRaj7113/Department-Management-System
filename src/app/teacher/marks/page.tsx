'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

const examTypes = [
  { label: 'End Sem', max: 60 },
  { label: 'Mid Sem', max: 20 },
  { label: 'CA1', max: 10 },
  { label: 'CA2', max: 10 }
]

// Move all logic to a separate component
function MarksPageContent() {
  const searchParams = useSearchParams()
  const subjectFromUrl = searchParams.get('subjectId')
  const semesterFromUrl = searchParams.get('semester')

  const [semester, setSemester] = useState<number | null>(
    semesterFromUrl ? Number(semesterFromUrl) : null
  )
  const [subjectId, setSubjectId] = useState(subjectFromUrl || '')
  const [examType, setExamType] = useState('')
  const [maxMarks, setMaxMarks] = useState(0)
  const [students, setStudents] = useState<any[]>([])
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [subjectList, setSubjectList] = useState<any[]>([])

  const selectedSubject = subjectList.find(s => s._id === subjectId)

  useEffect(() => {
    fetch('/api/teachers/subjects')
      .then(res => res.json())
      .then(data => setSubjectList(data || []))
      .catch(() => setSubjectList([]))
  }, [])

  useEffect(() => {
    if (semester) {
      fetch(`/api/students?semester=${semester}`)
        .then(res => res.json())
        .then(data => setStudents(data || []))
        .catch(() => setStudents([]))
    }
  }, [semester])

  useEffect(() => {
    const type = examTypes.find(e => e.label === examType)
    setMaxMarks(type ? type.max : 0)
  }, [examType])

  const getFormattedDateTime = () => {
    const now = new Date()
    return now.toLocaleString()
  }

  const generateExcel = () => {
    const timestamp = getFormattedDateTime()

    const dataToExport = students.map(student => ({
      'Subject Name': selectedSubject?.courseTitle || '',
      'Subject Code': selectedSubject?.courseCode || '',
      'Student Name': `${student.firstName} ${student.middleName || ''} ${student.lastName}`,
      'PRN': student.PRN,
      'Marks': marks[student._id] ?? '',
      'Downloaded At': timestamp
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const fileBlob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(fileBlob, `Marks_${selectedSubject?.courseTitle}_${examType}_Sem${semester}.xlsx`)
  }

  const handleSubmit = async () => {
    const payload = students.map(student => ({
      studentId: student._id,
      semester,
      subject: selectedSubject?.courseTitle,
      examType,
      marks: marks[student._id] || 0
    }))

    await fetch('/api/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    })

    alert('Marks uploaded successfully!')
    generateExcel()
    setMarks({})
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Upload Marks</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Semester Dropdown */}
        <select
          className="border p-2 rounded"
          value={semester ?? ''}
          onChange={(e) => setSemester(Number(e.target.value))}
        >
          <option value="">Select Semester</option>
          {semesters.map(s => (
            <option key={s} value={s}>
              Sem {s}
            </option>
          ))}
        </select>

        {/* Subject Dropdown (Only Assigned Subjects) */}
        <select
          className="border p-2 rounded"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjectList.map(sub => (
            <option key={sub._id} value={sub._id}>
              {sub.courseTitle}
            </option>
          ))}
        </select>

        {/* Exam Type Dropdown */}
        <select
          className="border p-2 rounded"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
        >
          <option value="">Select Exam Type</option>
          {examTypes.map(e => (
            <option key={e.label} value={e.label}>
              {e.label} (Max: {e.max})
            </option>
          ))}
        </select>

        <Button onClick={handleSubmit}>Submit Marks</Button>
        <Button variant="outline" onClick={generateExcel}>
          Export to Excel
        </Button>
      </div>

      {/* Student Table */}
      {students.length === 0 && (
        <p className="text-gray-500">No students to show</p>
      )}

      {students.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">#</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">PRN</th>
                <th className="border p-2">Marks (Max: {maxMarks})</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {`${student.firstName} ${student.middleName || ''} ${student.lastName}`}
                  </td>
                  <td className="border p-2">{student.PRN}</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="w-24"
                      placeholder={`Max: ${maxMarks}`}
                      value={marks[student._id] || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (value <= maxMarks) {
                          setMarks(prev => ({ ...prev, [student._id]: value }))
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Export the page wrapped in Suspense
export default function MarksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarksPageContent />
    </Suspense>
  )
}
