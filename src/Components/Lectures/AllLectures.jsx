import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";

const Alllectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { systemId } = useParams();
 const navigate = useNavigate();
  useEffect(() => {
    const fetchlectures = async () => {
      try {
        const response = await fetch(`https://ahmedmahmoud10.pythonanywhere.com/lectuers_system/${systemId}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwMjM1MTc1LCJpYXQiOjE3Mzk2MzAwNzksImp0aSI6ImZkNmYwZGJlZTI4MDQ3NjE5ZjQwNDU4ZTgxMjM3ZTY1IiwidXNlcl9pZCI6NjZ9.YuRi4yXQMwvo8lZ9DDHkE9X6gd8cF73KOISq6FT8KX4`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("❌ Error Fetching Data");

        const data = await response.json();
        setLectures(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchlectures();
  }, [systemId]);

  const handleOrder = async (lectureId) => {
    try {
      const response = await fetch("https://ahmedmahmoud10.pythonanywhere.com/create_order_lecture/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwMjM1MTc1LCJpYXQiOjE3Mzk2MzAwNzksImp0aSI6ImZkNmYwZGJlZTI4MDQ3NjE5ZjQwNDU4ZTgxMjM3ZTY1IiwidXNlcl9pZCI6NjZ9.YuRi4yXQMwvo8lZ9DDHkE9X6gd8cF73KOISq6FT8KX4`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lecture: lectureId,
        }),
      });

      if (!response.ok) throw new Error("❌ Failed Fetching Data");

      setMessage("✅ Success Sending Request");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-500 mt-10">⏳Loading..</p>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
  return (
    <>
        <div className=" flex-col">
   
   <Nav/>
   
   <Welcome/>
   
   </div>
   <div className="container mx-auto p-5">
     <motion.h2
       className="text-3xl font-bold text-center mb-10 text-blue-600"
       initial={{ opacity: 0, y: -20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
     >
       📚 Lectures :
     </motion.h2>
   
     {message && <p className="text-center text-green-600 mb-5">{message}</p>}
   
     {lectures.length === 0 ? (
       <p className="text-center text-gray-500 text-lg"> No Lectures Available for this System </p>
     ) : (
       <motion.div
         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
       >
         {lectures.map((lecture, index) => (
           <motion.div
             key={lecture.id}
             className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1, duration: 0.4 }}
           >
             <img src={lecture.img_lecture} alt={lecture.title} className="w-full h-60 object-cover" />
             <div className="p-4">
               <h3 className="text-lg font-semibold text-gray-800">{lecture.title}</h3>
               <p className="text-sm py-1 text-gray-600"><strong>✍️ Instructor:</strong> {lecture.teacher}</p>
               <p className="text-sm py-1 text-gray-600"><strong>📅 Release Date:</strong> {lecture.created_at}</p>
   
               <button
                 onClick={() => handleOrder(lecture.id)}
                 className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
               >
                 🛒 Request a Lecture
               </button>
             </div>
           </motion.div>
         ))}
       </motion.div>
     )}
   </div>
       </>
  )
}
export default  Alllectures;