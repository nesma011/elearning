import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function MarkedQuestion() {
  const [marksBySystem, setMarksBySystem] = useState({});
  const [systemNames, setSystemNames] = useState([]);
  const [openSystems, setOpenSystems] = useState({});
  const { yearId } = useParams();
  let token = localStorage.getItem("access_token");

  const authToken = `Bearer ${token}`;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/marks/`, {
        headers: {
          Authorization: authToken,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch marks");
      const data = await res.json();

      const grouped = data.reduce((acc, mark) => {
        const sysName = mark.system_name;
        if (!acc[sysName]) {
          acc[sysName] = [];
        }
        acc[sysName].push(mark);
        return acc;
      }, {});

      setMarksBySystem(grouped);
      setSystemNames(Object.keys(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSystem = (systemName) => {
    setOpenSystems((prev) => ({
      ...prev,
      [systemName]: !prev[systemName],
    }));
  };

  const navigate = useNavigate();

  const fetchTestDataForQuestion = async (testId, questionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-question/${testId}/?id_question=${questionId}`
, {
        headers: {
          Authorization: authToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test data: ${response.status}`);
      }

      const testData = await response.json();
      if (!Array.isArray(testData) || testData.length === 0) {
        throw new Error("No test data found");
      }

      // فلتر الـ questions عشان نلاقي السؤال المحدد بناءً على questionId
      const question = testData.find(q => q.id === questionId);
      if (!question) {
        throw new Error(`Question with ID ${questionId} not found in test ${testId}`);
      }

      // تخزين بيانات الـ test كـ array في testData
      const formattedData = { test_id: testId, questions: [question] }; // فقط السؤال المحدد
      localStorage.setItem("testData", JSON.stringify(formattedData));

      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("submittedQuestions");
      localStorage.removeItem("results");
      localStorage.removeItem("currentQuestionIndex");

      let selectedAnswersObj = {};
      let resultsObj = {};
      if (question.user_answer) {
        selectedAnswersObj[question.id] = question.user_answer;
        const correctAnswer = question.answers.find(a => a.is_correct) || { id: null };
        if (question.explantions && question.explantions.length > 0) {
          const explanation = question.explantions[0];
          resultsObj[question.id] = {
            status: question.answers.find(a => a.id === question.user_answer)?.is_correct || false,
            correctAnswer: correctAnswer.id,
            content: explanation.content || "No explanation available",
            image: explanation.image ? `${API_BASE_URL}${explanation.image}` : null,
            rate_answer: {},
            text_image1: explanation.text_image1 ? `${API_BASE_URL}${explanation.text_image1}` : null,
            text_image2: explanation.text_image2 ? `${API_BASE_URL}${explanation.text_image2}` : null,
            text_image3: explanation.text_image3 ? `${API_BASE_URL}${explanation.text_image3}` : null,
            text_image4: explanation.text_image4 ? `${API_BASE_URL}${explanation.text_image4}` : null,
            text_image5: explanation.text_image5 ? `${API_BASE_URL}${explanation.text_image5}` : null,
            text_image6: explanation.text_image6 ? `${API_BASE_URL}${explanation.text_image6}` : null,
          };
        } else {
          resultsObj[question.id] = {
            status: question.answers.find(a => a.id === question.user_answer)?.is_correct || false,
            correctAnswer: correctAnswer.id,
            content: "No explanation available",
            image: null,
            rate_answer: {},
          };
        }
      }

      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswersObj));
      localStorage.setItem("results", JSON.stringify(resultsObj));
      localStorage.setItem("submittedQuestions", JSON.stringify({ [question.id]: !!question.user_answer }));
      localStorage.setItem("currentQuestionIndex", "0"); 

    } catch (err) {
      console.error("Error fetching test data for question:", err);
      toast.error("Failed to load question data. Please try again.");
    }
  };

  const navigateToQuestion = (testId, questionId) => {
    fetchTestDataForQuestion(testId, questionId).then(() => {
      navigate({
        pathname: `/test/${yearId}/`,
        state: { testId, questionId, mode: "regular" }
      });
    }).catch((err) => {
      console.error("Navigation error:", err);
      toast.error("Failed to navigate to question. Please try again.");
    });
  };

  const formatDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div className="flex md:ms-72 min-h-screen bg-gradient-to-r from-blue-200 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <Sidebar />
      <div className="p-4 w-full">
        {systemNames.map((systemName) => (
          <div
            key={systemName}
            className="mb-4 bg-white border rounded-lg overflow-hidden w-full"
          >
            <div
              onClick={() => toggleSystem(systemName)}
              className="cursor-pointer p-4 bg-white text-center text-green-600 border-b font-medium w-full"
            >
              {systemName}
            </div>

            {openSystems[systemName] && marksBySystem[systemName] && (
              <div className="p-4">
                {marksBySystem[systemName].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marksBySystem[systemName].map((mark) => (
                      <div key={mark.id} className="border rounded-lg p-4">
                        <div className="font-bold text-xl mb-2">{mark.name}</div>
                        <div className="text-blue-600 font-bold text-xl mb-1">
                          #{mark.id}
                        </div>
                        <div className="text-gray-600 text-sm mb-3">
                          {formatDate()}
                        </div>

                        <div className="flex mb-3">
                          <div className="mr-4">
                            <span className="font-medium">Test</span>
                            <div className="bg-green-600 text-white rounded px-2 py-1 text-sm">
                              #{mark.test}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Question</span>
                            <div className="bg-blue-600 text-white rounded px-2 py-1 text-sm">
                              #{mark.question}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigateToQuestion(mark.test, mark.question)}
                          className="bg-blue-100 text-blue-600 flex items-center justify-center w-full py-2 rounded"
                        >
                          <span className="mr-2">▶</span> View Question
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No marks for this system.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {systemNames.length === 0 && (
          <div className="text-center text-gray-500 py-8">No systems found.</div>
        )}
      </div>
    </div>
  );
}