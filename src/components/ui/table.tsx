'use client'

import * as React from 'react'
import clsx from 'clsx' // optional, remove if not using

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={clsx("w-full border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  )
}

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export function TableHeader({ children, className, ...props }: TableSectionProps) {
  return (
    <thead className={clsx("bg-gray-100 text-left", className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }: TableSectionProps) {
  return (
    <tbody className={clsx("divide-y divide-gray-200", className)} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr className={clsx("hover:bg-gray-50", className)} {...props}>
      {children}
    </tr>
  )
}

interface TableCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

export function TableHead({ children, className, ...props }: TableCellProps) {
  return (
    <th className={clsx("px-4 py-2 font-medium text-gray-600", className)} {...props}>
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={clsx("px-4 py-2", className)} {...props}>
      {children}
    </td>
  )
}
