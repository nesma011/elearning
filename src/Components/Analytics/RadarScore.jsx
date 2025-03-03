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
          cx={150}
          cy={150}
          outerRadius={100}
          width={400}
          height={400}
          data={analytics}
        >
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#333', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, maxValue]}
            axisLine={false}
            tick={{ fill: '#666', fontSize: 10 }}
          />
          <Radar
            name="You Used (%)"
            dataKey="value"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.3}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
          />
          <Tooltip />
        </RadarChart>
      </div>
    </div>
  );
};

export default RadarScore;
