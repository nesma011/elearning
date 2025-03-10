import React from 'react'
import logo from "../../../public/logo.webp"
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 max-w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <img src={logo} className="w-16" alt="ALEX-MedLearn Logo" />
            <h1 className="text-2xl font-semibold text-blue-600"> 
              <span className='text-3xl font-extrabold text-blue-600'>ALEX</span>-MedLearn
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-sm text-gray-500 max-w-md">
            Unlock Your Full Potential with Tailored Exams and Unmatched Support from Alex-MedLearn!
          </p>

         

          {/* Social Media Icons */}
          <ul className="flex items-center justify-center gap-5 flex-wrap">
          <li> <NavLink to="https://www.facebook.com/share/18aNvC8sCJ/"><i class="fa-brands fa-facebook text-blue-700 text-2xl"></i></NavLink> </li>
          <li className="flex items-center gap-2 hover:text-blue-800 transition-colors">
      <i className="fa-solid fa-envelope text-blue-700 text-sm"></i>
      <a 
        href="mailto:alexmedlearn200@gmail.com"
        className="hover:underline"
      >
        alexmedlearn200@gmail.com
      </a>
    </li>          <li><i class="fa-solid fa-phone text-blue-700 text-sm px-1"></i> +201229733297</li>
          <li> <NavLink to="https://t.me/ddfffgry"><i class="fa-brands fa-telegram text-blue-700 text-2xl"></i></NavLink> </li>

          <li className="flex items-center gap-2 hover:text-blue-800 transition-colors">
      <i className="fa-solid fa-envelope text-blue-700 text-sm"></i>
      <a 
        href="mailto:alexmedlearn915@gmail.com"
        className="hover:underline"
      >
        alexmedlearn915@gmail.com
      </a>
    </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}