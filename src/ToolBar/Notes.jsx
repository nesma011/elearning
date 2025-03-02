import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Notes = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const addNote = async () => {
    if (newNote.trim() !== "") {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/notes/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4",
          },
          body: JSON.stringify({ text: newNote }),
        });
        const addedNote = await response.json();
        setNotes(prev => [...prev, addedNote]);
        setNewNote("");
        toast("Added Note Successfully");
      } catch (error) {
        console.error("Error adding note:", error);
        setError("Failed to add note");
      } finally {
        setLoading(false);
      }
    }
  };

 

 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">My Notes</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Add Note Section */}
        <div className="p-4 border-b">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add Your Notes Here.."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none"
          />
          <button
            onClick={addNote}
            disabled={loading}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>

        {/* Notes List */}
        <div className="max-h-[300px] overflow-y-auto p-4">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {notes.length === 0 && !loading && !error && (
            <div className="text-center text-gray-500">No notes yet</div>
          )}

          {loading && !error && (
            <div className="text-center text-gray-500">Loading...</div>
          )}

          <div className="space-y-3">
            {Array.isArray(notes) && notes.map((note, index) => (
              <div 
                key={note.id} 
                className="group bg-gray-50 rounded-lg p-3 relative hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-700 pr-8">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id, index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
