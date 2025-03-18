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
        /* خلفية داكنة */
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Your Radar</h3>

      <RadarChart
        cx="50%"
        cy="50%"
        width={800}
        height={800}
        data={analytics}
        margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
        outerRadius="60%"
      >
        {/* خطوط الشبكة باللون الرمادي الفاتح مع شفافية بسيطة */}
        <PolarGrid stroke="#ccc" strokeOpacity={0.3} />
        
        {/* تسميات المحاور باللون الأبيض وحجم خط أصغر */}
        <PolarAngleAxis
          dataKey="name"
          tick={{
            fontSize: 10,
            fill: '#fff',
          }}
        />
        
        {/* محور القيم: اللون الأبيض للنص مع مجال من 0 إلى 100 */}
        <PolarRadiusAxis
          angle={30}
          domain={[0, maxValue]}
          tick={{ fill: '#fff', fontSize: 10 }}
          stroke="#ccc"
          strokeOpacity={0.3}
        />

        {/* تغيير لون الـRadar (Score) إلى أحمر */}
        <Radar
          name="Score"
          dataKey="value"
          stroke="#ff0000"
          fill="#ff0000"
          fillOpacity={0.6}
        />

        {/* جعل لون النص في الـLegend أبيض */}
        <Legend
          wrapperStyle={{ color: '#fff' }}
        />

        {/* خلفية التولتيب داكنة مع نص أبيض */}
        <Tooltip
          contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
          cursor={{ stroke: '#fff', strokeWidth: 1 }}
        />
      </RadarChart>
    </div>
  );
};

export default RadarScore;
