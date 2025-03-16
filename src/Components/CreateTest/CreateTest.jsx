import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { useNavigate, useParams } from "react-router-dom";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export default function CreateTest() {

const ErrorBoundary = ({children}) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error) => {
      console.error('Caught in error boundary:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Sorry ! , Error happened </h2>
          <p className="mb-4">Please Wait for getting Data or Reload Page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
                  Reload Page          </button>
        </div>
      </div>
    );
  }
  
  return children;
};


  const [mode, setMode] = useState("tutor");
  const [subjects, setSubjects] = useState([]);
  const [systems, setSystems] = useState([]);
  const [allSystems, setAllSystems] = useState([]);
  const [questionCount, setQuestionCount] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [selectedSubtitles, setSelectedSubtitles] = useState([]);
  const [openSystems, setOpenSystems] = useState({});
  const [testName, setTestName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemRequests, setSystemRequests] = useState({});
  const [subtitleSearch, setSubtitleSearch] = useState({});
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showUnanswered, setShowUnanswered] = useState(false);
  const [showHighYield, setShowHighYield] = useState(false); 
  const [unansweredCount, setUnansweredCount] = useState(0);
const [incorrectCount, setIncorrectCount] = useState(0);


  const navigate = useNavigate();
  const { yearId } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = 
   localStorage.getItem("access_token") 


  const authToken = `Bearer ${token}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        if (!yearId) {
          throw new Error("Year ID is required");
        }
  
        let endpoint = `${API_BASE_URL}/subjects/${yearId}/`;
        if (showIncorrect) {
          endpoint = `${API_BASE_URL}/field_quetion/${yearId}/`;
        } else if (showUnanswered) {
          endpoint = `${API_BASE_URL}/unanswer_quetion/${yearId}/`;
        }
  
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": authToken,
          },
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("API Response:", data);
  
        // Ensure arrays
        setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
        setSystems(Array.isArray(data.systems) ? data.systems : []);
        setAllSystems(Array.isArray(data.systems) ? data.systems : []);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [yearId, API_BASE_URL, showIncorrect, showUnanswered]);



  useEffect(() => {
    const fetchSystems = async () => {
      try {
        if (selectedSubjects.length === 0) {
          setSystems(allSystems);
          setSelectedSystems([]);
          setSelectedSubtitles([]);
          return;
        }
  
        let systemEndpoint = `${API_BASE_URL}/systems/`;
        let bodyData = {
          subject_id: selectedSubjects,
          group_id: parseInt(yearId),
        };
  
        if (showIncorrect) {
          systemEndpoint = `${API_BASE_URL}/systems_filed/`;
          bodyData = { subject_id: selectedSubjects };
        } else if (showUnanswered) {
          systemEndpoint = `${API_BASE_URL}/systems_unanswer/`;
          bodyData = { subject_id: selectedSubjects };
        } else if (showHighYield) {
          systemEndpoint = `${API_BASE_URL}/system_hight_question/`;
          bodyData = {
            subject_id: selectedSubjects,
            group_id: parseInt(yearId),
          };
        }
  
        const response = await fetch(systemEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
          body: JSON.stringify(bodyData),
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching systems: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Systems Response:", data);
  
        
        setSystems(Array.isArray(data.systems) ? data.systems : Array.isArray(data) ? data : []);
        setSelectedSystems([]);
        setSelectedSubtitles([]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchSystems();
  }, [selectedSubjects, allSystems, yearId, API_BASE_URL, showIncorrect, showUnanswered, showHighYield]);


  useEffect(() => {
    const fetchCounts = async () => {
      if (!yearId) return;
      try {
        const incResponse = await fetch(`${API_BASE_URL}/field_quetion/${yearId}/`, {
          headers: { "Authorization": authToken },
        });
        if (incResponse.ok) {
          const incData = await incResponse.json();
          setIncorrectCount(incData.incorrect_count || 0);
        }
  
        const unResponse = await fetch(`${API_BASE_URL}/unanswer_quetion/${yearId}/`, {
          headers: { "Authorization": authToken },
        });
        if (unResponse.ok) {
          const unData = await unResponse.json();
          setUnansweredCount(unData.unanswer || 0);
        }
      } catch (err) {
        console.error("Error getting data", err);
      }
    };
    fetchCounts();
  }, [yearId, API_BASE_URL]);

  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setQuestionCount("");
    } else {
      setQuestionCount(e.target.value);
    }
  };
  useLayoutEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [questionCount]);

  const handleIncorrectChange = (e) => {
    const checked = e.target.checked;
    setShowIncorrect(checked);
    if (checked) {
      setShowUnanswered(false);
      setShowHighYield(false);
    }
  };

  const handleUnansweredChange = (e) => {
    const checked = e.target.checked;
    setShowUnanswered(checked);
    if (checked) {
      setShowIncorrect(false);
      setShowHighYield(false);
    }
  };

  const handleHighYieldChange = (e) => {
    const checked = e.target.checked;
    setShowHighYield(checked);
    if (checked) {
      setShowIncorrect(false);
      setShowUnanswered(false);
    }
  };

  const handleSystemChange = (systemId) => {
    if (selectedSystems.includes(systemId)) {
      setSelectedSystems(prev => prev.filter(id => id !== systemId));
    } else {
      setSelectedSystems(prev => [...prev, systemId]);
    }
  };
  

  const toggleSubtitles = (systemId) => {
    setOpenSystems(prev => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  const handleSubtitleChange = (subtitleId) => {
    let newSelectedSubtitles;
    if (selectedSubtitles.includes(subtitleId)) {
      newSelectedSubtitles = selectedSubtitles.filter(id => id !== subtitleId);
      const parentSystem = systems.find(
        system => system.subtitles && system.subtitles.some(sub => sub.id === subtitleId)
      );
      if (parentSystem) {
        const systemSubtitleIds = parentSystem.subtitles.map(sub => sub.id);
        const stillSelected = newSelectedSubtitles.filter(id =>
          systemSubtitleIds.includes(id)
        );
        if (stillSelected.length === 0) {
          setSelectedSystems(prev => prev.filter(id => id !== parentSystem.id));
        }
      }
    } else {
      newSelectedSubtitles = [...selectedSubtitles, subtitleId];
      const parentSystem = systems.find(
        system => system.subtitles && system.subtitles.some(sub => sub.id === subtitleId)
      );
      if (parentSystem && !selectedSystems.includes(parentSystem.id)) {
        setSelectedSystems(prev => [...prev, parentSystem.id]);
      }
    }
    setSelectedSubtitles(newSelectedSubtitles);
  };
  

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAllSubjectsChange = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map(subject => subject.id));
    }
  };

  const handleAllSystemsChange = () => {
    const selectableSystemIds = systems
      .filter(system => system.status === "free" || system.open_user === true)
      .map(system => system.id);
    
    if (selectedSystems.length === selectableSystemIds.length) {
      setSelectedSystems([]);
    } else {
      setSelectedSystems(selectableSystemIds);
    }
  }

  const handleRequest = async (systemId) => {

    if (systemRequests[systemId] === "pending" || systemRequests[systemId] === "approved") return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/call-system/create/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({ id_system: systemId })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Request successful:", data);
  
      if (data.open_user) {
        setSystemRequests(prev => ({ ...prev, [systemId]: "approved" }));
      } else {
        toast.info("Please wait for admin approval");
        setSystemRequests(prev => ({ ...prev, [systemId]: "pending" }));
      }
    } catch (error) {
      console.error("Request error:", error);
      toast.error("Request failed, please try again");
      setSystemRequests(prev => ({ ...prev, [systemId]: undefined }));
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleCreateTest = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (isLoading || systems.length === 0) {
      toast.warning("Loading Data , Please Wait");
      return;
    }
    setIsSubmitting(true);
  
    try {
      if (selectedSubjects.length === 0 || selectedSystems.length === 0 || !questionCount) {
        toast.warning("Please select subjects, systems, and question count");
        setIsSubmitting(false);
        return;
      }
  
      const parsedQuestionCount = parseInt(questionCount) || 1;
      const totalTime = mode === "timed" ? parsedQuestionCount * 1.5 : null;
  
      let createTestEndpoint = "";
      let bodyData = {
        count: parsedQuestionCount,
        id_subtitels: selectedSubtitles,
        type_test: mode === "timed" ? "time_mode" : "normal_test",
      };
  
      if (showIncorrect) {
        createTestEndpoint = `${API_BASE_URL}/create_Test_from_field_quetions/`;
      } else if (showUnanswered) {
        createTestEndpoint = `${API_BASE_URL}/create_Test_from_unanswer_quetions/`;
      } else if (showHighYield) {
        createTestEndpoint = `${API_BASE_URL}/Hight_heeld_question/`;
      } else {
        createTestEndpoint = `${API_BASE_URL}/test/create/`;
      }
  
      console.log("Creating test with:", { endpoint: createTestEndpoint, data: bodyData });
  
      const response = await fetch(createTestEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(bodyData),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error:", response.status, errorData);
        throw new Error(`Failed to create test: ${response.status}`);
      }
  
      const result = await response.json();
      
      function reorderLinkedPairs(questions) {
        const byId = {};
        questions.forEach((q) => {
          byId[q.id] = q;
        });
      
        const reordered = [];
        const usedIds = new Set();
      
        for (let q of questions) {
          if (usedIds.has(q.id)) continue;
      
          if (q.link_type !== "linked" || !q.linked_questions) {
            reordered.push(q);
            usedIds.add(q.id);
      
            const child = questions.find(
              (x) => x.link_type === "linked" && x.linked_questions === q.id
            );
            if (child) {
              reordered.push(child);
              usedIds.add(child.id);
            }
          } else {
            const parentId = q.linked_questions;
            const parent = byId[parentId];
      
            if (parent && !usedIds.has(parent.id)) {
              reordered.push(parent);
              usedIds.add(parent.id);
            }
      
            reordered.push(q);
            usedIds.add(q.id);
          }
        }
      
        return reordered;
      }
      
      function assignGroupData(questions) {
        let i = 0;
        while (i < questions.length) {
          const parent = questions[i];
          
          if (parent.link_type !== 'linked') {
      
            let j = i + 1;
            const children = [];
            while (
              j < questions.length &&
              questions[j].link_type === 'linked' &&
              questions[j].linked_questions === parent.id
            ) {
              children.push(questions[j]);
              j++;
            }
            
            const groupSize = 1 + children.length;
            parent.groupSize = groupSize;
            parent.groupIndex = 1;
      
            children.forEach((child, idx) => {
              child.groupSize = groupSize;
              child.groupIndex = idx + 2; 
            });
      
            i = j;
          } else {
            
            parent.groupSize = 1;
            parent.groupIndex = 1;
            i++;
          }
        }
      
        return questions;
      }
      
      // Process the questions
      if (result.questions && Array.isArray(result.questions)) {
        const finalQuestions = reorderLinkedPairs(result.questions);
        const withGroups = assignGroupData(finalQuestions);
        result.questions = withGroups;
      } else {
        console.warn("Warning: No questions found in API response", result);
        toast.warning("No questions found for the selected criteria.");
        setIsSubmitting(false);
        return;
      }
  
      const highYieldQuestions = result.questions?.filter(
        (question) => question.high_question === true
      ) || [];
  
      if (showHighYield && highYieldQuestions.length === 0) {
        toast.warning("No high yield questions found for the selected subtitles.");
        setIsSubmitting(false);
        return;
      }
      
      localStorage.setItem("testData", JSON.stringify(result));
  
      // Create a descriptive test name if none provided
      const defaultTestName = showHighYield 
        ? "High Yield Test" 
        : showIncorrect 
          ? "Incorrect Questions Test" 
          : showUnanswered 
            ? "Unanswered Questions Test" 
            : "Custom Test";
  
      navigate(`/test/${yearId}`, {
        state: {
          testName: testName || defaultTestName,
          selectedSubjects,
          selectedSystems,
          questionCount: showHighYield ? highYieldQuestions.length : parsedQuestionCount,
          selectedSubtitles,
          mode,
          totalTime,
          createdTestId: result.test_id,
          isHighYield: showHighYield,
          isIncorrect: showIncorrect,
          isUnanswered: showUnanswered
        },
      });
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(`Failed to create test: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const systemCountKey = showHighYield
  ? 'count_question_hight'  
  : showIncorrect
  ? 'count_question_field'
  : showUnanswered
  ? 'count_question_unanswer'
  : 'count_question'; 

const subtitleCountKey = showHighYield
  ? 'subtitles_remaining'  
  : showIncorrect
  ? 'field'
  : showUnanswered
  ? 'unanswer'
  : 'subtitles_remaining'; 


  if (!yearId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>Year ID is required</p>
        </div>
      </div>
    );
  }

  return (
   < ErrorBoundary>
   
    <>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 w-full md:ml-72">
          <nav className="bg-white dark:bg-gray-800 pt-4 pl-10">
            <h1 className="text-6xl font-semibold ms-20">Create Test</h1>
          </nav>

          <div className="p-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMode("tutor")}
                >
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                      mode === "tutor" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-gray-200 w-5 h-5 rounded-full shadow-md transform transition-all ${
                        mode === "tutor" ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span className={`font-medium ${mode === "tutor" ? "text-black" : "text-gray-500 dark:text-gray-300"}`}>
                    Tutor Mode
                  </span>
                </div>

                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMode("timed")}
                >
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                      mode === "timed" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-gray-200 w-5 h-5 rounded-full shadow-md transform transition-all ${
                        mode === "timed" ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span className={`font-medium ${mode === "timed" ? "text-black" : "text-gray-500 dark:text-gray-300"}`}>
                    Timed Mode
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Test Name:</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Enter test name"
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">
                <p className="text-xl font-bold">Error</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <div className="border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 flex-wrap">
                      <h2 className="text-xl font-bold">Choose Subject</h2>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.length === subjects.length && subjects.length > 0}
                          onChange={handleAllSubjectsChange}
                          className="w-4 h-4"
                        />
                        <span>Check All Subjects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showIncorrect}
                          onChange={handleIncorrectChange}
                          className="w-4 h-4"
                        />
                        <span className="text-red-600">Incorrect Questions ({incorrectCount})</span>                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showUnanswered}
                          onChange={handleUnansweredChange}
                          className="w-4 h-4"
                        />
                        <span className="text-green-600">Unanswered Questions ({unansweredCount})</span>                      </div>
                      <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showHighYield}
                        onChange={handleHighYieldChange} 
                        className="w-4 h-4"
                      />
                      <span className="text-yellow-500 font-semibold">High Yield Questions</span>
                    </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...new Map(subjects.map((item) => [item.name, item])).values()]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2 p-2 border rounded border-gray-200 dark:border-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject.id)}
                          onChange={() => handleSubjectChange(subject.id)}
                          className="w-4 h-4"
                        />
                        <span>{subject.name}</span>
                        <span className="text-green-600 mx-2">({subject.count_question || 0})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <div className="border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-bold">Choose System</h2>
                      <div className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        checked={
                          selectedSystems.length === systems.filter(s => s.status === "free" || s.open_user === true).length &&
                          systems.filter(s => s.status === "free" || s.open_user === true).length > 0
                        }
                        onChange={handleAllSystemsChange}
                          className="w-4 h-4"
                        />
                        <span>Check All Systems</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {systems.map((system) => (
                      <div key={system.id} className="p-4 border rounded border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              disabled={system.status !== "free" && system.open_user !== true}
                              checked={selectedSystems.includes(system.id)}
                              onChange={() => handleSystemChange(system.id)}
                              className="w-4 h-4"
                            />
                            <span>{system.name}</span>
                            <span className="text-green-600 mx-2">({system[systemCountKey] || 0})</span>
                            
                          </div>
                          <div className="flex items-center space-x-2">
                          {system.status === "paid" && system.open_user !== true && (                            <button
                              onClick={() => handleRequest(system.id)}
                              disabled={system.open_user === "waiting" || systemRequests[system.id] === "pending"}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                            >
                              {system.open_user === "waiting" || systemRequests[system.id] === "pending" ? "Pending" : "Request"}
                            </button>
                          )}
                          
                          
                            <button
                              onClick={() => toggleSubtitles(system.id)}
                              className="text-blue-500 mt-4"
                            >
                              {openSystems[system.id] ? (
                                <FiMinusCircle size={20} />
                              ) : (
                                <FiPlusCircle size={20} />
                              )}
                            </button>
                          </div>
                        </div>


                        {openSystems[system.id] &&
                          system.subtitles &&
                          system.subtitles.length > 0 && (
                        
                             <div className="mt-2 ml-6 border-l-2 pl-3 border-gray-200 dark:border-gray-700">
                              {system.subtitles.map((subtitle) => (
                                <div key={subtitle.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubtitles.includes(subtitle.id)}
                                    onChange={() => handleSubtitleChange(subtitle.id)}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">{subtitle.name}</span>
                                  <span className="text-xs text-green-600 ml-2">({subtitle[subtitleCountKey] || 0})</span>
                                  </div>
                              ))}
                            </div>
                           
                           
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-300 md:w-1/4 w-1/2 dark:bg-gray-800 rounded-lg shadow-md p-6 md:ms-80 ms-20 my-6">
      <label className="block text-lg font-bold mb-2">Number of Questions:</label>
      <input
      ref={inputRef}
      type="text"           
      inputMode="numeric"   
      pattern="[0-9]*"      
      value={questionCount}
      onChange={handleChange}
      placeholder="Enter number of questions (max 40)"
      className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
    
      <small className="text-gray-600 dark:text-gray-300">Max 40 questions</small>
    </div>
    

      <button 
      disabled={selectedSubjects.length === 0 || selectedSystems.length === 0 || !questionCount || isSubmitting}
      className={`md:ms-80 ms-20 rounded-lg font-medium px-6 py-3 border transition duration-300 ${
        selectedSubjects.length === 0 || selectedSystems.length === 0 || !questionCount
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "hover:bg-blue-700 hover:text-white bg-transparent border-blue-500 text-blue-500"
      }`}
      onClick={handleCreateTest}
    >
      Create Test
    </button>
    
    </>
    </ErrorBoundary>
  );
}