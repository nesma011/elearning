import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Displayflashcards() {
  const [flashcards, setflashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = localStorage.getItem("access_token")


  const fetchflashcards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/flash-cards/`, {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setflashcards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      setError("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteflashcard = async (flashcardId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/flash-cards/${flashcardId}/`, {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete flashcard");
      }
      setflashcards((prevflashcards) => prevflashcards.filter((flashcard) => flashcard.id !== flashcardId));
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      setError("Failed to delete flashcard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchflashcards();
  }, []);

  return (
    <div className="flex md:ms-72 min-h-screen bg-gradient-to-r from-blue-200 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          My flashcards
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-2">Loading...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {flashcards.map((flashcard) => (
              <motion.div
                key={flashcard.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col justify-between"
              >
                {/* عرض نص الفلاش كارد (الـ front_text) */}
                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    {flashcard.front_text || "Untitled"}
                  </h2>
                </div>
                <div className="flex justify-between mt-4">
                  {/* زر عرض الفلاش كارد في مودال */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
                    onClick={() => setSelectedFlashcard(flashcard)}
                  >
                    Show Card
                  </motion.button>
                  {/* زر حذف الفلاش كارد */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow"
                    onClick={() => handleDeleteflashcard(flashcard.id)}
                  >
                    Delete flashcard
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* مودال عرض تفاصيل الفلاش كارد */}
      {selectedFlashcard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFlashcard(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-4">Flashcard Details</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Front</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedFlashcard.front_text}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Back</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedFlashcard.back_text}
              </p>
            </div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
              onClick={() => setSelectedFlashcard(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
