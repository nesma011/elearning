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
  // ... (كل الكود الخاص بالـ state والـ hooks كما هو)

  const handleSubmitTimeMode = async () => {
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
      console.log("get-result-time-mode Response:", data);
  
      const newResults = {};
  
      data.forEach(item => {
        const questionId = item.id;
        const correctAnswerObj = item.answers.find(answer => answer.is_correct);
        const correctAnswerId = correctAnswerObj ? correctAnswerObj.id : null;
        const correctAnswerText = correctAnswerObj ? correctAnswerObj.text : null;
        const correctAnswerLetter = correctAnswerObj ? correctAnswerObj.letter : null;
  
        const explanationObj = (item.explantions && item.explantions.length > 0) // تصحيح الخطأ الإملائي
          ? item.explantions[0]
          : null;
  
        newResults[questionId] = {
          status: selectedAnswers[questionId] === correctAnswerId ? "correct" : "incorrect",
          correctAnswer: correctAnswerId,
          correctAnswerText,
          correctAnswerLetter,
          content: explanationObj ? explanationObj.content : "",
          image: explanationObj ? explanationObj.image : null,
          text_image1: item.text_image1 || null,
          text_image2: item.text_image2 || null,
          text_image3: item.text_image3 || null,
          text_image4: item.text_image4 || null,
          text_image5: item.text_image5 || null,
          text_image6: item.text_image6 || null,
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

  // ... (باقي الدوال كما هي بدون تغيير)

  return (
    <section
      style={{ fontSize: `${fontSize}px` }}
      onMouseUp={handleTextSelection}
      className="min-h-screen bg-gray-50"
    >
      {/* ... (الـ nav والـ highlight bar كما هي بدون تغيير) */}

      <div className="flex">
        {/* ======== Sidebar======== */}
        {/* ... (كما هو بدون تغيير) */}

        {/* ======== Main Content ========= */}
        <div
          className={`
            flex-1 
            p-4 sm:p-10 
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
        
          {/* قسم الأسئلة */}
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
                          <label key={answer.id} className="flex justify-between p-4 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={answer.id}
                                checked={isUserAnswer}
                                onChange={() => handleAnswerChange(currentQuestion.id, answer.id)}
                                disabled={!!questionResult}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-700">{answer.letter}.</span>
                              {answer.text && (
                                <span className="text-gray-900 px-4 text-lg font-semibold">{answer.text}</span>
                              )}
                              {answer.image && (
                                <img
                                  src={`${API_BASE_URL}${answer.image}`}
                                  alt={`Option ${answer.letter}`}
                                  className="mt-2 max-w-xs h-auto object-contain cursor-zoom-in"
                                  onClick={() => openModal(`${API_BASE_URL}${answer.image}`)}
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-start">
                              {questionResult && (
                                <span className={`ml-2 font-bold ${isCorrectAnswer ? 'text-green-600' : 'text-red-500'}`}>
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
        
                {/* إضافة الشرح في الوضع العادي (غير Separate View) */}
                {!separateView && questionResult && (
                  <div className="mt-4 p-3 border-t w-full">
                    <h3 className="font-bold text-2xl text-blue-600">Explanation:</h3>
                    {questionResult?.image && (
                      <img
                        src={`${API_BASE_URL}${questionResult.image}`}
                        alt="explanation"
                        className="w-[750px] h-[500px] mt-2 mx-auto cursor-pointer"
                        onClick={() => openModal(`${API_BASE_URL}${questionResult.image}`)}
                      />
                    )}
                    <div className="text-gray-700 mt-2">
                      {(() => {
                        const imagesArray = [
                          questionResult?.text_image1,
                          questionResult?.text_image2,
                          questionResult?.text_image3,
                          questionResult?.text_image4,
                          questionResult?.text_image5,
                          questionResult?.text_image6,
                        ].filter((image) => image);
                        let underlineCounter = 0;
        
                        if (!questionResult?.content) return <p>No explanation available.</p>;
        
                        return parse(questionResult.content, {
                          replace: (domNode) => {
                            if (domNode.type === "tag" && domNode.name === "u") {
                              const currentImage = imagesArray[underlineCounter];
                              underlineCounter++;
                              if (currentImage) {
                                return (
                                  <u
                                    className="cursor-pointer text-blue-500"
                                    onClick={() => openModal(`${API_BASE_URL}${currentImage}`)}
                                  >
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
                )}
              </div>
            ) : (
              <div>No question data available</div>
            )}
          </div>
        
          {/* قسم الشرح في Separate View */}
          {separateView && questionResult && (
            <div className="col-span-1 mt-4 p-3 border-t w-full">
              <h3 className="font-bold text-2xl text-blue-600">Explanation:</h3>
              {questionResult?.image && (
                <img
                  src={`${API_BASE_URL}${questionResult.image}`}
                  alt="explanation"
                  className="w-[750px] h-[500px] mt-2 mx-auto cursor-pointer"
                  onClick={() => openModal(`${API_BASE_URL}${questionResult.image}`)}
                />
              )}
              <div className="text-gray-700 mt-2">
                {(() => {
                  const imagesArray = [
                    questionResult?.text_image1,
                    questionResult?.text_image2,
                    questionResult?.text_image3,
                    questionResult?.text_image4,
                    questionResult?.text_image5,
                    questionResult?.text_image6,
                  ].filter((image) => image);
                  let underlineCounter = 0;
        
                  if (!questionResult?.content) return <p>No explanation available.</p>;
        
                  return parse(questionResult.content, {
                    replace: (domNode) => {
                      if (domNode.type === "tag" && domNode.name === "u") {
                        const currentImage = imagesArray[underlineCounter];
                        underlineCounter++;
                        if (currentImage) {
                          return (
                            <u
                              className="cursor-pointer text-blue-500"
                              onClick={() => openModal(`${API_BASE_URL}${currentImage}`)}
                            >
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
          )}
        
          {/* الأزرار الثابتة */}
          <button
            onClick={handleEndBlock}
            className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            End Block
          </button>
        
          {mode === "timed" && (
            <button
              onClick={handleSubmitTimeMode}
              className="fixed bottom-16 right-4 z-50 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>

      {/* ====== Image zoom modal ====== */}
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
              &times;
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

      {/* ====== Modals (Notes, Flashcards, Calculator, LabValues) ====== */}
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
          className="
            fixed bottom-0 right-0 bg-white shadow-lg p-1 z-50 
            w-full sm:w-auto
          "
        >
          <Calculator />
        </div>
      )}

      {activeComponent === "labvalues" && (
        <div 
          className="
            fixed bottom-20 right-0 bg-white shadow-lg p-1 z-50 
            max-h-[80vh] sm:h-[500px] 
            overflow-y-auto
          "
        >
          <LabValues />
        </div>
      )}
    </section>
  );
}
