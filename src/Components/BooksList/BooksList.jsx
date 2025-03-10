import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Nav from "../Nav/Nav";
import Welcome from "../WelcomeMsg/Welcome";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { systemId } = useParams();
 const navigate = useNavigate();
 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 let token = localStorage.getItem("access_token")
 
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books_System/${systemId}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("❌ Error Fetching Data");

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [systemId]);

  const handleOrder = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create_order_book/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book: bookId,
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
    📚 Books :
  </motion.h2>

  {message && <p className="text-center text-green-600 mb-5">{message}</p>}

  {books.length === 0 ? (
    <p className="text-center text-gray-500 text-lg"> No Books Available for this System </p>
  ) : (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <img src={book.image} alt={book.title} className="w-full h-60 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
            <p className="text-sm py-1 text-gray-600"><strong>✍️ Author:</strong> {book.author}</p>
            <p className="text-sm py-1 text-gray-600"><strong>🏛️ University:</strong> {book.university}</p>
            <p className="text-sm py-1 text-gray-600"><strong>📅 Release Date:</strong> {book.release_date}</p>

            <button
              onClick={() => handleOrder(book.id)}
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Request a Book
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}
</div>
    </>
   
  );
};

export default BooksList;
