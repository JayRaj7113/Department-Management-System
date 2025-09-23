// controllers/marksController.ts
import { Marks } from '../models/Marks'
import mongoose from 'mongoose'

export const uploadMarks = async (req, res) => {
  const { studentId, semester, subject, examType, marks } = req.body

  if (!studentId || !semester || !subject || !examType || marks == null) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Step 1: Check if the student & semester document exists
    let marksDoc = await Marks.findOne({ studentId, semester })

    if (!marksDoc) {
      // Create new document if not found
      marksDoc = await Marks.create({
        studentId,
        semester,
        subjects: [{
          name: subject,
          marks: { [examType]: marks }
        }]
      })
    } else {
      // Step 2: Check if subject exists inside subjects[]
      const subjectIndex = marksDoc.subjects.findIndex(s => s.name === subject)

      if (subjectIndex === -1) {
        // Subject doesn't exist → push new subject
        marksDoc.subjects.push({
          name: subject,
          marks: { [examType]: marks }
        })
      } else {
        // Subject exists → update only the specific examType
        marksDoc.subjects[subjectIndex].marks[examType] = marks
      }

      await marksDoc.save()
    }

    return res.status(200).json({ message: 'Marks uploaded successfully', data: marksDoc })
  } catch (err) {
    console.error('Error uploading marks:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
