import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";

export default function MyLectures() {
  const [lectures, setlectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = localStorage.getItem("access_token")



  useEffect(() => {
    const fetchlectures = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lecture_data_view/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
        },
        });
        setlectures(response.data.lectures);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lectures:", error);
        setLoading(false);
      }
    };
    fetchlectures();
  }, []);

  return (
    <div className="flex-col">
      <Nav />
      <Welcome />
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800">My lectures</h1>
        {loading ? (
          <p className="text-gray-700 mt-2">Loading...</p>
        ) : lectures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {lectures.map((lecture) => (
              <div key={lecture.lecture__id} className="bg-white shadow-md rounded-lg p-4">
                <img src={lecture.lecture__img_lecture} alt={lecture.lecture__title} className="w-full h-48 object-cover rounded-md" />
                <h2 className="text-xl font-semibold text-blue-700 mt-3">{lecture.lecture__title}</h2>
                <p className="text-gray-600 mt-1">Instructor: {lecture.lecture__teacher}</p>
                <p className="text-gray-600 mt-1">Release Date: {lecture.lecture__created_at}</p>
                <button
             onClick={() => window.open(lecture.lecture__video_url, "_blank")}
            className="mt-3 ml-3 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
            Watch Lecture
           </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 mt-2">No lectures found.</p>
        )}
      </div>
    </div>
  );
}
