import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useEffect, useState } from "react";
import { FaEnvelope, FaTelegramPlane, FaFacebook, FaPhone } from "react-icons/fa";


export default function ContactUs() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch("https://ahmedmahmoud10.pythonanywhere.com/support/")
      .then((res) => res.json())
      .then((data) => setContact(data[0]))
      .catch((err) => console.error("Error fetching contact details:", err));
  }, []);

  if (!contact) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (<>
  <Navbar/>
  <section className='head flex flex-col justify-center items-center bg-blue-900 py-40' > 
   <h2 className='text-6xl text-white font-bold py-3 '>Contact Us</h2>
   <p className='text-2xl text-white md:w-1/3  py-3 text-center'>Feel free to contact us anytime if you have any questions or needs by Whatsapp or email.</p>
  </section>

  <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-500 mb-20 to-purple-600 shadow-xl rounded-3xl p-8 mt-10 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 rounded-3xl"></div>
      <h2 className="text-3xl font-extrabold text-center mb-6">Get in Touch</h2>
      <div className="space-y-6 relative z-10">
        <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
          <FaEnvelope className="text-yellow-300 text-xl" />
          <a href={`mailto:${contact.email_1}`} className="text-lg font-medium">{contact.email_1}</a>
        </div>
        <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
          <FaEnvelope className="text-yellow-300 text-xl" />
          <a href={`mailto:${contact.email_2}`} className="text-lg font-medium">{contact.email_2}</a>
        </div>
        <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
          <FaTelegramPlane className="text-blue-300 text-xl" />
          <a href={contact.telegram_link} target="_blank" rel="noopener noreferrer" className="text-lg font-medium">Telegram</a>
        </div>
        <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
          <FaFacebook className="text-blue-400 text-xl" />
          <a href={contact.facebook_kink} target="_blank" rel="noopener noreferrer" className="text-lg font-medium">Facebook</a>
        </div>
        <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
          <FaPhone className="text-green-300 text-xl" />
          <a href={`tel:${contact.phone_number}`} className="text-lg font-medium">{contact.phone_number}</a>
        </div>
      </div>
    </div>
  <Footer/>
  </>
  )
}
