'use client'

import React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'



export default function PlacementPage() {
      const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

    return(
 <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* 🌟 Header */}
      <header className="bg-orange-300 text-white shadow-sm relative z-10">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
    {/* Logo on the left */}
    <div className="flex-shrink-0">
      <Image
        src="/images/logo.png"
        alt="Department Logo"
        width={50}
        height={50}
        className="rounded-full"
      />
    </div>

    {/* Centered Titles */}
    <div className="absolute left-0 right-0 flex flex-col items-center text-center px-4">
      <h1 className="text-base sm:text-lg md:text-xl font-bold leading-snug">
        Department of Information Technology
      </h1>
      <p className="text-xl sm:text-sm md:text-base">
        Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Maharashtra - 402103
      </p>
    </div>
  </div>
</header>


      {/* 🧭 Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="hidden md:flex gap-6 text-sm font-semibold text-orange-700">
            {[
              'About Us', 'Our Legacy', 'Placement Records', 'Achievements',
              'Events', 'Student Union', 'Teachers', 'Students'
            ].map(section => (
              <a
                key={section}
                href={`#${section.toLowerCase().replace(/ /g, '-')}`}
                className="hover:text-orange-900 transition-colors"
              >
                {section}
              </a>
            ))}
          </div>

          <div className="hidden md:flex gap-4">
            <Link href="/login" className="text-sm text-orange-600 hover:underline flex items-center">Login</Link>
            <Link href="/signup" className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-md hover:bg-orange-600 transition">
              Sign Up
            </Link>
          </div>

          <button className="md:hidden text-2xl text-orange-600" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 px-6 pb-4 space-y-3">
            {[
              'About Us', 'Our Legacy', 'Placement Records', 'Achievements',
              'Events', 'Student Union', 'Teachers', 'Students'
            ].map(section => (
              <a
                key={section}
                href={`#${section.toLowerCase().replace(/ /g, '-')}`}
                className="block text-sm text-orange-700 hover:text-orange-900"
              >
                {section}
              </a>
            ))}
            <hr className="my-2" />
            <Link href="/login" className="block text-sm text-orange-600 hover:underline">Login</Link>
            <Link href="/signup" className="block text-sm bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600">
              Sign Up
            </Link>
          </div>
        )}
      </nav>

        {/* 🦶 Footer */}
      <footer className="bg-gray-800 text-gray-300 text-sm py-6 mt-12">
        <div className="text-center">
          © 2025 Department of Information Technology ·{' '}
          <Link href="/contact" className="underline hover:text-white">Contact Us</Link>
        </div>
      </footer>
    </div>
    )
}