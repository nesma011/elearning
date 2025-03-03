import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Flashcards = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [tags, setTags] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token =
  localStorage.getItem("access_token") 

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/flash-cards/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Failed to load flashcards");
    }
  };

  const handleAddCard = async () => {

    const formData = new FormData();
    formData.append('front_text', frontText);
    formData.append('back_text', backText);
    formData.append('tag', tags);

    try {
      const response = await fetch(`${API_BASE_URL}/flash-cards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error creating new card");
      }

      const newCard = await response.json();
      setCards(prev => [...prev, newCard]);
      setFrontText("");
      setBackText("");
      setTags("");
      toast.success("Flashcard added successfully");
      setShowForm(false);
      fetchFlashcards(); 
    } catch (error) {
      console.error("Error adding new card:", error);
      toast.error("Failed to create flashcard");
    }
  };

  const filteredCards = cards.filter((card) =>
    card.front_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-auto bg-gray-100">
    {/* Header */}
    <div className="bg-[#4a6da7] text-white p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Flashcards</h2>
      <div className="flex gap-2">
        <button className="p-1 hover:bg-blue-600 rounded">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M3 12h18M3 6h18M3 18h18"
            />
          </svg>
        </button>
        <button className="p-1 hover:bg-blue-600 rounded">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Search Bar */}
    <div className="p-4 border-b bg-white">
      <div className="flex items-center border rounded-lg px-3 py-2">
        <svg
          className="w-5 h-5 text-gray-400 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 
            1110.89 3.476l4.817 4.817a1 1 0 01-1.414 
            1.414l-4.816-4.816A6 6 0 012 8z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* This Question Section */}
    <div className="p-4">
      <h3 className="text-green-600 text-lg font-medium mb-4">This Question</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add New Card Button */}
        <div
          onClick={() => setShowForm(true)}
          className="bg-white rounded-lg border-2 border-dashed border-green-500 
                     p-6 flex flex-col items-center justify-center 
                     cursor-pointer hover:bg-green-50 transition-colors"
        >
          <div className="text-green-500 text-4xl mb-2">+</div>
          <span className="text-green-600 font-medium">New Card</span>
        </div>

        {/* Flashcards */}
        {filteredCards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-white rounded-lg border overflow-x-auto p-4 hover:shadow-lg transition-shadow"
          >
            <h4 className="font-medium text-gray-800 mb-2">
              {card.front_text?.length > 50
                ? card.front_text.slice(0, 50) + "..."
                : card.front_text}
            </h4>
            <p className="text-gray-600 text-sm">
              {card.back_text?.length > 75
                ? card.back_text.slice(0, 75) + "..."
                : card.back_text}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Create Flashcard Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Create Flashcard</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
         

            {/* Front & Back Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-100 px-3 py-2 rounded-t-lg">
                  <span className="font-medium"> Question </span>
                </div>
                <textarea
                  className="w-full border rounded-b-lg p-4 min-h-[300px] 
                             focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  placeholder="Enter front text..."
                />
              </div>
              <div>
                <div className="bg-gray-100 px-3 py-2 rounded-t-lg">
                  <span className="font-medium">Answer</span>
                </div>
                <textarea
                  className="w-full border rounded-b-lg p-4 min-h-[300px] 
                             focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  placeholder="Enter back text..."
                />
              </div>
            </div>

            {/* Tags Input */}
            <div className="mt-6">
              <input
                type="text"
                placeholder="Tags"
                className="w-full border rounded-lg px-4 py-2 
                           focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
            <button
              onClick={handleAddCard}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Flashcard
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Flashcards;