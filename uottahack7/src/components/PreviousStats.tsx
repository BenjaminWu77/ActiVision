
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', pushups: 400, situps: 240 },
  { name: 'Feb', pushups: 300, situps: 139 },
  { name: 'Mar', pushups: 200, situps: 980 },
  { name: 'Apr', pushups: 278, situps: 390 },
  { name: 'May', pushups: 189, situps: 480 },
  { name: 'Jun', pushups: 239, situps: 380 },
  { name: 'Jul', pushups: 349, situps: 430 },
];

const PreviousStats: React.FC = () => {
  return (
    <div style={styles.previousStats}>
      <h2>Previous Stats</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pushups" stroke="#8884d8" />
          <Line type="monotone" dataKey="situps" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  previousStats: {
    margin: '20px 0',
  },
};

export default PreviousStats;