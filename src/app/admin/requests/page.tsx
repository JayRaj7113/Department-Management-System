'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function ApprovalRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [modalImage, setModalImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch('/api/user/pending')
        const data = await res.json()

        if (res.ok) {
          setRequests(data)
        } else {
          toast.error(data.error || 'Failed to load pending requests')
        }
      } catch (error) {
        toast.error('Failed to connect to server or fetch data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingUsers()
  }, [])

  const handleDecision = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/user/decision/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(result.message || `User ${status}`)
        setRequests(reqs => reqs.filter(req => req._id !== id))
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Approval Requests</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-5">
          {requests.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            requests.map((user) => {
              const isExpanded = expanded === user._id
              return (
                <div
                  key={user._id}
                  className="bg-white p-4 shadow rounded-lg border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      {user.profileImage && (
                        <Image
                          src={user.profileImage}
                          alt="Profile"
                          width={60}
                          height={60}
                          className="rounded-full object-cover cursor-pointer"
                          onClick={() => setModalImage(user.profileImage)}
                        />
                      )}
                      <div>
                        <h2 className="font-semibold text-lg">{user.firstName} {user.middleName} {user.lastName}</h2>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">PRN: {user.PRN || 'Not provided'}</p>
                        <p className="text-sm text-gray-600">
                          Year: {user.joinDate?.slice(0, 4)} - {user.passoutDate?.slice(0, 4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="space-x-2">
                        <button
                          onClick={() => handleDecision(user._id, 'approved')}
                          className="px-4 py-1 bg-green-500 text-white rounded-lg text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(user._id, 'rejected')}
                          className="px-4 py-1 bg-red-500 text-white rounded-lg text-sm"
                        >
                          Reject
                        </button>
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : user._id)}
                        className="text-sm text-orange-600 underline"
                      >
                        {isExpanded ? 'Hide Details' : 'Show More'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 text-sm text-gray-700 bg-orange-50 p-4 rounded-lg">
                      <p><strong>Caste:</strong> {user.caste || 'Not provided'}</p>
                      <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
                      <p><strong>Semester:</strong> {user.semester || 'Not provided'}</p>
                      <p><strong>Education System:</strong> {user.addmissionType || 'Not provided'}</p>
                      <p><strong>Join Date:</strong> {user.joinDate?.slice(0, 10) || 'Not provided'}</p>
                      <p><strong>Passout Date:</strong> {user.passoutDate?.slice(0, 10) || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Image Modal (without background blur) */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-[-2.5rem] right-0 text-white text-sm font-bold bg-red-500 px-3 py-1 rounded"
            >
              ✕ Close
            </button>
            <Image
              src={modalImage}
              alt="Expanded Profile"
              width={500}
              height={500}
              className="rounded-lg max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
