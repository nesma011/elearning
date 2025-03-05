import React, { useState, useEffect } from 'react';
import logo from "../../assets/logo.webp";
import { NavLink } from 'react-router-dom';

export default function Nav({ hasSidebar = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav
      className={`h-16 flex-shrink-0 fixed top-0 right-0 ${
        hasSidebar ? "left-[256px]" : "left-0"
      } bg-gray-100 dark:bg-gray-800 dark:text-white border-b flex items-center justify-between py-4 px-4`}
    >
      <NavLink to="/classes" className="flex justify-center items-center gap-2">
        <img src={logo} className="w-16 ms-16" alt="Logo" />
        <h1 className="text-3xl font-semibold text-blue-600">
          <span className="text-3xl font-extrabold text-blue-600">ALEX</span>
          -MedLearn
        </h1>
      </NavLink>

      {userData && (
        <div className="flex items-center gap-4 text-end me-4">
          <div className="text-left">
            <p className="font-semibold text-blue-700 text-lg">
              {userData.username}
            </p>
            <p className="text-gray-600 text-sm">
              {userData.email}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
          <button
            type="button"
            className="border-e px-4 py-2 text-2xl text-blue-700 hover:bg-gray-50 hover:text-gray-700"
          >
            <i className="fa-solid fa-user text-4xl"></i>
          </button>

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
            <div className="p-2">
              <NavLink
                to="/Profile"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                My Profile
              </NavLink>
            </div>

            <NavLink
              to="/login"
              className="p-4 text-red-600 font-semibold text-lg"
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              Logout
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}