import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  className?: string // <-- add this line
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className, // <-- add this line
}: ButtonProps) => {
  const base = 'rounded px-4 py-2 font-medium transition'

  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-500 text-gray-700 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)} // <-- merge className
    >
      {children}
    </button>
  )
}
