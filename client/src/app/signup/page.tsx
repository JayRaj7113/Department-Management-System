'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    caste: '',
    semester: '',
    joinDate: '',
    passoutDate: '',
    profileImage: '',
    address: '',
    PRN: '',
    abcId: '',
    phone: '',
    year: '',
    addmissionType: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formDataImage = new FormData();
  formDataImage.append('file', file);
  formDataImage.append('upload_preset', 'DMS_Upload'); // ✅ Replace with your actual unsigned preset

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dbelkn0i7/image/upload', // ✅ Replace with your Cloudinary cloud name
      {
        method: 'POST',
        body: formDataImage,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      setFormData(prev => ({ ...prev, profileImage: data.secure_url }));
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Failed to upload image.');
    }
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    toast.error('Image upload failed.');
  }
};


  const handleSignup = async () => {
    const {
      firstName, lastName, email, password, age, caste,
      semester, joinDate, passoutDate, address, PRN, addmissionType,
      abcId, phone, year
    } = formData

    console.log('Profile Image:', formData.profileImage)

    // if (!firstName || !lastName || !email || !password || !age || !caste || !semester || !joinDate || !passoutDate || !address || !PRN || !addmissionType || !abcId || !phone) {
    //   return toast.error('Please fill all required fields.')
    // }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Signup successful!')
        router.push('/lobby')
      } else {
        toast.error(data.error || 'Signup failed.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Illustration */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 p-8">
        <Image
          src="/images/developer.png"
          alt="Student Illustration"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 md:p-10 border border-orange-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Registration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" className="input" />
            <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className="input" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" className="input" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="input" />
            <input name="abcId" value={formData.abcId} onChange={handleChange} placeholder="ABC ID *" className="input" />
            <input name="phone" type="number" value={formData.phone} onChange={handleChange} placeholder="Phone *" className="input" />
            <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age *" className="input" />
            <input name="PRN" value={formData.PRN} onChange={handleChange} placeholder="PRN *" className="input" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Permanent Address *" className="input" />

            <select name="caste" value={formData.caste} onChange={handleChange} className="input">
              <option value="">Select Caste *</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="NT">NT</option>
              <option value="Other">Other</option>
            </select>

            <span>
              <select name="semester" value={formData.semester} onChange={handleChange} className="input">
              <option value="">Current Semester *</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
            </span>
            

            <span >
            <select name="addmissionType" value={formData.addmissionType} onChange={handleChange} className="input">
              <option value="">Select Admission Type *</option>
              <option value="Regular">Regular</option>
              <option value="DA">DA</option>
            </select>
          </span>

            <span>
              <label className="block mb-1 text-sm font-medium text-gray-700">Admission Year *</label>
              <input name="joinDate" type="month" value={formData.joinDate} onChange={handleChange} className="input" />
            </span>
            <span>
              <label className="block mb-1 text-sm font-medium text-gray-700">Passout Year *</label>
              <input name="passoutDate" type="month" value={formData.passoutDate} onChange={handleChange} className="input" />
            </span>
          </div>

          

          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Profile Photo</label>
            <input name="profileImage" type="file" accept="image/*" onChange={handleImageChange} className="input" />
          </div>

          <div className="mt-4">
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="input" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password *" className="input" />
          </div>

          <button
            onClick={handleSignup}
            className="w-full mt-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-300"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already registered?{' '}
            <Link href="/login" className="text-orange-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background-color: #fff;
          outline: none;
        }
        .input:focus {
          border-color: #fb923c;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.25);
        }
      `}</style>
    </div>
  )
}
