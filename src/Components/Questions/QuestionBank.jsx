import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import Sidebar from '../SideBar/Sidebar';
import Welcome from '../WelcomeMsg/Welcome';
import face from "../../../public/face.jpg";
import whats from "../../../public/whats.png";
import telegram from "../../../public/telegram.png";
import { NavLink } from 'react-router-dom';
import RadarScore from '../Analytics/RadarScore';
import Score from '../Analytics/Score';
import Usage from '../Analytics/Usage';

export default function QuestionBank() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [updates, setUpdates] = useState([]); 
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

  useEffect(() => {
    const fetchUpdates = async () => {
      const token = localStorage.getItem('access_token'); 
      try {
        const response = await fetch(`${API_BASE_URL}/update/`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!response.ok) {
          throw new Error('Error getting data');
        }
        const data = await response.json(); 
        setUpdates(data); 
      } catch (error) {
        console.error('error gitting updates', error);
      }
    };
    fetchUpdates();
  }, [API_BASE_URL]); 

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-72">
        <Nav hasSidebar={true} />
        <main className="flex-1">
          <Welcome />

          <div className="p-6">
            {/* Tabs Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-6 py-2 rounded-lg text-lg font-semibold ${
                  activeTab === 'home'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-2 rounded-lg text-lg font-semibold ${
                  activeTab === 'analytics'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Home Tab Content */}
            {/* Home Tab Content */}
            {activeTab === 'home' && (
              <div className="flex flex-col gap-4 lg:flex-row mb-10">
                {/* Social Media Section - Fixed Position */}
                <div className="fixed top-20 left-0 z-10 bg-gradient-to-r mx-12 px-10 from-green-400 via-blue-500 to-purple-500 animate-gradient text-center p-4 rounded-lg shadow-lg">
                  <h2 className="text-black dark:text-white font-bold text-lg mb-3">
                    Follow Us For More Offers:
                  </h2>
                  <div className="flex justify-center gap-4 pt-8">
                    <NavLink to="https://www.facebook.com/share/18aNvC8sCJ/">
                      <img src={face} alt="Facebook" className="w-10" />
                    </NavLink>
                    <NavLink to="https://wa.me/201229733297">
                      <img src={whats} alt="WhatsApp" className="w-10" />
                    </NavLink>
                    <NavLink to="https://t.me/ddfffgry">
                      <img src={telegram} alt="Telegram" className="w-10" />
                    </NavLink>
                  </div>
                </div>
                
                {/* Added margin to prevent overlap with fixed element */}
                <div className="lg:ml-64">
                  {/* Updates Section with Ramadan Greeting */}
                  <div className="text-center p-6 mx-8">
                    {/* Ramadan Kareem Heading */}
                    <h1 className="text-4xl font-bold mb-6 text-amber-500 dark:text-amber-400">
                      Ramadan Kareem 🌙🌙
                    </h1>
                    
                    <h2 className="text-2xl font-bold mb-3">Updates</h2>
                    <div className="flex flex-col gap-4">
                      {updates && updates.length > 0 ? (
                        updates.map((update, index) => (
                          <div
                            key={index}
                            className="p-6 bg-white dark:bg-gray-800 rounded-lg border-4 border-blue-500 dark:border-purple-400 animate-border text-center relative"
                          >
                            {update.text ? (
                              <div dangerouslySetInnerHTML={{ __html: update.text }} />
                            ) : (
                              <div dangerouslySetInnerHTML={{ __html: update }} />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center">No updates available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab Content */}
            {activeTab === 'analytics' && (
              <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  Analytics Overview
                </h2>
                <RadarScore />
                <Score />
                <Usage />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}