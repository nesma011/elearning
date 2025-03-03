import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { useNavigate, useParams } from "react-router-dom";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export default function CreateTest() {
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

  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showUnanswered, setShowUnanswered] = useState(false);
  const [showHighYield, setShowHighYield] = useState(false); // New state for high yield filter

  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);

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
        
        setSubjects(data.subjects || []);
        setSystems(data.systems || []);
        setAllSystems(data.systems || []);
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
        
        if (data.systems) {
          setSystems(data.systems);
        } else if (Array.isArray(data)) {
          setSystems(data);
        } else {
          setSystems([]);
        }
        setSelectedSystems([]);
        setSelectedSubtitles([]);

      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchSystems();
  }, [selectedSubjects, allSystems, yearId, API_BASE_URL, showIncorrect, showUnanswered]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!yearId) return;
      try {
        const incResponse = await fetch(`${API_BASE_URL}/field_quetion/${yearId}/`, {
          headers: { "Authorization": authToken },
        });
        if (incResponse.ok) {
          const incData = await incResponse.json();
          const totalIncorrect = incData.subjects?.reduce(
            (acc, subj) => acc + (subj.count_question || 0),
            0
          );
          setIncorrectCount(totalIncorrect || 0);
        }
        const unResponse = await fetch(`${API_BASE_URL}/unanswer_quetion/${yearId}/`, {
          headers: { "Authorization": authToken },
        });
        if (unResponse.ok) {
          const unData = await unResponse.json();
          const totalUnanswered = unData.subjects?.reduce(
            (acc, subj) => acc + (subj.count_question || 0),
            0
          );
          setUnansweredCount(totalUnanswered || 0);
        }
      } catch (err) {
        console.error("Count fetch error:", err);
      }
    };
    fetchCounts();
  }, [yearId, API_BASE_URL]);

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

  // Handler for High Yield questions filter
  const handleHighYieldFilter = () => {
    setShowHighYield(true);
    setShowIncorrect(false);
    setShowUnanswered(false);
    
    fetchHighYieldQuestions();
  };

  // Function to fetch high yield questions
  const fetchHighYieldQuestions = async () => {
    if (selectedSubtitles.length === 0) {
      toast.warning("Please select at least one subtitle first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Hight_heeld_question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({
          id_subtitels: selectedSubtitles,
          count: parseInt(questionCount) || 1
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("High Yield Questions:", data);

      // Check if high_question is true for any of the questions
      const hasHighYieldQuestions = data.questions && 
        data.questions.some(question => question.high_question === true);

      if (hasHighYieldQuestions) {
        toast.info(
          "⭐⭐⭐ HIGH YIELD QUESTIONS DETECTED! ⭐⭐⭐ These questions are particularly important for your exam.", 
          {
            position: "top-center",
            autoClose: 10000, // 10 seconds
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              backgroundColor: '#ffc107',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }
        );
      }

      // Store test data and navigate to test page
      if (data.test_id) {
        localStorage.setItem("testData", JSON.stringify(data));
        
        navigate(`/test/${yearId}`, {
          state: {
            testName: testName || "High Yield Test",
            selectedSubjects,
            selectedSystems,
            questionCount: data.questions.length,
            selectedSubtitles,
            mode,
            totalTime: mode === "timed" ? data.questions.length * 1.5 : null,
            createdTestId: data.test_id,
            isHighYield: true
          },
        });
      }
    } catch (error) {
      console.error("Error fetching high yield questions:", error);
      toast.error("Failed to fetch high yield questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemChange = (systemId) => {
    const system = systems.find(s => s.id === systemId);
    if (!system || !system.open_user) return;
  
    if (selectedSystems.includes(systemId)) {
      setSelectedSystems(prev => prev.filter(id => id !== systemId));
      if (system.subtitles) {
        const systemSubtitleIds = system.subtitles.map(sub => sub.id);
        setSelectedSubtitles(prev => prev.filter(id => !systemSubtitleIds.includes(id)));
      }
    } else {
      setSelectedSystems(prev => [...prev, systemId]);
      if (system.subtitles) {
        const systemSubtitleIds = system.subtitles.map(sub => sub.id);
        setSelectedSubtitles(prev => Array.from(new Set([...prev, ...systemSubtitleIds])));
      }
    }
  };

  const toggleSubtitles = (systemId) => {
    setOpenSystems(prev => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  const handleSubtitleChange = (subtitleId) => {
    setSelectedSubtitles(prev =>
      prev.includes(subtitleId)
        ? prev.filter(id => id !== subtitleId)
        : [...prev, subtitleId]
    );
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
    const approvedSystemIds = systems
      .filter(system => system.open_user)
      .map(system => system.id);

    if (selectedSystems.length === approvedSystemIds.length) {
      setSelectedSystems([]);
      setSelectedSubtitles([]);
    } else {
      setSelectedSystems(approvedSystemIds);
      setSelectedSubtitles(
        systems.flatMap(system =>
          system.open_user && system.subtitles ? system.subtitles.map(sub => sub.id) : []
        )
      );
    }
  };

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
    if (isSubmitting) {
      console.log("Already submitting, ignoring click");
      return;
    }
    console.log("Starting submission");
      
    setIsSubmitting(true);
    try {
      console.log("Preparing to submit with data:");

      if (selectedSubjects.length === 0 || selectedSystems.length === 0 || !questionCount) return;
        
      const parsedQuestionCount = parseInt(questionCount) || 1;
      const totalTime = mode === "timed" ? parsedQuestionCount * 1.5 : null;
  
      let createTestEndpoint = "";
      if (showIncorrect) {
        createTestEndpoint = `${API_BASE_URL}/create_Test_from_field_quetions/`;
      } else if (showUnanswered) {
        createTestEndpoint = `${API_BASE_URL}/create_Test_from_unanswer_quetions/`;
      } else {
        createTestEndpoint = `${API_BASE_URL}/test/create/`;
      }
  
      const bodyData = {
        count: parsedQuestionCount,
        id_subtitels: selectedSubtitles,
        type_test: mode === "timed" ? "time_mode" : "normal_test", 
      };
  
      console.log("Creating test with endpoint:", createTestEndpoint, "and body:", bodyData);
  
      const response = await fetch(createTestEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(bodyData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Test create error details:", errorText);
        throw new Error("Failed to create test");
      }
  
      const result = await response.json();
      console.log("Test created:", result);
      localStorage.setItem("testData", JSON.stringify(result));

      // Check for high yield questions in the response
      const hasHighYieldQuestions = result.questions && 
        result.questions.some(question => question.high_question === true);

      if (hasHighYieldQuestions) {
        toast.info(
          "⭐⭐⭐ HIGH YIELD QUESTIONS DETECTED! ⭐⭐⭐ These questions are particularly important for your exam.", 
          {
            position: "top-center",
            autoClose: 60000, 
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              backgroundColor: '#ffc107',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }
        );
      }
        
      navigate(`/test/${yearId}`, {
        state: {
          testName,
          selectedSubjects,
          selectedSystems,
          questionCount: parsedQuestionCount,
          selectedSubtitles: selectedSubtitles || [],
          mode,
          totalTime,
          createdTestId: result?.test_id || null,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create test");
    }
    finally {
      setIsSubmitting(false);
    }
  };
  

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
                        <span className="text-red-600">Incorrect Questions ({incorrectCount})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showUnanswered}
                          onChange={handleUnansweredChange}
                          className="w-4 h-4"
                        />
                        <span className="text-green-600">Unanswered Questions ({unansweredCount})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showHighYield}
                          onChange={handleHighYieldFilter}
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
                          {subject.count_question && (
                            <span className="text-green-600">({subject.count_question})</span>
                          )}
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
                            selectedSystems.length === systems.filter(s => s.open_user).length &&
                            systems.filter(s => s.open_user).length > 0
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
                              disabled={!system.open_user}
                              checked={selectedSystems.includes(system.id)}
                              onChange={() => handleSystemChange(system.id)}
                              className="w-4 h-4"
                            />
                            <span>{system.name}</span>
                            {system.count_question && selectedSubjects.length > 0 && (
                              <span className="text-green-600">({system.count_question})</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                          {system.open_user === true ? null : (
                            <button
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

      <div className="bg-gray-300 md:w-1/4 w-1/2 dark:bg-gray-800 rounded-lg shadow-md p-6 md:ms-80 ms-20 my-6 ">
        <label className="block text-lg font-bold mb-2">Number of Questions:</label>
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          placeholder="Enter number of questions"
          className="w-full p-2  border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          min="1"
          max="40"
        />
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
  );
}
