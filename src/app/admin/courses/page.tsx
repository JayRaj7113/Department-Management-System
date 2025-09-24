"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, MoreHorizontal } from "lucide-react";
import axios from "axios";

export default function Courses() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [form, setForm] = useState({
    courseTitle: "",
    courseCode: "",
    courseCategory: "PCC",
    semester: "semester1",
    assignedTeacher: "",
    credits: "",
  });

  const fetchSubjects = async (semester = "all") => {
    try {
      const params: any = {};
      if (semester !== "all") {
        params.semester = semester.replace(/^semester/, "");
      }
      const res = await axios.get("/api/subject", { params });
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      toast.error("Failed to fetch subjects");
      setSubjects([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/api/teachers/all");
      setTeachers(res.data.teachers || []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast.error("Failed to load teachers");
      setTeachers([]);
    }
  };

  const handleAddSubject = async () => {
    try {
      await axios.post("/api/subject", {
        ...form,
        credits: Number(form.credits),
        semester: form.semester.replace(/^semester/, "")
      });
      toast.success("Subject added successfully");
      setForm({
        courseTitle: "",
        courseCode: "",
        courseCategory: "PCC",
        semester: "semester1",
        assignedTeacher: "",
        credits: "",
      });
      fetchSubjects(semesterFilter);
    } catch (err) {
      console.error("Error adding subject:", err);
      toast.error("Failed to add subject");
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects(semesterFilter);
  }, [semesterFilter]);

  const getTeacherName = (id: string) => {
    const teacher = teachers.find((t) => t._id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "-";
  };

  const displayedSubjects = subjects.filter((subj) =>
    subj.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={18} /> <span>Add Course</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              <Input
                placeholder="Course Title"
                value={form.courseTitle}
                onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
              />
              <Input
                placeholder="Course Code"
                value={form.courseCode}
                onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
              />
              <Input
                placeholder="Credits"
                type="number"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
              />
              <select
                className="p-2 border rounded"
                value={form.courseCategory}
                onChange={(e) => setForm({ ...form, courseCategory: e.target.value })}
              >
                <option value="PCC">PCC</option>
                <option value="PEC">PEC</option>
                <option value="OEC">OEC</option>
                <option value="LC">LC</option>
                <option value="Project">Project</option>
                <option value="Internship">Internship</option>
              </select>
              <select
                className="p-2 border rounded"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={`semester${i + 1}`}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={form.assignedTeacher}
                onChange={(e) => setForm({ ...form, assignedTeacher: e.target.value })}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
              <Button className="bg-green-600 hover:bg-green-700 text-white mt-2" onClick={handleAddSubject}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search Course Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="p-2 border rounded"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="all">All Semesters</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={`semester${i + 1}`}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Title</TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Code</TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Category</TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Semester</TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Teacher</TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSubjects.length ? displayedSubjects.map((subj) => (
              <TableRow key={subj._id} className="hover:bg-gray-50">
                <TableCell className="py-2">{subj.courseTitle}</TableCell>
                <TableCell className="py-2">{subj.courseCode}</TableCell>
                <TableCell className="py-2">{subj.courseCategory}</TableCell>
                <TableCell className="py-2">{subj.semester}</TableCell>
                <TableCell className="py-2">{getTeacherName(subj.assignedTeacher)}</TableCell>
                <TableCell className="py-2">
                  <Button variant="primary" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-gray-500">
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
