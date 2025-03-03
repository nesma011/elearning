import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import Sidebar from '../SideBar/Sidebar';
import Welcome from '../WelcomeMsg/Welcome';
import face from "../../assets/face.jpg";
import whats from "../../assets/whats.png";
import telegram from "../../assets/telegram.png";
import { NavLink } from 'react-router-dom';
import RadarScore from '../Analytics/RadarScore';
import Score from '../Analytics/Score';
import Usage from '../Analytics/Usage';



export default function QuestionBank() {
  const [activeTab, setActiveTab] = useState('home'); // "home" or "analytics"

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
            {activeTab === 'home' && (
              <div className="flex flex-col gap-4 lg:flex-row mb-10">
                {/* Social Media Section */}
                <div className="bg-gradient-to-r mx-12 px-10 from-green-400 via-blue-500 to-purple-500 animate-gradient text-center p-4 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-4">
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

                {/* Updates Section */}
                <div className="text-center p-6 mx-8 rounded-lg border-4 border-blue-500 dark:border-purple-400 animate-border">
                  <h2 className="text-2xl font-bold mb-3">Updates</h2>
                  <div className="p-4 rounded-lg shadow-lg dark:bg-gray-800">
                    <p className="text-lg font-bold">
                      🚀 Exciting News for All ALEX-MedLearn Preppers! 🎉
                    </p>
                    <p className="mt-2">
                      🧠 The <strong className="font-bold">Question Bank</strong> is now{' '}
                      <span className="font-bold text-green-500 dark:text-green-300">
                        live
                      </span>{' '}
                      and{' '}
                      <span className="font-bold text-blue-500 dark:text-blue-300">
                        ready to use!
                      </span>
                    </p>
                    <p className="mt-4">
                      💪 Take your medical preparation to the next level with our meticulously curated questions and explanations,
                      designed to help you master every concept with confidence!
                    </p>
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
                <RadarScore/>
                <Score/>
                <Usage/>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
