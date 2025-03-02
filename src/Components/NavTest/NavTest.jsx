import { useState, useEffect } from "react";
import Notes from '../../ToolBar/Notes';
import Flashcards from '../../ToolBar/FlashCards';
import Calculator from '../../ToolBar/Calculator';
import LabValues from '../../ToolBar/LabValue';

const NavTest = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    document.body.style.zoom = `${zoom}%`;
    return () => {
      document.body.style.zoom = "100%";
    };
  }, [zoom]);

  const handleComponentClick = (component) => {
    setActiveComponent(activeComponent === component ? null : component);
  };

  const toggleHighlight = () => {
    setHighlight(!highlight);
  };

  const adjustZoom = (e) => {
    setZoom(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => handleComponentClick('notes')}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${
                  activeComponent === 'notes' ? 'bg-blue-700' : ''
                }`}
              >
                📝 Add Note
              </button>

              <button
                onClick={() => handleComponentClick('flashcards')}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${
                  activeComponent === 'flashcards' ? 'bg-blue-700' : ''
                }`}
              >
                🗂️ Flashcards
              </button>

              <button
                onClick={toggleHighlight}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${
                  highlight ? 'bg-blue-700' : ''
                }`}
              >
                ✨ Highlight {highlight ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => handleComponentClick('calculator')}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${
                  activeComponent === 'calculator' ? 'bg-blue-700' : ''
                }`}
              >
                🔢 Calculator
              </button>

              <button
                onClick={() => handleComponentClick('labvalues')}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${
                  activeComponent === 'labvalues' ? 'bg-blue-700' : ''
                }`}
              >
                🧪 Lab Values
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => handleComponentClick("settings")}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500"
              >
                ⚙️ More
              </button>

              {activeComponent === "settings" && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Zoom
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={zoom}
                          onChange={adjustZoom}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 min-w-[4rem]">
                          {zoom}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={toggleHighlight}
                        className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Highlighting {highlight ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {activeComponent === "notes" && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <Notes onClose={() => setActiveComponent(null)} />
            <button
              onClick={() => setActiveComponent(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeComponent === "flashcards" && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <Flashcards />
            <button
              onClick={() => setActiveComponent(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeComponent === "calculator" && (
        <div className="fixed bottom-0 right-0 bg-white shadow-lg p-4 z-50 ">
          <Calculator />
        </div>
      )}

      {activeComponent === "labvalues" && (
        <div className="fixed bottom-20 right-0 bg-white shadow-lg p-4 z-50 h-[500px] ">
          <LabValues />
        </div>
      )}
    </div>
  );
};

export default NavTest;
