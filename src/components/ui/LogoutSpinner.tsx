'use client'

import { GraduationCap } from 'lucide-react'

export default function LogoutSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="relative flex items-center justify-center w-24 h-24 animate-spin-slow">
        <GraduationCap className="w-12 h-12 text-blue-600" />
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-300 opacity-30 animate-spin-fast" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-700 animate-pulse">
        Logging you out...
      </h2>
    </div>
  )
}
