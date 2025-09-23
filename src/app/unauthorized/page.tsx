// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
        <p className="mt-4 text-gray-600">You are not authorized to access this page.</p>
        <a href="/login" className="mt-6 inline-block text-blue-500 underline">Go to Home</a>
      </div>
    </div>
  )
}
