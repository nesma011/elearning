import { useParams } from "react-router-dom";
import React from "react";
import { FaBook, FaChalkboardTeacher, FaQuestionCircle } from "react-icons/fa"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";

const Resources = () => {
  const { yearId } = useParams(); 
  const navigate = useNavigate();

    const resources = [
        { id: 1, name: "Lectures", icon: <FaChalkboardTeacher size={40} /> },
        { id: 2, name: "Books", icon: <FaBook size={40} /> },
        { id: 3, name: "Question Bank", icon: <FaQuestionCircle size={40} /> },
      ];

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
        <h2 className="text-3xl font-bold text-blue-700">📚 Choose Your Resource</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => (
  <motion.div
    key={resource.id}
    className="p-8 rounded-xl cursor-pointer transition-all shadow-md text-xl font-semibold flex flex-col items-center bg-gray-100 text-gray-700 hover:bg-blue-300 hover:text-white"
    onClick={() => {
      if (resource.name === "Question Bank") {
        console.log("Navigating with yearId:", yearId);
        navigate(`/questionBank/${yearId}`);
      } else {
        navigate(`/systems/${yearId}/${resource.id}`);
      }
    }}    whileTap={{ scale: 0.9 }}
  >
    {resource.icon}
    <p className="mt-4">{resource.name}</p>
  </motion.div>
))}
        </div>
      </motion.div>
    </div>
 
   </>
  );
};

export default Resources;
