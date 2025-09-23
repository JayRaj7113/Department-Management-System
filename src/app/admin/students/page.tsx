'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AllStudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [semester, setSemester] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const fetchStudents = async (selectedSemester?: string) => {
    setLoading(true);
    const endpoint = selectedSemester
      ? `/api/students?semester=${semester}`
      : `/api/user/all`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(semester);
  }, [semester]);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();

    const filtered = students.filter(
      (student) =>
        student.firstName?.toLowerCase().includes(lowerSearch) ||
        student.lastName?.toLowerCase().includes(lowerSearch) ||
        student.email?.toLowerCase().includes(lowerSearch) ||
        student.PRN?.toLowerCase().includes(lowerSearch)
    );

    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
            🎓 Manage Students
          </h1>
          <p className="text-gray-600 text-lg">
            View and search approved students by semester
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="semester" className="font-medium text-gray-700">
              Semester:
            </label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSearchQuery('');
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Semesters</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="🔍 Search by name, PRN, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No students found{semester ? ` in Semester ${semester}` : ''}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-2 text-lg font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">PRN: {user.PRN}</div>
                  <div className="text-sm text-gray-600 mb-1">{user.email}</div>
                  <div className="text-sm text-gray-500">Semester: {user.semester}</div>
                </div>

                <button
                  onClick={() => router.push(`/admin/students/${user._id}`)}
                  className="mt-4 text-sm font-medium text-orange-600 hover:underline self-start"
                >
                  View More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
