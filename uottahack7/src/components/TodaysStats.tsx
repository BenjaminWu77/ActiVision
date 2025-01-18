import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodaysStats: React.FC = () => {
  const [pushups, setPushups] = useState(0);
  const [screenTime, setScreenTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5001/api/todays-stats');
      setPushups(response.data.pushups);
      setScreenTime(response.data.screenTime);
    };
    fetchData();
  }, []);

  return (
    <div style={styles.todaysStats}>
      <h2>Today's Stats</h2>
      <p>Pushups: {pushups}</p>
      <p>Available Screen Time: {screenTime} minutes</p>
    </div>
  );
};

const styles = {
  todaysStats: {
    margin: '20px 0',
  },
};

export default TodaysStats;