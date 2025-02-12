import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";
export default function Classes() {
  const [years, setYears] = useState([]); 
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
/*     const token = localStorage.getItem("token"); 
 */  
    fetch("https://ahmedmahmoud10.pythonanywhere.com/all_grade/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5Mzk3MDI1LCJpYXQiOjE3MzkxODEwMjUsImp0aSI6IjA5YmFhYjkzNTJlMjRkNTE5NTE3ZGNiMGM0ODg1NTI4IiwidXNlcl9pZCI6NjJ9.jeJgAEzWPOOGo5awJCxaOrvmDew_Budjk56FxsUsA24`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
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

<Nav/>

<Welcome/>

</div>


    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-500 p-6">
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center mb-8"
    >
      <h2 className="text-3xl font-bold text-blue-700">
        📚 Choose Your Academic Year
      </h2>
    </motion.div>
  
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center"
    >
      {loading && <p className="text-gray-600">Loading ....</p>}
      {error && <p className="text-red-600">{error}</p>}
  
      <div className="grid grid-cols-2 gap-6">
        {years.map((year) => (
          <motion.div
            key={year.id}
            className={`p-6 rounded-xl cursor-pointer transition-all shadow-md text-xl font-semibold ${
              selectedYear === year.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-300 hover:text-white"
            }`}
            onClick={() => navigate(`/resources/${year.id}`)} 
                        whileTap={{ scale: 0.9 }}
          >
            {year.name}
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
          ✅ Chosen{" "}
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
