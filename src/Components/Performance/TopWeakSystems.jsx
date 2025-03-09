import React, { useEffect, useState } from "react";

const TopPerformance = () => {
  const [topSystems, setTopSystems] = useState([]);
  const [weakSystems, setWeakSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = `Bearer ${localStorage.getItem("access_token")} `;

  useEffect(() => {
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`;

    const storedLastUpdated = localStorage.getItem("performanceLastUpdated");

    if (storedLastUpdated) {
      setLastUpdated(storedLastUpdated);
    } else {
      setLastUpdated(formattedTime);
      localStorage.setItem("performanceLastUpdated", formattedTime);
    }

    localStorage.setItem("performanceLastUpdated", formattedTime);

    setLoading(true);
    fetch(`${API_BASE_URL}/performance/`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.performance) {
          setTopSystems(data.performance.top_systems);
          setWeakSystems(data.performance.weak_systems);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching performance data:", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const sortedTopSystems = [...topSystems]
    .sort((a, b) => b.rate_success - a.rate_success)
    .slice(0, 5);

  const sortedWeakSystems = [...weakSystems]
    .sort((a, b) => b.rate_weak - a.rate_weak)
    .slice(0, 5);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full my-6">
      {/* Top Systems Panel */}
      <div className="w-full md:w-1/2 bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-4 font-bold text-xl">
          <div className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center">
            <span>i</span>
          </div>
          <span>Top Systems</span>
        </div>

        <div className="p-4 pt-0 space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : sortedTopSystems.length > 0 ? (
            sortedTopSystems.map((system, index) => {
              const totalQuestions =
                system.correct_questions +
                system.wrong_questions +
                system.unanswered_questions;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >
                  <div className="font-semibold">
                    {index + 1}-{system.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                      {system.rate_success}%
                    </span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                      ({system.correct_questions}/{totalQuestions})
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">No data available</div>
          )}
        </div>

        <div className="text-xs p-4 border-t border-gray-700">
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Weak Systems Panel */}
      <div className="w-full md:w-1/2 bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-4 font-bold text-xl">
          <div className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center">
            <span>i</span>
          </div>
          <span>Weak Systems</span>
        </div>

        <div className="p-4 pt-0 space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : sortedWeakSystems.length > 0 ? (
            sortedWeakSystems.map((system, index) => {
              const totalQuestions =
                system.correct_questions +
                system.wrong_questions +
                system.unanswered_questions;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >
                  <div className="font-semibold">
                    {index + 1}-{system.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                      {system.rate_weak}%
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                      ({system.correct_questions}/{totalQuestions})
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">No data available</div>
          )}
        </div>

        <div className="text-xs p-4 border-t border-gray-700">
          Last updated: {lastUpdated}
        </div>
      </div>
    </div>
  );
};

export default TopPerformance;