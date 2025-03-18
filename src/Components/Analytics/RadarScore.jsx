import React, { useState, useEffect } from 'react';
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

  const token = localStorage.getItem("access_token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/analyticsSystem/${yearId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!analytics || analytics.length === 0) {
    return <div>No data available</div>;
  }

  const maxValue = 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3 style={{ fontSize: '1.5rem' }}>Your Radar</h3>

      <RadarChart
        cx="50%"
        cy="50%"
        // يمكنك زيادة العرض والارتفاع حسب الحاجة
        width={800}
        height={800}
        data={analytics}
        // تكبير الـ margin لتوفير مساحة للنصوص الطويلة
        margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
        outerRadius="60%"
      >
        <PolarGrid />
        
        {/* تصغير حجم الخط على محور الزوايا */}
        <PolarAngleAxis
          dataKey="name"
          tick={{
            fontSize: 10, // قلل حجم الخط
            fill: '#333',
          }}
        />

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
  );
};

export default RadarScore;
