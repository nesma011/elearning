import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from "../../assets/logo.webp"
import Darkmode from '../../Darkmode'


export default function Sidebar() {
  return (
    <aside className="flex left-0 h-full overflow-y-auto flex-col justify-between w-72 border-e bg-white dark:bg-gray-900 dark:text-white">
    <div className="px-4 py-6">
    <NavLink to="/classes" className="flex-col justify-center items-center gap-2">
            <img src={logo} className="w-28 ms-16" alt="Logo" />
            <h1 className="text-3xl font-semibold text-blue-600"> 
              <span className="text-3xl font-extrabold text-blue-600">ALEX</span>-MedLearn
            </h1>
          </NavLink>
          <Darkmode/>
  
      <ul className="mt-6 space-y-1">
        <li>
          <NavLink
            to='/classes'
            className="block rounded-lg bg-gray-100 px-4 py-2 text-xl font-bold  text-gray-900"
          >
            Dashboard
          </NavLink>
        </li>
  
        <li>
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-700  text-lg hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
            >
              <span className="text-xl font-bold dark:text-white"> Test Management </span>
  
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
  
            <ul className="mt-2 space-y-1 px-4">
              <li>
                <NavLink
                  to=''
                  className="block rounded-lg px-4 py-2 dark:text-gray-400 font-medium text-gray-700  text-lg hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
                >
                  Create Test
                </NavLink>
              </li>
            </ul>
          </details>
        </li>
  
       
  
        <li>
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-700  text-lg hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
            >
              <span className="text-xl font-bold dark:text-white"> Tests Preview </span>
  
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
  
            <ul className="mt-2 space-y-1 px-4">
              <li>
                <NavLink
                  to =""
                  className="block rounded-lg px-4 py-2  font-medium text-gray-700  text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
                >
                  Previous Tests
                </NavLink>
              </li>
  
              <li>
                <NavLink
                  to =''
                  className="block rounded-lg px-4 py-2  font-medium text-gray-700  text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
                >
                  Notes
                </NavLink>
              </li>
  
              <li>
              <NavLink
                  to =''
                  className="block rounded-lg px-4 py-2  font-medium text-gray-700  text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
                >
                 FlashCards
                </NavLink>
              </li>
              <li>
              <NavLink
                  to =''
                  className="block rounded-lg px-4 py-2  font-medium text-gray-700  text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
                >
                 Marked Questions
                </NavLink>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <NavLink
            to=''
            className="block rounded-lg px-4 py-2 text-xl font-bold dark:text-white text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
          >
            Books
          </NavLink>
        </li>
  
        <li>
          <NavLink
            to=''
            className="block rounded-lg px-4 py-2 text-xl font-bold dark:text-white text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-gray-700"
          >
            Lectures
          </NavLink>
        </li>
      </ul>
    </div>
  
    
  </aside>
  )
}
