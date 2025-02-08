import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from "react";
import Sidebar from '../SideBar/Sidebar'
import { motion } from "framer-motion";


export default function Classes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const years = ["Class 1" ,"Class 2", "Class 3", "Class 4"];

  const subjects = {
    "Class 1 ": ["Math", "Programming", "ph"],
    "Class 2 ": ["Networ , AI , Data Anlysis"],
    "Class 3 ": [" Cyper security , Machine learning ,web Development"],
    "Class 4 ": ["Networ , AI , Data Anlysis"],
  };


  return (<>
  <div className='flex h-screen'>
 <Sidebar/>

 <div className="flex-1 flex flex-col">

      <nav className="h-16 bg-gray-100 dark:bg-gray-800 dark:text-white border-b flex items-center justify-between py-10 px-4">
        <h1 className="text-4xl p-6 font-semibold text-blue-700">Dashboard</h1>
        <div className="relative">
          <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
            <a
              href="#"
              className="border-e px-4 py-2 text-2xl text-blue-700 hover:bg-gray-50 hover:text-gray-700"
            >
              <i className="fa-solid fa-user text-4xl"></i>
            </a>

            <button
              className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isDropdownOpen && ( 
            <div
              className="absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
              role="menu"
            >
              <div className="p-2">
                <NavLink
                  to="/contact"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  role="menuitem"
                >
                  Support
                </NavLink>
              </div>

              <NavLink
                to="/logout"
                className="p-4 text-red-600 font-semibold text-lg"
              >
                Logout
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 p-4 my-10 bg-gray-50 dark:bg-gray-700">
        <div className='text-center m-10 flex-col items-center justify-center p-10 bg-gray-200 shadow-lg shadow-gray-400 '>
          <h1 className='font-bold text-3xl'>👋 Hello Subscriber,</h1>
          <p className=' text-lg '>If you face any issues on <span className='font-semibold text-xl'>ALEX-MedLearn</span> , let us know via a video on WhatsApp 📱. We're ready to help through Google Meet or TeamViewer. 🗓️</p>
        <h3 className=' py-4 text-lg font-semibold'>Thank you for supporting us. 😊</h3>
        <h4>Best regards,</h4>
        <h5>The <span className='font-semibold text-xl'>ALEX-MedLearn</span> Team</h5>
        </div>

        <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">📚 Choose Your class and System</h2>

        {/* اختيار الفرقة */}
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">👨‍🎓Class</label>
          <select
            className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedSubject(""); 
            }}
          >
            <option value="">-- Choose Grade--</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">📖 System</label>
          <select
            className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-200"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedYear} 
          >
            <option value="">-- Choose System--</option>
            {selectedYear &&
              subjects[selectedYear].map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
          </select>
        </div>

        {/* عرض الاختيارات */}
        {selectedYear && selectedSubject && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-blue-100 p-4 rounded-xl shadow-md text-lg font-semibold text-blue-700"
          >
            ✅ اخترت <span className="text-blue-900">{selectedSubject}</span> من <span className="text-blue-900">{selectedYear}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
        </div>
      </main>
    </div>
    </div>

  
  </>
  )
}
