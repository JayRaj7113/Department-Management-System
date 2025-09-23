'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LobbyPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [teachers, setTeachers] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (activeTab === 'faculty') {
      fetch('/api/teachers')
        .then(res => res.json())
        .then(data => setTeachers(data))
        .catch(err => console.error('Failed to fetch teachers:', err))
    }
  }, [activeTab])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-orange-100 border-r border-orange-300 flex flex-col justify-between p-6">
        <div>
          <h2 className="text-xl font-bold text-orange-700 mb-6">Waiting Lobby</h2>
          <nav className="space-y-3 text-sm">
            {[
              'overview',
              'faculty',
              'placement',
              'events',
              'notices',
              'documents',
              'faternity of Information Technology'
            ].map(tab => (
              <button
                key={tab}
                className={`text-left w-full py-2 px-4 rounded-lg ${activeTab === tab ? 'bg-orange-500 text-white' : 'hover:bg-orange-200'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6">
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Login
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-gray-50">
        {activeTab === 'overview' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2 text-orange-600">Department of Information Technology</h2>
              <p className="text-gray-700 text-sm">
                Welcome to the Department of Information Technology. Our department focuses on developing technical competence and leadership qualities among students through academic excellence, research, and innovation.
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'faculty' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Faculty Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher: any) => (
                <Card key={teacher._id} className="p-4 shadow-md border border-orange-200">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={teacher.image || '/images/default-teacher.jpg'}
                      alt={teacher.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.qualification}</p>
                      <p className="text-sm text-gray-500 italic">{teacher.type}</p>
                      <p className="text-xs text-gray-400">Joined: {new Date(teacher.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'placement' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Placement Highlights</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>87% Placement Rate</li>
                <li>Average Package: ₹5.5 LPA</li>
                <li>Top Recruiters: TCS, Infosys, Wipro, Cognizant</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {activeTab === 'events' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Event Gallery</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>TechSparks 2025 – Annual Tech Fest</li>
                <li>AI & Robotics Workshop – March 2025</li>
                <li>National Hackathon – Jan 2025</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notices' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Notices</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Seminar submission deadline: 30th July 2025</li>
                <li>Mid-term exams start from 1st Aug 2025</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Important Documents</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li><a href="#" className="text-blue-600 underline">Internship Certificate Format</a></li>
                <li><a href="#" className="text-blue-600 underline">Mini Project Guidelines</a></li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
