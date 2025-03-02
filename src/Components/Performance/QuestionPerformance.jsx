import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const QuestionsPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ahmedmahmoud10.pythonanywhere.com/performance/question/", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.performance) {
          setPerformance(data.performance);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!performance) {
    return <div className="text-white">No data available</div>;
  }

  const pieData = [
    { name: "Correct", value: performance.correct },
    { name: "Incorrect", value: performance.incorrect },
    { name: "Un-Answered", value: performance.unanswered },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  return (
    <div className="bg-[#131B26] text-white p-4 rounded-md">
      <h2 className="text-2xl font-bold mb-2">All Questions Performance</h2>
      <hr className="border-t border-gray-600 mb-4" />

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500 inline-block" />
            <span>
              <strong>Used:</strong> {performance.used}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-teal-500 inline-block" />
            <span>
              <strong>Unused:</strong> {performance.unused}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 inline-block" />
            <span>
              <strong>Total Questions:</strong> {performance.total_questions}
            </span>
          </div>

          {/* Correct */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500 inline-block" />
            <span>
              <strong>Correct:</strong> {performance.correct}
            </span>
          </div>

          {/* Incorrect */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-500 inline-block" />
            <span>
              <strong>Incorrect:</strong> {performance.incorrect}
            </span>
          </div>

          {/* Unanswered */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-yellow-400 inline-block" />
            <span>
              <strong>Un-Answered:</strong> {performance.unanswered}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPerformance;
