import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Welcome from "../WelcomeMsg/Welcome";
import Nav from "../Nav/Nav";

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const menuItems = [
    { name: "My Books", path: "/mybooks" },
    { name: "My Lectures", path: "/mylectures" },
    { name: "Delete Account", path: "#" },
  ];
  let token = localStorage.getItem("access_token")


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/delete-user/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("Account deleted successfully."); 
          setTimeout(() => {
            window.location.href = "/login"; 
          }, 2000);
        } else {
          toast.error("Failed to delete account. Please try again."); 
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("An error occurred. Please try again later."); 
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-400 to-blue-200 text-blue-600 p-6 shadow-lg
        transform transition-transform duration-300 ease-in-out z-40 w-64 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-white mt-14 md:mt-0">Dashboard</h2>

        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`transform transition-all duration-200 hover:scale-105
              ${item.name === "Delete Account"
                ? "bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                : "bg-white hover:bg-gray-300"}
              p-3 rounded-lg text-lg font-medium`}
              onClick={item.name === "Delete Account" ? handleDeleteAccount : null}
            >
              {item.name === "Delete Account" ? (
                <span className="block w-full h-full">{item.name}</span>
              ) : (
                <a href={item.path} className="block w-full h-full">{item.name}</a>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <main className="transition-all duration-300 ease-in-out p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Nav />
            <Welcome />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
