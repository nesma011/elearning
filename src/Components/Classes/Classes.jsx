import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from "react";
import Sidebar from '../SideBar/Sidebar'


export default function Classes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


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
      
      <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-2xl font-bold">Home Content</h2>
        <p>هنا محتوى الصفحة الرئيسية</p>
      </main>
    </div>
    </div>

  
  </>
  )
}
