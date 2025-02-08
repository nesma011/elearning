import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/logo.webp";
import { userContext } from "../../Context/UserContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, settoken } = useContext(userContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    if (storedAccessToken) {
      try {
        const tokenParts = storedAccessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp > currentTime) {
            settoken(storedAccessToken);
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            settoken(null);
          }
        }
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        settoken(null);
      }
    }
  }, [settoken]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    settoken(null); 
    navigate("/login");
  };

  const isTokenValid = () => {
    const storedAccessToken = localStorage.getItem("access_token");
    if (!storedAccessToken) return false;

    try {
      const tokenParts = storedAccessToken.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  return (
    <nav className="bg-gray-100 shadow-lg shadow-blue-200 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-2">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} className="w-10" alt="Logo" />
          <h1 className="text-2xl font-semibold text-blue-600"> 
            <span className="text-3xl font-extrabold text-blue-600">ALEX</span>-MedLearn
          </h1>
        </NavLink>

        <div className="hidden md:flex flex-grow  justify-center space-x-8">
          {["Home", "Contact"].map((item, index) => (
            <NavLink
              key={index}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-xl font-medium  transition-all duration-300 ${
                  isActive
                    ? "text-blue-700   border-b-2 border-blue-700"
                    : "text-gray-900 dark:text-white hover:text-blue-800"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-blue-700 dark:text-white"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className="hidden md:flex space-x-4 ml-auto">
          {!isTokenValid() ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2 border-2 rounded transition-all duration-300 ${
                    isActive
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-blue-700 border-blue-300 hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-5 py-2 border-2 rounded transition-all duration-300 ${
                    isActive
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-blue-700 text-white hover:text-blue-700 hover:bg-white hover:border-blue-300"
                  }`
                }
              >
                SignUp
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 border-2 rounded transition-all duration-300 bg-red-600 text-white hover:bg-white hover:text-red-600 hover:border-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4">
          {["Home", "Contact"].map((item, index) => (
  <li key={index}>
    <NavLink
      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
      className="text-xl font-medium text-gray-900 hover:text-blue-800"
    >
      {item}
    </NavLink>
  </li>
))}

            {!isTokenValid() ? (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="block w-full text-center py-2 border-2 border-blue-300 text-blue-700 bg-white hover:bg-blue-700 hover:text-white"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className="block w-full text-center py-2 border-2 bg-blue-700 text-white hover:bg-white hover:text-blue-700 hover:border-blue-300"
                  >
                    SignUp
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center py-2 border-2 bg-red-600 text-white hover:bg-white hover:text-red-600 hover:border-red-600"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}