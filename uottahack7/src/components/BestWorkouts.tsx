// filepath: /Users/marcvidal/Documents/Code/Uottahack/ActivAI/uottahack7/src/components/BestWorkouts.tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const initialData = [
  { name: 'Pushups', count: 200, date: 'Sep 24' },
  { name: 'Situps', count: 180, date: 'Dec 2' },
  { name: 'Streak', count: 7, date: '' },
];

const BestWorkouts: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user-data', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const { pushupDayStreak } = response.data;

        setData(prevData => {
          const updatedData = [...prevData];
          updatedData[2].count = pushupDayStreak || 7;
          return updatedData;
        });
      } catch (error) {
        console.error('Error fetching streak data:', error);
      }
    };

    fetchStreak();
  }, []);

  return (
    <div style={styles.bestWorkouts}>
      <h2>Best Workouts</h2>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name, props) => {
              const date = props.payload.date;
              return date ? [`${value}`, `Date: ${date}`] : [`${value}`];
            }} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  bestWorkouts: {
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default BestWorkouts;