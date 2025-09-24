'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Menu } from 'lucide-react'
import toast from 'react-hot-toast'

type Teacher = {
  _id?: string
  firstName?: string
  middleName?: string
  lastName?: string
  age?: number
  caste?: string
  qualification?: string
  department?: string
  joinDate?: string
  resumeUrl?: string
  address?: string
  profilePicUrl?: string
  email?: string
  phone?: string
  role?: 'Teacher' | 'Clerk' | 'HOD'
  classInCharge?: string
  password?: string
}

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Teacher>(initialFormState())
  const [editModeId, setEditModeId] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function initialFormState(): Teacher {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      age: undefined,
      caste: '',
      qualification: '',
      department: '',
      joinDate: '',
      resumeUrl: '',
      address: '',
      profilePicUrl: '',
      email: '',
      phone: '',
      role: 'Teacher',
      classInCharge: '',
      password: '',
    }
  }

  useEffect(() => {
    fetch('/api/teachers/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.teachers)) {
          setTeachers(data.teachers)
        } else {
          console.warn('Unexpected data format from /api/teachers/all')
        }
      })
      .catch(err => console.error('Failed to fetch teachers:', err))
  }, [])

  const handleSubmit = async () => {
    const { firstName, lastName, email, password, phone } = formData

    if (!firstName || !lastName || !email || !password || !phone) {
      return toast.error('Please fill out all required fields: First Name, Last Name, Email, Phone, and Password.')
    }

    const res = await fetch('/api/teachers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      const result = await res.json()
      setTeachers(prev => [...prev, result])
      resetForm()
    } else {
      return toast.error('Error submitting teacher data')
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setFormData(teacher)
    setEditModeId(teacher._id || null)
    setShowForm(true)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    const confirm = window.confirm('Are you sure you want to delete this teacher?')
    if (!confirm) return

    const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setTeachers(prev => prev.filter(t => t._id !== id))
    } else {
      alert('Failed to delete teacher')
    }
  }

  const resetForm = () => {
    setFormData(initialFormState())
    setEditModeId(null)
    setShowForm(false)
  }

  return (
    <div className="p-4">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <Button variant="primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }} className="text-2xl px-4 py-1">
          {showForm ? '×' : '+'}
        </Button>
      </div>

      {/* Mobile Sidebar/Toggle Form */}
      {sidebarOpen && (
        <div className="md:hidden mb-4">
          <Button onClick={() => { resetForm(); setShowForm(!showForm); setSidebarOpen(false) }}>
            {showForm ? 'Close Form' : 'Add Teacher'}
          </Button>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl mb-3">{editModeId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="First Name*" value={formData.firstName || ''} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            <Input placeholder="Middle Name" value={formData.middleName || ''} onChange={e => setFormData({ ...formData, middleName: e.target.value })} />
            <Input placeholder="Last Name*" value={formData.lastName || ''} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
            <select className='border p-2 rounded' value={formData.caste || ''} onChange={e => setFormData({ ...formData, caste: e.target.value })}>
              <option value="">Select Caste</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="NT">NT</option>
            </select>
            <Input type="number" placeholder="Age" value={formData.age || ''} onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} />
            <Input placeholder="Qualification" value={formData.qualification || ''} onChange={e => setFormData({ ...formData, qualification: e.target.value })} />
            <Input placeholder="Department" value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} />
            <Input placeholder="Email*" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input type="password" placeholder="Password*" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Join Date</label>
              <Input type="date" value={formData.joinDate || ''} onChange={e => setFormData({ ...formData, joinDate: e.target.value })} />
            </div>

            <Input placeholder="Resume URL" value={formData.resumeUrl || ''} onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })} />
            <Input placeholder="Profile Pic URL" value={formData.profilePicUrl || ''} onChange={e => setFormData({ ...formData, profilePicUrl: e.target.value })} />
            <Textarea placeholder="Address" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="md:col-span-2" />
            <Input placeholder="Phone*" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <select className='border p-2 rounded' value={formData.role || 'Teacher'} onChange={e => setFormData({ ...formData, role: e.target.value as Teacher['role'] })}>
              <option value="Teacher">Teacher</option>
              <option value="Clerk">Clerk</option>
              <option value="HOD">HOD</option>
            </select>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleSubmit}>{editModeId ? 'Update' : 'Submit'}</Button>
            {editModeId && <Button onClick={resetForm} variant="outline">Cancel</Button>}
          </div>
        </div>
      )}

            {/* Teacher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.length === 0 ? (
          <p className="text-gray-500">None to show</p>
        ) : (
          teachers.map((t, idx) => (
            <div key={t._id || idx} className="transition-all duration-300">
              <Card className="p-4 shadow-md h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{t.firstName || 'N/A'} {t.lastName || ''}</p>
                    <p className="text-sm text-gray-500">{t.role || 'Teacher'}</p>
                    <p className='text-sm text-gray-500'>{t.email || 'N/A'}</p>
                  </div>
                  <Button
                    variant="primary"
                    className="text-sm"
                    onClick={() => setExpandedCard(expandedCard === t._id ? null : t._id || '')}
                  >
                    {expandedCard === t._id ? 'Hide' : 'Show More'}
                  </Button>
                </div>

                {/* Conditionally render expanded content */}
                {expandedCard === t._id && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p><strong>Age:</strong> {t.age || 'N/A'}</p>
                    <p><strong>Department:</strong> {t.department || 'N/A'}</p>
                    <p><strong>Phone:</strong> {t.phone || 'N/A'}</p>
                    <p><strong>Caste:</strong> {t.caste || 'N/A'}</p>
                    <p><strong>Qualification:</strong> {t.qualification || 'N/A'}</p>
                    <p><strong>Join Date:</strong> {t.joinDate?.slice(0, 10) || 'N/A'}</p>
                    {t.resumeUrl && (
                      <p><strong>Resume:</strong> <a href={t.resumeUrl} className="text-blue-500" target="_blank">View</a></p>
                    )}
                    <p><strong>Address:</strong> {t.address || 'N/A'}</p>
                    {t.profilePicUrl && (
                      <img
                        src={t.profilePicUrl}
                        alt="Profile"
                        className="w-16 h-16 object-cover rounded-full mt-2"
                      />
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleEdit(t)} className="text-sm px-3 py-1">Edit</Button>
                      <Button onClick={() => handleDelete(t._id)} variant="outline" className="text-sm px-3 py-1">Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

