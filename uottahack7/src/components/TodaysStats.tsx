import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TodaysStatsResponse {
  pushups: number;
  situps: number;
  screenTime: number;
}

const TodaysStats: React.FC = () => {
  const [pushups, setPushups] = useState(0);
  const [situps, setSitups] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<TodaysStatsResponse>('http://localhost:5001/api/todays-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPushups(response.data.pushups);
        setSitups(response.data.situps);
        setScreenTime(response.data.screenTime);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token expired, try to refresh it
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post('http://localhost:5001/api/refresh-token', { token: refreshToken });
              localStorage.setItem('token', refreshResponse.data.accessToken);
              // Retry the original request
              const retryResponse = await axios.get<TodaysStatsResponse>('http://localhost:5001/api/todays-stats', {
                headers: {
                  'Authorization': `Bearer ${refreshResponse.data.accessToken}`
                }
              });
              setPushups(retryResponse.data.pushups);
              setSitups(retryResponse.data.situps);
              setScreenTime(retryResponse.data.screenTime);
            } catch (refreshError) {
              setError('Failed to refresh token');
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
            }
          } else {
            setError('No refresh token available');
          }
        } else {
          setError('Failed to fetch today\'s stats');
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Today's Stats</h1>
      {error && <p>{error}</p>}
      <p>Push-ups: {pushups}</p>
      <p>Sit-ups: {situps}</p>
      <p>Screen Time: {screenTime} minutes</p>
    </div>
  );
};

export default TodaysStats;