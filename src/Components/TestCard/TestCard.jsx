import React, { useState, useEffect } from 'react';
import { Clock, Share2, RefreshCw, Trash2, PlayCircle, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../SideBar/Sidebar';

const TestCard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { yearId } = useParams();
  let token = localStorage.getItem("access_token")

  
  const authToken = `${token}`
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (!yearId) {
      console.error("Missing yearId parameter");
      navigate("/dashboard"); // Redirect to a safe page
      return;
    }
    
    fetchTests();
  }, [yearId, navigate]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/test/preview/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Expected array of tests but got:', data);
        toast.error("Failed to load tests properly");
        setTests([]);
      } else {
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error("Failed to load tests. Please try again.");
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/preview/${testId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      toast.success("Test Deleted Successfully");
      localStorage.removeItem("testData");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("submittedQuestions");
      localStorage.removeItem("results");
      localStorage.removeItem("currentQuestionIndex");      
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error("Failed to delete test. Please try again.");
    }
  };

  const handleNameEdit = async (testId, newTestName) => {
    if (!newTestName.trim()) {
      toast.error("Test name cannot be empty");
      return;
    }
    
    try { 
      const response = await fetch(`${API_BASE_URL}/test/preview/${testId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test_name: newTestName })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      toast.success("Test name updated successfully");
      setEditingName(null);
      fetchTests();
    } catch (error) {
      console.error('Error updating test name:', error);
      toast.error("Failed to update test name. Please try again.");
    }
  };

  const handleResume = async (test) => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/resume/${test.id}/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        toast.error("No questions found in the test");
        return;
      }
      
      const formattedData = { test_id: test.id, questions: data };
      localStorage.setItem("testData", JSON.stringify(formattedData));
      
      let selectedAnswersObj = {};
      let submittedQuestionsObj = {};
      let resultsObj = {};
  
      data.forEach((question) => {
        if (!question || typeof question.id === 'undefined') {
          console.error('Malformed question data:', question);
          return;
        }
        
        if (question.user_answer) {
          selectedAnswersObj[question.id] = question.user_answer;
          submittedQuestionsObj[question.id] = true;
  
          if (question.explantions && question.explantions.length > 0) {
            const correctAnswer = question.answers.find(a => a.is_correct);
            resultsObj[question.id] = {
              status: question.answers.find(a => a.id === question.user_answer)?.is_correct,
              correctAnswer: correctAnswer ? correctAnswer.id : null,
              content: question.explantions[0].content,
              image: question.explantions[0].image,
              rate_answer: {} 
            };
          }
        }
      });
  
      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswersObj));
      localStorage.setItem("submittedQuestions", JSON.stringify(submittedQuestionsObj));
      localStorage.setItem("results", JSON.stringify(resultsObj));
  
      const answeredQuestionIds = Object.keys(selectedAnswersObj);
      const newIndex = answeredQuestionIds.length > 0 ? 
        data.findIndex(q => q.id.toString() === answeredQuestionIds[answeredQuestionIds.length - 1]) : 0;
      
      localStorage.setItem("currentQuestionIndex", (newIndex >= 0 ? newIndex : 0).toString());
  
      navigate(`/test/${yearId}`, {
        state: {
          mode: test.type_test === "time_mode" ? "timed" : "regular",
          totalTime: test.type_test === "time_mode" ? (parseInt(test.time) / 60) : undefined,
          resume: true
        }
      });
    } catch (error) {
      console.error('Error resuming test:', error);
      toast.error("Failed to resume test. Please try again.");
    }
  };

  const handleRetake = async (test) => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/retake/${test.id}/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        toast.error("No questions found in the test");
        return;
      }
      
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("submittedQuestions");
      localStorage.removeItem("results");
      localStorage.setItem("currentQuestionIndex", "0");
      
      const formattedData = { test_id: test.id, questions: data };
      localStorage.setItem("testData", JSON.stringify(formattedData));
            
      navigate(`/test/${yearId}`, {
        state: {
          mode: test.type_test === "time_mode" ? "timed" : "regular",
          totalTime: test.type_test === "time_mode" ? (parseInt(test.time) / 60) : undefined,
          resume: false
        }
      });
    } catch (error) {
      console.error('Error retaking test:', error);
      toast.error("Failed to retake test. Please try again.");
    }
  };

  const handleViewResults = async (test) => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/result/${test.id}/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log("Raw result data:", JSON.stringify(data));
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      console.log("Length:", Array.isArray(data) ? data.length : 'N/A');
      
      if (!Array.isArray(data) || data.length === 0) {
        toast.error("No questions found in the results");
        return;
      }
      
      if (data.length > 0) {
        console.log("First question structure:", JSON.stringify(data[0]));
        console.log("Has text property:", data[0].hasOwnProperty('text'));
        console.log("Has answers property:", data[0].hasOwnProperty('answers'));
      }
      
      const formattedData = { 
        test_id: testId, 
        questions: data 
      };
      
      localStorage.setItem("resultData", JSON.stringify(formattedData));
      
      navigate(`/test/${yearId}`, {
        state: {
          mode: test.type_test === "time_mode" ? "timed" : "regular",
          totalTime: test.type_test === "time_mode" ? (parseInt(test.time) / 60) : undefined,
        }
      });
      
    } catch (error) {
      console.error('Error viewing results:', error);
      toast.error("Failed to view results. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Sidebar/>
        <div className="flex-1 md:pl-80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {Array.isArray(tests) && tests.length > 0 ? (
              tests.map((test) => (
                test && typeof test.id !== 'undefined' ? (
                  <div key={test.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-4">
                      {editingName === test.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            onClick={() => handleNameEdit(test.id, newName)}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium dark:text-white">{test.name || 'Unnamed Test'}</h3>
                          <button
                            onClick={() => {
                              setEditingName(test.id);
                              setNewName(test.name || '');
                            }}
                            className="text-gray-500 dark:text-gray-400"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {test.date ? new Date(test.date).toLocaleDateString() : 'No date'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <div className="text-green-600 dark:text-green-400">Right: {test.content_test_true || 0}</div>
                        <div className="text-red-600 dark:text-red-400">Wrong: {test.content_test_false || 0}</div>
                      </div>
                      <div>
                        <div className="text-amber-600 dark:text-amber-400">Unanswered: {test.content_test_unanswer || 0}</div>
                        <div className="text-blue-600 dark:text-blue-400">
                          Percentage: {test.count_question > 0 ? 
                            ((test.content_test_true / test.count_question) * 100).toFixed(0) : 0}%
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4 dark:text-gray-300">
                      Total Questions: {test.count_question || 0}
                    </div>

                    {test.type_test === "time_mode" && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Time: {formatTime(parseInt(test.time))}
                      </div>
                    )}

                    <div className="flex justify-center gap-2 mb-4">
                      <button className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Share2 size={16} /> Share Test
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        onClick={() => handleRetake(test)}
                        className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 border dark:border-gray-600 rounded py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <RefreshCw size={16} /> Retake Test
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 border dark:border-gray-600 rounded py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 size={16} /> Delete Test
                      </button>
                    </div>

                    {(test.content_test_unanswer || 0) === 0 ? (
                      <button
                        onClick={() => handleViewResults(test.id)}
                        className="w-full flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 border dark:border-gray-600 rounded py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye size={16} /> View Results
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResume(test)}
                        className="w-full flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 border dark:border-gray-600 rounded py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <PlayCircle size={16} /> Resume Test
                      </button>
                    )}
                  </div>
                ) : null
              ))
            ) : (
              <div className="col-span-3 text-center py-8">No tests found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCard;
