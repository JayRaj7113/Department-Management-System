'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { FaCircle } from 'react-icons/fa'

type NavItem = {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Upload Marks', href: '/upload-marks', icon: '📊' },
  { name: 'Faculty', href: '/faculty', icon: '🧑‍🏫' },
  { name: 'Students', href: '/students', icon: '🎓' },
  { name: 'Assign Subject', href: '/assign-subject', icon: '📢' },
  { name: 'Create Group', href: '/create-group', icon: '🧩' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between p-4 fixed left-0 top-0 border-r border-gray-200">
      {/* Top: Logo */}
      <div>
        <h1 className="text-2xl font-bold mb-8">IT Department</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition duration-150 ${
                  pathname === item.href
                    ? 'bg-orange-100 text-orange-600 font-semibold'
                    : 'hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="mt-10">
          {/* System Status */}
        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
          <FaCircle className="text-green-500 text-xs" />
          System Online
        </div>
      </div>
    </aside>
  )
}
