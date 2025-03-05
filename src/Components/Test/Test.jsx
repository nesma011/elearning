import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import parse, { domToReact } from 'html-react-parser';
import Notes from '../../ToolBar/Notes';
import Flashcards from '../../ToolBar/FlashCards';
import Calculator from '../../ToolBar/Calculator';
import LabValues from '../../ToolBar/LabValue';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Test() {
  const { yearId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, totalTime } = location.state || {};
  const [highlightOn, setHighlightOn] = useState(true);
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [hideHighlights, setHideHighlights] = useState(false);
  const [separateView, setSeparateView] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [testData, setTestData] = useState(() => {
    const savedTestData = localStorage.getItem("testData");
    const savedResultData = localStorage.getItem("resultData");
    if (location.state?.resume) {
      return savedTestData ? JSON.parse(savedTestData) : { questions: [] };
    } else if (savedResultData) {
      return JSON.parse(savedResultData);
    }
    return savedTestData ? JSON.parse(savedTestData) : { questions: [] };
  });

  const isViewResults = location.state?.viewResults || false;

  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem("selectedAnswers");
    return saved ? JSON.parse(saved) : {};
  });

  const [savedAnswers, setSavedAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState(() => {
    const saved = localStorage.getItem("submittedQuestions");
    return saved ? JSON.parse(saved) : {};
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("results");
    return saved ? JSON.parse(saved) : {};
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem("currentQuestionIndex");
    return saved ? parseInt(saved) : 0;
  });

  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [zoom, setZoom] = useState(1);
  const [activeComponent, setActiveComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (mode === 'timed' && totalTime) {
      setTimeLeft(Math.floor(totalTime * 60));
    }
  }, [mode, totalTime]);

  useEffect(() => {
    if (mode !== 'timed') return;
    if (!timeLeft) return;
    if (isPaused) return;
  
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTimeMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [mode, timeLeft, isPaused]);

  useEffect(() => {
    if (mode !== 'timed' || !testData.test_id) return;

    const updateTimeInterval = setInterval(() => {
      if (!isPaused) {
        updateTestTime(testData.test_id, timeLeft);
      }
    }, 5000);

    return () => clearInterval(updateTimeInterval);
  }, [mode, timeLeft, isPaused, testData?.test_id]);

  useEffect(() => {
    if (mode === 'timed' && testData.questions) {
      const answeredCount = Object.keys(savedAnswers).length;
      setAllQuestionsAnswered(answeredCount === testData.questions.length);
    }
  }, [savedAnswers, testData.questions, mode]);



  useEffect(() => {
    if (!highlightOn || hideHighlights) {
      document.querySelectorAll('span[data-highlight="true"]').forEach((span) => {
        span.outerHTML = span.innerHTML;
      });
    }
  }, [highlightOn, hideHighlights]);

  const formatTime = (seconds) => {
    if (seconds === null) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const openModal = (src) => {
    setModalImageSrc(src);
    setZoom(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoom(prev => prev + 0.1);
    } else {
      setZoom(prev => Math.max(0.1, prev - 0.1));
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem("currentQuestionIndex", newIndex.toString());
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem("currentQuestionIndex", newIndex.toString());
    }
  };

  const handleAnswerChange = (questionId, answerId) => {
    const newAnswers = {
      ...selectedAnswers,
      [questionId]: answerId,
    };
    setSelectedAnswers(newAnswers);
    localStorage.setItem("selectedAnswers", JSON.stringify(newAnswers));
  };


  const submitAnswer = async (questionId) => {
    try {
      const answerId = selectedAnswers[questionId];
      if (!answerId) {
        alert('Please choose an answer first.');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/answer/${questionId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_answer: answerId,
          id_test: testData.test_id
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Time Mode data:", JSON.stringify(data, null, 2));

      console.log("submitAnswer Response:", data);
  
      const correctAnswerId = data.answer["correct answer"];
      const correctAnswerText = data.answer["correctAnswerText"] || "N/A";
      const correctAnswerLetter = data.answer["correctAnswerLetter"] || "N/A";
  
      const newSubmitted = {
        ...submittedQuestions,
        [questionId]: true
      };
      setSubmittedQuestions(newSubmitted);
      localStorage.setItem("submittedQuestions", JSON.stringify(newSubmitted));
  
      const imagePath = data.image ? `${API_BASE_URL}${data.image.startsWith('/') ? '' : '/'}${data.image}` : null;
      console.log("Explantion Image Path:", imagePath);
      const newResults = {
        ...results,
        [questionId]: {
          status: data.answer.status,
          correctAnswer: correctAnswerId,
          correctAnswerText,
          correctAnswerLetter,
          content: data.content || "",
          image: imagePath,
          rate_answer: data.rate_answer,
          text_image1: data.text_image1 || null,
          text_image2: data.text_image2 || null,
          text_image3: data.text_image3 || null,
          text_image4: data.text_image4 || null,
          text_image5: data.text_image5 || null,
          text_image6: data.text_image6 || null,
        }
      };
  
      setResults(newResults);
      localStorage.setItem("results", JSON.stringify(newResults));
    } catch (err) {
      console.error('Submit answer error:', err);
      alert('Error submitting answer. Check console for details.');
    }
  };

  const saveAnswerTimeMode = async (questionId) => {
    try {
      const answerId = selectedAnswers[questionId];
      if (!answerId) {
        alert('Please choose an answer first.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/save-answer-time-mode/${testData.test_id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_question: questionId,
          id_anwser: answerId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSavedAnswers = {
        ...savedAnswers,
        [questionId]: answerId
      };
      setSavedAnswers(newSavedAnswers);
      localStorage.setItem("selectedAnswers", JSON.stringify(newSavedAnswers));
      toast.success("Answer saved successfully!");

      if (currentQuestionIndex < testData.questions.length - 1) {
        goToNextQuestion();
      }
    } catch (err) {
      console.error('Save answer error:', err);
      toast.error('Error saving answer. Please try again.');
    }
  };

  const handleSubmitTimeMode = async () => {
    setIsPaused(true);
    try {
      setLoading(true);

      await updateTestTime(testData.test_id, timeLeft);
  
      const response = await fetch(`${API_BASE_URL}/get-result-time-mode/${testData.test_id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response Data:", JSON.stringify(data, null, 2));
  
      if (!Array.isArray(data)) {
        throw new Error("API response is not an array");
      }
  
      const newResults = {};
  
      data.forEach(item => {
        const questionId = item.id;
        const explantions = item.explantions || [];
        const explantionObj = explantions.length > 0 ? explantions[0] : null;
        const imagePath = explantionObj && explantionObj.image 
          ? `${API_BASE_URL}${explantionObj.image.startsWith('/') ? '' : '/'}${explantionObj.image}` 
          : null;
      
          newResults[questionId] = {
            status: selectedAnswers[questionId] === correctAnswerId ? "correct" : "incorrect",
            correctAnswer: correctAnswerId,
            correctAnswerText,
            correctAnswerLetter,
            content: explantionObj ? explantionObj.content : "",
            image: imagePath,
            text_image1: explantionObj?.text_image1 || null,
            text_image2: explantionObj?.text_image2 || null,
            text_image3: explantionObj?.text_image3 || null,
            text_image4: explantionObj?.text_image4 || null,
            text_image5: explantionObj?.text_image5 || null,
            text_image6: explantionObj?.text_image6 || null,
          };
      });
  
      console.log("New Results:", newResults);
      setResults(newResults);
      localStorage.setItem("results", JSON.stringify(newResults));
  
      const allSubmitted = {};
      testData.questions.forEach(question => {
        if (question.id) {
          allSubmitted[question.id] = true;
        }
      });
      setSubmittedQuestions(allSubmitted);
      localStorage.setItem("submittedQuestions", JSON.stringify(allSubmitted));
  
      setCurrentQuestionIndex(0);
      localStorage.setItem("currentQuestionIndex", "0");
  
      toast.success("Test completed! Showing results.");
      setLoading(false);
    } catch (err) {
      console.error('Submit test error:', err);
      toast.error('Error submitting test. Please try again.');
      setLoading(false);
    }
  };

  const updateTestTime = async (testId, remainingTime) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-time-test/${testId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          time: remainingTime.toString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Update time error:', err);
    }
  };

  const handleEndBlock = async () => {
    const storedTestData = localStorage.getItem("testData");
    const testDataParsed = storedTestData ? JSON.parse(storedTestData) : null;

    if (!testDataParsed || !testDataParsed.test_id) {
      toast.error("Test data is missing or invalid.");
      console.error("testData:", testDataParsed);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/test/end/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ test_id: testDataParsed.test_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.message === "There are still unanswered questions.") {
        toast.error("There are still unanswered questions.");
        navigate(`/createTest/${yearId}`);
        return;
      }

      localStorage.removeItem("testData");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("submittedQuestions");
      localStorage.removeItem("results");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("resultData");

      navigate(`/createTest/${yearId}`);
    } catch (error) {
      console.error("Error in handleEndBlock:", error);
      toast.error("An error occurred. Please try again later.");
    }finally
    {
      localStorage.removeItem("testData");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("submittedQuestions");
      localStorage.removeItem("results");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("resultData");
    }
  };

  const handleMarkChange = async (e) => {
    const checked = e.target.checked;
    if (currentQuestion) {
      setMarkedQuestions(prev => ({
        ...prev,
        [currentQuestion.id]: checked,
      }));

      if (checked) {
        try {
          const systemId = currentQuestion.systemId;
          const questionId = currentQuestion.id;
          const testId = testData.test_id;

          const response = await fetch(`${API_BASE_URL}/marks/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              systems: systemId,
              name: "important mark",
              question: questionId,
              test: testId,
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed: ${errorText}`);
          }

          const data = await response.json();
          console.log("Mark created:", data);
          toast("Question Added to Marked Question Successfully!");
        } catch (error) {
          console.error("Error creating mark:", error);
        }
      }
    }
  };

  useEffect(() => {
    setIsMarked(false);
  }, [currentQuestionIndex]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const handleTextSelection = () => {
    if (!highlightOn || hideHighlights) return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.setAttribute('data-highlight', 'true');
    span.style.backgroundColor = highlightColor;
    span.style.color = '#000';
    span.textContent = selection.toString();

    range.deleteContents();
    range.insertNode(span);

    selection.removeAllRanges();
  };

  const reportQuestion = () => {
    alert("Question reported!");
  };

  if (!testData || !testData.questions) {
    return <div>Loading test data...</div>;
  }

  const currentQuestion =
    testData.questions &&
    testData.questions.length > 0 &&
    currentQuestionIndex < testData.questions.length
      ? testData.questions[currentQuestionIndex]
      : null;

  const questionResult = currentQuestion ? results[currentQuestion.id] : null;

  const totalTimeUsed = mode === 'timed'
    ? (totalTime * 60 - timeLeft)
    : null;

  return (
    <section
      style={{ fontSize: `${fontSize}px` }}
      onMouseUp={handleTextSelection}
      className="min-h-screen bg-gray-50"
    >
      <nav className="bg-blue-800 w-full px-4 py-2 flex flex-col sm:flex-row sm:justify-between items-center">
        <div className="flex flex-col text-white mb-2 sm:mb-0">
          <span className="text-xl font-semibold">
            Item {currentQuestionIndex + 1} of {testData.questions?.length}
          </span>
          <h2 className="text-xl pt-1 font-bold">
            Question ID: {testData?.test_id || 'N/A'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center space-x-2">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-white text-4xl font-bold"
          >
            ←
          </button>
          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === testData.questions.length - 1}
            className="px-4 py-2 text-white text-4xl font-bold"
          >
            →
          </button>

          <button
            onClick={() => setActiveComponent(activeComponent === 'notes' ? null : 'notes')}
            className={`flex items-center text-lg font-semibold px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${activeComponent === 'notes' ? 'bg-blue-700' : ''}`}
          >
            📝 Add Note
          </button>
          <button
            onClick={() => setActiveComponent(activeComponent === 'flashcards' ? null : 'flashcards')}
            className={`flex items-center text-lg font-semibold px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${activeComponent === 'flashcards' ? 'bg-blue-700' : ''}`}
          >
            🗂️ Flashcards
          </button>

          <label className="text-white text-lg font-semibold mx-3">
            <input
              type="checkbox"
              checked={isMarked}
              onChange={handleMarkChange}
            />
            Mark
          </label>

          <button
            onClick={() => setActiveComponent(activeComponent === 'calculator' ? null : 'calculator')}
            className={`flex items-center px-4 py-2 text-lg font-semibold text-white rounded-lg transition-all hover:bg-blue-500 ${activeComponent === 'calculator' ? 'bg-blue-700' : ''}`}
          >
            🔢 Calculator
          </button>
          <button
            onClick={() => setActiveComponent(activeComponent === 'labvalues' ? null : 'labvalues')}
            className={`flex items-center text-lg font-semibold px-4 py-2 text-white rounded-lg transition-all hover:bg-blue-500 ${activeComponent === 'labvalues' ? 'bg-blue-700' : ''}`}
          >
            🧪 Lab Values
          </button>
        </div>

        {mode === 'timed' && (
          <div className="flex items-center mt-2 sm:mt-0">
            <div className="bg-gray-300 text-black px-3 py-1 rounded flex items-center">
              <span className="mr-2 font-semibold">
                {formatTime(timeLeft)}
              </span>
              <button onClick={togglePause} className="font-semibold flex items-center gap-1">
                {isPaused ? 'Resume' : 'Pause'}
                <span className="text-xl">||</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="bg-blue-100 flex flex-wrap sm:flex-nowrap items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <div className="flex items-center">
            <label className="mr-2 font-semibold">Highlight</label>
            <button
              onClick={() => setHighlightOn(!highlightOn)}
              className={`px-3 py-1 rounded ${highlightOn ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {highlightOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-semibold">Color:</label>
            {['#FFFF00', '#00FF00', '#00BFFF', '#FF4500'].map((color) => (
              <div
                key={color}
                onClick={() => setHighlightColor(color)}
                className="w-6 h-6 rounded-full cursor-pointer border-2 border-gray-300"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            More
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <div className="px-4 py-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjust Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="30"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={reportQuestion}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Report Qus
                </button>

                <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideHighlights}
                      onChange={() => setHideHighlights(!hideHighlights)}
                      className="mr-2"
                    />
                    Hide Highlights
                  </label>
                </div>

                <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={separateView}
                      onChange={() => setSeparateView(!separateView)}
                      className="mr-2"
                    />
                    Separate View
                  </label>
                </div>

                <button
                  onClick={toggleFullScreen}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Full screen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-full sm:w-auto bg-gray-200 ps-6 pe-2 min-h-screen shadow-lg overflow-auto">
          <div className="flex flex-col items-center py-4">
            <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {Array.isArray(testData.questions) && testData.questions.length > 0 ? (
                testData.questions.map((question, index) => {
                  if (!question || !question.id) return null;

                  const questionResult = results?.[question.id];
                  const isCorrectAnswer = questionResult?.correctAnswer === selectedAnswers[question.id];
                  const isAnswerSaved = mode === 'timed' && savedAnswers[question.id];

                  return (
                    <div key={question.id} className="md:flex items-center gap-2 ">
                      <button
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`
                          w-16 h-10 rounded-lg 
                          flex items-center justify-center 
                          font-semibold text-lg transition-all
                          ${currentQuestionIndex === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}
                          ${questionResult ? 'border-2' : isAnswerSaved ? 'border-2 border-yellow-500' : 'border border-gray-300'}
                          ${isCorrectAnswer ? 'border-green-500' : questionResult ? 'border-red-500' : ''}
                        `}
                      >
                        {index + 1}
                      </button>

                      {questionResult && (
                        <span className={`text-xl font-bold ${isCorrectAnswer ? 'text-green-500' : 'text-red-500'}`}>
                          {isCorrectAnswer ? '✓' : '✗'}
                        </span>
                      )}

                      {isAnswerSaved && !questionResult && (
                        <span className="text-xl font-bold text-yellow-500">
                          ★
                        </span>
                      )}

                      {markedQuestions[question.id] && (
                        <span className="ml-2 text-xl font-bold text-blue-500">
                          🚩
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div>No questions available</div>
              )}
            </div>
          </div>
        </div>

        <div className={` flex-1  p-4 sm:p-10 
         ${separateView ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col'}
         `}
   
>
  {loading && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    </div>
  )}
  {error && <div className="text-red-500">Error: {error}</div>}

  {/* Question Section */}
  <div className={separateView ? 'col-span-1' : ''}>
    {testData && currentQuestion ? (
      <div className="mb-4 p-1 rounded flex flex-col items-start">
        {currentQuestion.text && (
          <p
            className="mb-1 text-xl"
            style={{ backgroundColor: hideHighlights ? 'transparent' : 'inherit' }}
            dangerouslySetInnerHTML={{
              __html: submittedQuestions[currentQuestion.id]
                ? currentQuestion.text.replace(
                    /<u>(.*?)<\/u>/g,
                    '<span style="text-decoration: underline; text-decoration-color: #ed1212; text-decoration-thickness: 4px;">$1</span>'
                  )
                : currentQuestion.text.replace(/<u>(.*?)<\/u>/g, '$1'),
            }}
          />
        )}

        {currentQuestion.image && (
          <img
            src={`${API_BASE_URL}${currentQuestion.image}`}
            alt="question"
            className="aspect-ratio max-w-[50%] max-h-[50vh] mt-2 mx-auto rounded-lg cursor-pointer"
            onClick={() => openModal(`${API_BASE_URL}${currentQuestion.image}`)}
          />
        )}

        {currentQuestion.audio && (
          <audio controls src={`${API_BASE_URL}${currentQuestion.audio}`} className="mt-2">
            Your browser does not support the audio element.
          </audio>
        )}

        <div className="w-full border-2 my-8 border-blue-300 shadow-xl shadow-blue-400">
          {currentQuestion.answers && currentQuestion.answers.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              {currentQuestion.answers.map((answer) => {
                if (!answer || !answer.id) return null;

                const questionResult = results[currentQuestion.id];
                const isCorrectAnswer = questionResult?.correctAnswer === answer.id;
                const userAnswerId = selectedAnswers[currentQuestion.id];
                const isUserAnswer = userAnswerId === answer.id;

                return (
                  <label 
                    key={answer.id} 
                    className="flex justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={answer.id}
                        checked={isUserAnswer}
                        onChange={() => handleAnswerChange(currentQuestion.id, answer.id)}
                        disabled={!!questionResult || isViewResults}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">{answer.letter}.</span>
                      
                      {answer.text && (
                        <span className="text-gray-900 px-4 text-lg font-semibold">
                          {answer.text}
                        </span>
                      )}

                      {answer.image && (
                        <img
                          src={`${API_BASE_URL}${answer.image}`}
                          alt={`Option ${answer.letter}`}
                          className="mt-2 max-w-xs h-auto object-contain cursor-zoom-in"
                          onClick={() => openModal(`${API_BASE_URL}${answer.image}`)}
                        />
                      )}

                      {answer.answer_json ? (
                        <div className="mt-3 overflow-x-auto">
                          {Object.keys(answer.answer_json).length === 0 ? (
                            <div>No data available</div>
                          ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr className="divide-x divide-gray-200">
                                  {Object.keys(answer.answer_json).map((key) => (
                                    <th
                                      key={key}
                                      className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="divide-x divide-gray-200">
                                  {Object.keys(answer.answer_json).map((key) => (
                                    <td
                                      key={key}
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                      {answer.answer_json[key]}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    <div className="flex items-center justify-start">
                      {questionResult && (
                        <span
                          className={`ml-2 font-bold ${
                            isCorrectAnswer ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {isCorrectAnswer ? '✓' : '✗'}
                        </span>
                      )}

                      {questionResult?.rate_answer && (
                        <div className="ml-4">
                          <span className="text-blue-600 font-semibold">
                            ({questionResult.rate_answer[answer.id]})%
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {currentQuestion.id && !results[currentQuestion.id] && (
          <>
            {mode === "timed" ? (
              <button
                onClick={() => saveAnswerTimeMode(currentQuestion.id)}
                className="mt-4 px-6 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => submitAnswer(currentQuestion.id)}
                className="mt-4 px-6 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            )}
          </>
        )}
      </div>
    ) : (
      <div>No question data available</div>
    )}
  </div>

  {/* Explantion Section */}
  {isViewResults && (
    <div className="mt-4">
      {testData.questions.map((question) => (
        results[question.id] && (
          <div key={question.id} className="p-3 border-t w-full">
            <h3 className="font-bold text-xl">Question {question.id} Explanation:</h3>
            {results[question.id]?.image && (
              <img src={results[question.id].image} className="w-[750px] h-[500px] mt-2 mx-auto" />
            )}
            <div className="text-gray-700 mt-2">
              {(() => {
                const imagesArray = [
                  results[question.id]?.text_image1,
                  results[question.id]?.text_image2,
                  results[question.id]?.text_image3,
                  results[question.id]?.text_image4,
                  results[question.id]?.text_image5,
                  results[question.id]?.text_image6,
                  
                ].filter((image) => image);
                let underlineCounter = 0;
  
                if (!results[question.id]?.content) return <p>No explanation available.</p>;
  
                return parse(results[question.id].content, {
                  replace: (domNode) => {
                    if (domNode.type === "tag" && domNode.name === "u") {
                      const currentImage = imagesArray[underlineCounter];
                      underlineCounter++;
                      if (currentImage) {
                        return (
                          <u className="cursor-pointer text-blue-500 underline" onClick={() => openModal(currentImage)}>
                            {domToReact(domNode.children)}
                          </u>
                        );
                      }
                      return <u>{domToReact(domNode.children)}</u>;
                    }
                    return undefined;
                  },
                });
              })()}
            </div>
          </div>
        )
      ))}
    </div>
  )}

      </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <span
              className="absolute top-0 right-0 text-white text-4xl cursor-pointer p-2"
              onClick={closeModal}
            >
              ×
            </span>
            <img
              src={modalImageSrc}
              alt="Zoomed"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
              onWheel={handleWheel}
              className="max-w-[90vw] max-h-[90vh]"
            />
          </div>
        </div>
      )}

      {activeComponent === "notes" && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-96 max-w-full sm:max-w-[400px]">
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
          <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-96 max-w-full sm:max-w-[400px]">
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
        <div
          className="fixed bottom-0 right-0 bg-white shadow-lg p-1 z-50 w-full sm:w-auto"
        >
          <Calculator />
        </div>
      )}

      {activeComponent === "labvalues" && (
        <div
          className="fixed bottom-20 right-0 bg-white shadow-lg p-1 z-50 max-h-[80vh] sm:h-[500px] overflow-y-auto"
        >
          <LabValues />
        </div>
      )}
    </section>
  );
}