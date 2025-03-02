import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DisplayNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4",
        },
      });
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/`, {
        method: "DELETE",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex md:ms-72 min-h-screen bg-gradient-to-r from-blue-200 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          My Notes
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-2">Loading...</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    {note.subtitles || "Untitled"}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                    {note.text}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Question:</span> {note.question || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Test:</span> {note.test || "N/A"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  Delete Note
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
