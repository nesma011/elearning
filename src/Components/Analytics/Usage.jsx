import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Usage = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    fetch(`${API_BASE_URL}/performance/question/`, {
      headers: {
       "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODQ2NjQ4LCJpYXQiOjE3NDAyNDE4NDYsImp0aSI6IjU0ZTVkNWJlN2Q3ZDRkMjk4OTYzNjhmYmJmNTlkMjkxIiwidXNlcl9pZCI6NjZ9.sZRJuReyOg4ZaIK-Z4cMhcgS2svPKOLbaAcF4I1oSF4",
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

  const used = performance.used || 0;
  const unused = performance.unused || 0;
  const total = performance.total_questions || 0;

  const data = [
    { name: "Used Questions", value: used },
    { name: "Unused Questions", value: unused },
  ];

  const COLORS = ["#fda4af", "#93c5fd"]; 

  return (
    <div className="bg-white text-black border rounded shadow p-4">
      <div className="bg-gray-800 text-white p-2 mb-4">
        <h2 className="text-lg font-bold">Your Usage</h2>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-72 p-4 flex items-center justify-center">
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}   
              outerRadius={80}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-6">QBank Usage</h3>
          <p className="mb-2">
            <span className="font-semibold">Used Questions:</span> {used}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Unused Questions:</span> {unused}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Total Questions:</span> {total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Usage;
