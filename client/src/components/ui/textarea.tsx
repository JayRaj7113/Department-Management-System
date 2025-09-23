import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  )
}
