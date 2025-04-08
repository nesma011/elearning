import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Home = () => {
  const [data, setData] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/media_content/`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const whatWeDo = data.slice(0, 3);
  const keyFeatures = data.slice(3, 16);


  const formatText = (text) => {
    const keywords = ['Vodafone Cash', 'InstaPay'];
    
    return text.split(new RegExp(`(${keywords.join('|')})`, 'g')).map((part, index) => 
      keywords.includes(part) ? 
        <strong key={index} className="font-bold text-gray-700">{part}</strong> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 ">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center  px-6 py-4  overflow-hidden bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200">
        <div className="absolute inset-0 " />
        <div className="relative z-10 text-center">
          <h1 className="text-7xl font-bold text-white mb-6">
            Welcome to Alex MedLearn!
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-2xl mx-auto">
            We're excited to have you on board! 🚀 
            Alex MedLearn is your gateway to high-quality medical education, providing interactive Tests,
            expert-led content, and a seamless learning experience.
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">
            📚 Explore. Learn. Grow.
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-2xl mx-auto">
            Start your journey today and enhance your medical knowledge with our carefully curated courses.
          </p>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-20 px-6 ">
        <h2 className="text-6xl font-bold text-center text-gray-700 mb-16">
          What We Do ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto ">
          {whatWeDo.map((item) => (
            <div
              key={item.id}
              className="bg-white backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-20 w-20 rounded-full bg-blue-500 mb-6" />
              <h3 className="text-2xl font-bold text-blue-700 mb-4">{item.title}</h3>
              <p className="text-gray-600">{formatText(item.content)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20 px-6 bg-white ">
        <h2 className="text-6xl font-bold text-center text-blue-700 mb-16">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {keyFeatures.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              {item.image && (
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{formatText(item.content)}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;