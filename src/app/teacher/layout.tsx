'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const links = [
    { name: 'Dashboard', href: '/teacher' },
    { name: 'Upload Marks', href: '/teacher/marks' },
    { name: 'Students', href: '' },
    { name: 'Profile', href: '/teacher/profile' },
    { name: 'Logout', href: '/logout' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white shadow">
        <h2 className="text-xl font-bold text-gray-800">Teacher Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-orange-500 focus:outline-none"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`z-20 bg-white shadow-md md:shadow-none md:relative fixed md:static top-0 left-0 h-screen w-64 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Teacher Panel</h2>
          <nav className="flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className={`py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  pathname === link.href
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
