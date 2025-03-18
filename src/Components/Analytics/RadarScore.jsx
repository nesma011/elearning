import React, { useState, useEffect, useContext } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from 'recharts';
import { useParams } from 'react-router-dom';

const RadarScore = () => {
  const { yearId } = useParams();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let token = localStorage.getItem("access_token")
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/analyticsSystem/${yearId}`, {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
       
        if (data && Array.isArray(data.performance)) {
          const formattedData = data.performance.map((item) => ({
            name: item.name,
            value: item.rate || 0,
          }));
          setAnalytics(formattedData);
        } else {
          setError('Invalid data format received.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch analytics data.');
        console.error(err);
        setLoading(false);
      });
  }, [yearId, API_BASE_URL]);

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

  if (!analytics || analytics.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = 100;

  return (
    <div className="bg-white text-black rounded shadow">
      <div className="bg-gray-800 text-white p-2">
        <h2 className="font-bold text-lg">Your Radar</h2>
      </div>

      <div className="flex items-center justify-center p-4">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        width={500}
        height={500}
        data={analytics}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend />
        <Tooltip />
      </RadarChart>

      </div>
    </div>
  );
};

export default RadarScore;
