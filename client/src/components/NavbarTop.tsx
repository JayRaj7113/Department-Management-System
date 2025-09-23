import { FaSearch, FaBell, FaEnvelope } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'

export default function Navbar() {
  return (
    <header className="grid grid-cols-12 bg-white shadow px-6 py-3 w-full items-center">
      
      {/* Left: Logo */}
      <div className="col-span-3 font-bold text-xl">
        MJRS
      </div>

      {/* Center: Search Bar */}
      <div className="col-span-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search students, projects, attendance..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm"
          />
          <FaSearch className="absolute top-2.5 right-3 text-gray-400" />
        </div>
      </div>

      {/* Right: Notifications, Messages, Avatar, Logout */}
      <div className="col-span-3 flex justify-end items-center gap-6">
        
        {/* Notifications */}
        <div className="relative">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>

        {/* Messages */}
        <div className="relative">
          <FaEnvelope className="text-gray-600 text-xl" />
          <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
        </div>

        {/* Avatar & Info */}
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=FF8C00&color=fff"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm leading-tight">
            <p className="font-medium">Admin</p>
            <p className="text-gray-500 text-xs">admin@college.edu</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm">
          <MdLogout className="text-md" />
          Logout
        </button>
      </div>
    </header>
  )
}