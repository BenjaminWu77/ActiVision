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
        const response = await axios.get<TodaysStatsResponse>('http://localhost:5001/api/todays-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPushups(response.data.pushups);
        setSitups(response.data.situps);
        setScreenTime(response.data.screenTime);
      } catch (err) {
        console.error('Error fetching today\'s stats:', err);
        setError('Failed to fetch today\'s stats.');
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.todaysStats}>
      <h2>Today's Stats</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <p>Pushups: {pushups}</p>
          <p>Situps: {situps}</p>
          <p>Available Screen Time: {screenTime} minutes</p>
        </>
      )}
    </div>
  );
};

const styles = {
  todaysStats: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default TodaysStats;