import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  FiHome,
  FiPlusCircle,
  FiList,
  FiRefreshCw,
  FiUserPlus,
} from 'react-icons/fi';
import logo from "../../../public/logo.webp";
import Darkmode from '../../Darkmode';
import  { useReferFriendModal } from  "../../Context/ReferContext"; // Update the import path as needed

export default function Sidebar() {
  useContext(useReferFriendModal)
  const { yearId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const { openModal } = useReferFriendModal();


  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-gray-700 text-white rounded-md"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen 
          bg-gradient-to-b from-white to-blue-500 dark:from-gray-700 dark:to-gray-900 
          text-white overflow-y-auto transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:w-72 md:border-e
        `}
      >
        <div className="px-4 py-6">
          {/* Logo */}
          <NavLink to="/classes" className="flex-col justify-center items-center gap-2">
            <img src={logo} className="w-28 ms-16" alt="Logo" />
            <h1 className="text-3xl font-semibold text-blue-600">
              <span className="text-3xl font-extrabold text-blue-600">ALEX</span>-MedLearn
            </h1>
          </NavLink>

          <Darkmode />

          {/* Menu Items */}
          <ul className="mt-6 space-y-1">
            <li>
              <NavLink
                to={`/questionBank/${yearId}`}
                end
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-2 text-xl font-bold text-gray-900"
              >
                <FiHome className="text-blue-600" /> Dashboard
              </NavLink>
            </li>

            {/* Test Management */}
            <li>
              <div className="rounded-lg px-4 py-2 text-lg hover:bg-gray-600 dark:hover:bg-gray-800">
                <span className="text-xl font-bold text-white flex items-center gap-3">
                  <FiPlusCircle /> Test Management
                </span>
              </div>
              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <NavLink
                    to={`/createTest/${yearId}`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 dark:text-gray-400 font-medium text-gray-900 text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiPlusCircle /> Create Test
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Tests Preview */}
            <li>
              <div className="rounded-lg px-4 py-2 text-lg hover:bg-gray-600 dark:hover:bg-gray-800">
                <span className="text-xl font-bold text-white flex items-center gap-3">
                  <FiList /> Tests Preview
                </span>
              </div>
              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <NavLink
                   to={`/testCard/${yearId}`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiList /> Previous Tests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                       to={`/displayNotes/${yearId}`}
                          className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    📝 Notes
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/displayFlashCards/${yearId}`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    📖 FlashCards
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/marked/${yearId}`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 text-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    ❓ Marked Questions
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Bottom Buttons */}
        <div className="px-4 py-4">
          <button
           onClick={()=>navigate(`/performance/${yearId}`)}
           className="flex w-full my-4 items-center justify-center gap-3 rounded-lg bg-green-500 px-4 py-2 text-lg font-bold text-white hover:bg-green-600">
            📊 Performance
          </button>

          {/* Reset Account */}
          <button 
          onClick={()=>navigate(`/resetAcc/${yearId}`)}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-4 py-2 text-lg font-bold text-white hover:bg-red-700">
            <FiRefreshCw /> Reset Account
          </button>

          {/* Refer Friends button with modal */}
          
              <button 
              onClick={openModal}
              className="flex w-full mt-3 items-center justify-center gap-3 rounded-lg bg-yellow-600 px-4 py-2 text-lg font-bold text-white hover:bg-yellow-500"
            >
              <FiUserPlus /> Refer Friends
            </button>
         
        
        </div>
      </aside>
    </>
  );
}