import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp"
import Darkmode from '../../Darkmode'

export default function Classes() {
  const [years, setYears] = useState([]); 
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
   fetch("https://ahmedmahmoud10.pythonanywhere.com/all_grade/") 
      .then((response) => {
        if (!response.ok) {
          throw new Error("error to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setYears(data); 
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
       <div className=" flex-col">

<nav className="h-16 bg-gray-100 dark:bg-gray-800 dark:text-white border-b flex items-center justify-between py-10 px-4">
   <NavLink to="/classes" className="flex justify-center items-center gap-2">
            <img src={logo} className="w-16 ms-16" alt="Logo" />
            <h1 className="text-3xl font-semibold text-blue-600"> 
              <span className="text-3xl font-extrabold text-blue-600">ALEX</span>-MedLearn
            </h1>
          </NavLink>  <div className="relative">
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
         to="/login"
          className="p-4 text-red-600 font-semibold text-lg"
           onClick={() => {
          localStorage.removeItem("userToken"); 
         window.location.href = "/login"; 
  }}
>
  Logout
</NavLink>
      </div>
    )}
  </div>
</nav>

  <div className='text-center m-10 flex-col items-center justify-center p-10 bg-gray-200 shadow-lg shadow-gray-400 '>
    <h1 className='font-bold text-3xl'>👋 Hello Subscriber,</h1>
    <p className=' text-lg '>If you face any issues on <span className='font-semibold text-xl'>ALEX-MedLearn</span> , let us know via a video on WhatsApp 📱. We're ready to help through Google Meet or TeamViewer. 🗓️</p>
  <h3 className=' py-4 text-lg font-semibold'>Thank you for supporting us. 😊</h3>
  <h4>Best regards,</h4>
  <h5>The <span className='font-semibold text-xl'>ALEX-MedLearn</span> Team</h5>
  </div>

  </div>

<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-6">
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
  >
    <h2 className="text-2xl font-bold text-blue-700 mb-6">
      📚 Choose Your Academic Year
    </h2>

    {loading && <p className="text-gray-600">Loading ....</p>}

    {error && <p className="text-red-600">{error}</p>}

    <div className="grid grid-cols-2 gap-4">
      {years.map((year) => (
        <motion.div
          key={year.id} 
          className={`p-6 rounded-xl cursor-pointer transition-all shadow-md ${
            selectedYear === year.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-300 hover:text-white"
          }`}
          onClick={() => setSelectedYear(year.id)} 
          whileTap={{ scale: 0.9 }} 
        >
          <h3 className="text-lg font-semibold">{year.name}</h3>
        </motion.div>
      ))}
    </div>

    {selectedYear && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-blue-100 p-4 mt-6 rounded-xl shadow-md text-lg font-semibold text-blue-700"
      >
        ✅Choosen{" "}
        <span className="text-blue-900">
          {years.find((year) => year.id === selectedYear)?.name}
        </span>
      </motion.div>
    )}
  </motion.div>
</div>
    </>
 
  );
}
