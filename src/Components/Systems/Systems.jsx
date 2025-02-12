import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaBook, FaChalkboardTeacher, FaQuestionCircle } from "react-icons/fa"; 
import { motion } from "framer-motion";
import {  useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";

const Systems = () => {
  const { yearId, resourceId } = useParams();
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

    useEffect(() => {
        const fetchSystems = async () => {
          try {
            const response = await  fetch(`https://ahmedmahmoud10.pythonanywhere.com/system_grade/${yearId}/`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5Mzk3MDI1LCJpYXQiOjE3MzkxODEwMjUsImp0aSI6IjA5YmFhYjkzNTJlMjRkNTE5NTE3ZGNiMGM0ODg1NTI4IiwidXNlcl9pZCI6NjJ9.jeJgAEzWPOOGo5awJCxaOrvmDew_Budjk56FxsUsA24`,
                  "Content-Type": "application/json",
                },
              })
            if (!response.ok) throw new Error("Failed to fetch data");
            
            const data = await response.json();
            setSystems(data);  
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSystems();
      }, [yearId]);
    

  return (
    <>
     <div className=" flex-col">
    
    <Nav/>
    
    <Welcome/>
    
    </div>

      
    {loading ? (
        <p className="text-center mt-32 text-xl font-semibold text-blue-700">Loading systems...</p>
      ) : error ? (
        <p className="text-center mt-32 text-xl font-semibold text-red-600">{error}</p>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-500 p-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-blue-700">📚 Choose Your System</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {systems.length > 0 ? (
                systems.map((system) => (
                  <motion.div
                    key={system.id}
                    className="p-8 rounded-xl cursor-pointer transition-all shadow-md text-xl font-semibold flex flex-col items-center bg-gray-100 text-gray-700 hover:bg-blue-300 hover:text-white"
                   onClick={() => navigate(`/systems/${yearId}/${resourceId}/${system.id}`)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaBook size={40} />
                    <p className="mt-4">{system.name}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-700 text-xl font-semibold">No systems available.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Systems;
