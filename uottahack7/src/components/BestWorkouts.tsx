import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pushups', count: 200 },
  { name: 'Situps', count: 180 },
  { name: 'Streak', count: 30 },
];

const BestWorkouts: React.FC = () => {
  return (
    <div style={styles.bestWorkouts}>
      <h2>Best Workouts</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  bestWorkouts: {
    margin: '20px 0',
  },
};

export default BestWorkouts;