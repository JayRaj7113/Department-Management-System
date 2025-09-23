// components/ui/card.tsx
import React from 'react'

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      {children}
    </div>
  )
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
