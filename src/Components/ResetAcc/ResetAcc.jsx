import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../SideBar/Sidebar';

function ResetAccount() {
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = localStorage.getItem("access_token")


  const [selectedOptions, setSelectedOptions] = useState({
    test: false,
    mark: false,
    note: false,
    flash: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions({ ...selectedOptions, [name]: checked });
  };

  const submitReset = async () => {
    const bodyData = {};
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value) {
        bodyData[key] = key; 
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/reset-account/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      toast('Deleted Successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      toast('Error Delete');
    }
  };

  return (
    <div className="flex md:ms-72 min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />

      <div className="p-4 w-full flex flex-col items-center justify-center">
        <div className="bg-gray-100 p-6 rounded-md shadow-xl max-w-xl w-full relative">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 
                0 2.61-1.64 1.94-3L13.94 4a2.08 
                2.08 0 00-3.88 0L3.13 16c-.66 
                1.36.4 3 1.94 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Are You Sure That You Need To Reset Your Account!
          </h2>

          <p className="text-center text-gray-600 mb-6 px-4">
            You'll Lose Your Data Such As Previous Tests, Notes, Marked Questions, 
            And Your Score In Performance.
          </p>

          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600"
            >
              Accept & Reset
            </button>
          </div>

          <div className="flex items-center justify-center text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 
                18a8 
                8 0 100-16 
                8 8 0 000 
                16zm3.707-9.707a1 
                1 0 00-1.414-1.414L9 
                10.172 
                7.707 
                8.879a1 1 0 00-1.414 
                1.414l2 
                2a1 1 0 001.414 
                0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your Subscription End Date will NOT Change, It's safe.</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 
                  8.586l4.293-4.293a1 1 0 011.414 
                  1.414L11.414 10l4.293 
                  4.293a1 1 0 01-1.414 
                  1.414L10 11.414l-4.293 
                  4.293a1 1 0 01-1.414-1.414L8.586 
                  10 4.293 5.707a1 1 0 
                  010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-4">Select The Fields That You Want Reset:</p>

            <div className="mb-4 space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="test"
                  checked={selectedOptions.test}
                  onChange={handleCheckboxChange}
                />
                <span>Tests</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="mark"
                  checked={selectedOptions.mark}
                  onChange={handleCheckboxChange}
                />
                <span>Marked Questions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="note"
                  checked={selectedOptions.note}
                  onChange={handleCheckboxChange}
                />
                <span>Notes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="flash"
                  checked={selectedOptions.flash}
                  onChange={handleCheckboxChange}
                />
                <span>Flashcards</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={submitReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetAccount;
