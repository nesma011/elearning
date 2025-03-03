import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Score = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  let token = localStorage.getItem("access_token")


  useEffect(() => {
    fetch(`${API_BASE_URL}/performance/question/`, {
        headers: {
        "Authorization": `Bearer ${token}`,
    },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.performance) {
          setPerformance(data.performance);
        } else {
          setError("No performance data found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p>No data available</p>
      </div>
    );
  }

  const unanswered = performance.unanswered || 0;
  const correct = performance.correct || 0;
  const incorrect = performance.incorrect || 0;

  const data = [
    { name: "UnAnswered", value: unanswered },
    { name: "Right Answers", value: correct },
    { name: "Wrong Answers", value: incorrect },
  ];

  const COLORS = ["#fda4af", "#fde68a", "#93c5fd"]; 

  return (
    <div className="bg-white text-black border rounded shadow p-4">
      <div className="bg-gray-100 p-2 mb-4 border-b">
        <h2 className="font-bold text-lg">Your Score</h2>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-72 p-4 flex items-center justify-center">
          <PieChart width={280} height={280}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" align="left" />
          </PieChart>
        </div>

        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Your Score</h3>
          <p className="mb-2">
            <span className="font-semibold">UnAnswered:</span> {unanswered}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Right Answers:</span> {correct}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Wrong Answers:</span> {incorrect}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Score;
