import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = localStorage.getItem("access_token")


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/book_fileView/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="flex-col">
      <Nav />
      <Welcome />
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800">My Books</h1>
        {loading ? (
          <p className="text-gray-700 mt-2">Loading...</p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {books.map((book) => (
              <div key={book.book__id} className="bg-white shadow-md rounded-lg p-4">
                <img src={book.book__image} alt={book.book__title} className="w-full h-48 object-cover rounded-md" />
                <h2 className="text-xl font-semibold text-blue-700 mt-3">{book.book__title}</h2>
                <p className="text-gray-600 mt-1">Author: {book.book__author}</p>
                <p className="text-gray-600 mt-1">System: {book.book__System__name}</p>
                <p className="text-gray-600 mt-1">University: {book.book__university}</p>
                <p className="text-gray-600 mt-1">Release Date: {book.book__release_date}</p>
                <button
                  onClick={() => navigate(`/pdf-viewer?file=${encodeURIComponent(book.book__pdf_file)}`)}
                  className="mt-3 inline-block bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                >
                  Read Book Online
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 mt-2">No books found.</p>
        )}
      </div>
    </div>
  );
}
