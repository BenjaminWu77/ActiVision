import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const TodaysStats: React.FC = () => {
  const [pushups, setPushups] = useState(0);
  const [situps, setSitups] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ pushups: number; situps: number; screenTime: number }>('http://localhost:5001/api/todays-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPushups(response.data.pushups);
      setSitups(response.data.situps);
      setScreenTime(response.data.screenTime);
    } catch (err) {
      setError('Failed to fetch today\'s stats');
    }
  };

  useEffect(() => {
    fetchData();

    socket.on('updateTodaysStats', (updatedStats) => {
      setPushups(updatedStats.pushups);
      setSitups(updatedStats.situps);
      setScreenTime(updatedStats.screenTime);
    });

    return () => {
      socket.off('updateTodaysStats');
    };
  }, []);

  useEffect(() => {
    // Increment screen time as pushups and situps go up
    setScreenTime(pushups * 2 + situps);
  }, [pushups, situps]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Today's Stats</h1>
      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.stat}>Push-ups: {pushups}</p>
      <p style={styles.stat}>Sit-ups: {situps}</p>
      <p style={styles.stat}>Screen Time: {screenTime} minutes</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as 'center',
    padding: '40px',
    borderRadius: '10px',
    background: '#f0f4c3',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  header: {
    fontSize: '3em',
    marginBottom: '30px',
  },
  error: {
    color: 'red',
    fontSize: '1.5em',
  },
  stat: {
    fontSize: '2em',
    margin: '20px 0',
  },
};

export default TodaysStats;