import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PerformanceDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [systems, setSystems] = useState([]);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedSystem, setExpandedSystem] = useState(null);
  const [expandedSubtitle, setExpandedSubtitle] = useState(null);
  const [subjectPerformance, setSubjectPerformance] = useState(null);
  const [systemPerformance, setSystemPerformance] = useState(null);
  const [subtitlePerformance, setSubtitlePerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { yearId } = useParams();
  

  const token = `Bearer  ${localStorage.getItem("access_token")}`;


  // Function to fetch data
  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': token
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Fetching error:", error);
      setError("Failed to fetch data. Please try again later.");
      return null;
    }
  };

  // Fetch initial data 
  useEffect(() => {
    // Reset states when yearId changes
    setExpandedSubject(null);
    setExpandedSystem(null);
    setExpandedSubtitle(null);
    setSubjectPerformance(null);
    setSystemPerformance(null);
    setSubtitlePerformance(null);
    
    const fetchInitialData = async () => {
      setLoading(true);
      const data = await fetchData(`${API_BASE_URL}/subjects/${yearId}/`);
      if (data) {
        // Use Set to ensure unique subjects and systems by ID
        const uniqueSubjects = Array.from(
          new Map(data.subjects.map(subject => [subject.id, subject])).values()
        );
        const uniqueSystems = Array.from(
          new Map(data.systems.map(system => [system.id, system])).values()
        );
        
        setSubjects(uniqueSubjects || []);
        setSystems(uniqueSystems || []);
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [yearId, API_BASE_URL]);

  // Handle subject expansion/collapse
  const toggleSubject = async (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
      setSubjectPerformance(null);
    } else {
      setLoading(true);
      const performance = await fetchData(`${API_BASE_URL}/performance/subject/${subjectId}/`);
      if (performance) {
        setSubjectPerformance(performance.performance);
        setExpandedSubject(subjectId);
      }
      setLoading(false);
    }
  };

  // Handle system expansion/collapse
  const toggleSystem = async (systemId) => {
    if (expandedSystem === systemId) {
      setExpandedSystem(null);
      setSystemPerformance(null);
      setExpandedSubtitle(null);
      setSubtitlePerformance(null);
    } else {
      setLoading(true);
      const performance = await fetchData(`${API_BASE_URL}/performance/system/${systemId}/`);
      if (performance) {
        setSystemPerformance(performance.performance);
        setExpandedSystem(systemId);
      }
      setLoading(false);
    }
  };

  // Handle subtitle expansion/collapse
  const toggleSubtitle = async (subtitleId) => {
    if (expandedSubtitle === subtitleId) {
      setExpandedSubtitle(null);
      setSubtitlePerformance(null);
    } else {
      setLoading(true);
      const performance = await fetchData(`${API_BASE_URL}/performance/subtitle/${subtitleId}/`);
      if (performance) {
        setSubtitlePerformance({...performance.performance, subtitleId});
        setExpandedSubtitle(subtitleId);
      }
      setLoading(false);
    }
  };

  // Render performance chart
  const PerformanceChart = ({ performance }) => {
    if (!performance) return null;
    
    const total = performance.correct + performance.incorrect + performance.unanswered;
    const correctPercentage = total > 0 ? (performance.correct / total) * 100 : 0;
    const incorrectPercentage = total > 0 ? (performance.incorrect / total) * 100 : 0;
    const unansweredPercentage = total > 0 ? (performance.unanswered / total) * 100 : 0;

    return (
      <div className="flex items-center justify-between w-full my-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
            <span className="text-green-500">Used:</span>
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white mr-2">
                <span>{performance.used}</span>
              </div>
            </div>
            <div className="flex items-center">
            <span className="text-green-500">Correct:</span>
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white mr-2">
                <span>{performance.correct}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">Unused:</span>
            <div className="w-12 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white">
              <span>{performance.unused}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">Total Questions:</span>
            <div className="w-12 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white">
              <span>{performance.total_questions}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
            <span className="text-red-500">Incorrect:</span>
              <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center text-white mr-2">
                <span>{performance.incorrect}</span>
              </div>
            </div>
            <div className="flex items-center">
            <span className="text-yellow-500">Unanswered:</span>
              <div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center text-white mr-2">
                <span>{performance.unanswered}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-32 h-32 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#4ade80" 
              strokeWidth="20"
              strokeDasharray={`${correctPercentage * 2.51} ${200 - correctPercentage * 2.51}`}
              transform="rotate(-90 50 50)"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#ef4444" 
              strokeWidth="20"
              strokeDasharray={`${incorrectPercentage * 2.51} ${200 - incorrectPercentage * 2.51}`}
              strokeDashoffset={`${-(correctPercentage * 2.51)}`}
              transform="rotate(-90 50 50)"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#eab308" 
              strokeWidth="20"
              strokeDasharray={`${unansweredPercentage * 2.51} ${200 - unansweredPercentage * 2.51}`}
              strokeDashoffset={`${-((correctPercentage + incorrectPercentage) * 2.51)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-white">Correct</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-white">Incorrect</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
            <span className="text-white">Unanswered</span>
          </div>
        </div>
      </div>
    );
  };

  // Small performance chart for legends on the right side
  const SmallPerformanceChart = () => {
    return (
      <div className="flex flex-col space-y-2 my-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="text-white">Correct</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span className="text-white">Incorrect</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span className="text-white">Unanswered</span>
        </div>
      </div>
    );
  };

  if (loading && !subjects.length && !systems.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-900 text-white p-4 my-4">
      {/* Subjects Section */}
      <div className="mb-8">
        <div className="bg-gray-900 border-b border-gray-800 p-3 mb-2 flex items-center">
          <div className="bg-red-600 w-4 h-4 mr-2"></div>
          <h2 className="text-xl font-bold">Subjects Performance</h2>
        </div>
        
        {subjects.map((subject) => (
          <div key={subject.id} className="mb-2">
            <div 
              className="flex items-center justify-between p-3 border-t border-gray-800 cursor-pointer bg-gray-900 hover:bg-gray-800"
              onClick={() => toggleSubject(subject.id)}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>{subject.name}</span>
              </div>
              <div className="text-xl">{expandedSubject === subject.id ? '-' : '+'}</div>
            </div>
            
            {expandedSubject === subject.id && (
              <div className="p-4 bg-gray-900 border-t border-gray-800">
                <PerformanceChart performance={subjectPerformance} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Systems Section */}
      <div>
        <div className="bg-gray-900 border-b border-gray-800 p-3 mb-2 flex items-center">
          <div className="bg-red-600 w-4 h-4 mr-2"></div>
          <h2 className="text-xl font-bold">Systems Performance</h2>
        </div>
        
        {systems.map((system) => (
          <div key={system.id} className="mb-2">
            <div 
              className="flex items-center justify-between p-3 border-t border-gray-800 cursor-pointer bg-gray-900 hover:bg-gray-800"
              onClick={() => toggleSystem(system.id)}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>{system.name}</span>
              </div>
              <div className="text-xl">{expandedSystem === system.id ? '-' : '+'}</div>
            </div>
            
            {expandedSystem === system.id && (
              <div className="p-4 bg-gray-900 border-t border-gray-800">
                <PerformanceChart performance={systemPerformance} />
                
                {/* Subsystems Section */}
                {system.subtitles && system.subtitles.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-gray-800 border border-gray-700 p-3 mb-2 flex items-center">
                      <div className="bg-red-600 w-4 h-4 mr-2"></div>
                      <h3 className="text-lg font-bold">Subsystems Performance</h3>
                    </div>
                    
                    {system.subtitles.map((subtitle) => (
                      <div key={subtitle.id} className="mb-2">
                        <div 
                          className="flex items-center justify-between p-3 border-t border-gray-700 cursor-pointer bg-gray-800 hover:bg-gray-700"
                          onClick={() => toggleSubtitle(subtitle.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>{subtitle.name}</span>
                          </div>
                          <div className="text-xl">{expandedSubtitle === subtitle.id ? '-' : '+'}</div>
                        </div>
                        
                        {expandedSubtitle === subtitle.id && subtitlePerformance && subtitlePerformance.subtitleId === subtitle.id && (
                          <div className="p-4 bg-gray-800 border-t border-gray-700">
                            <PerformanceChart performance={subtitlePerformance} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceDashboard;