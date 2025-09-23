'use client'

import * as React from 'react'

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100 text-left">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-gray-50">{children}</tr>
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 font-medium text-gray-600">{children}</th>
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>
}
