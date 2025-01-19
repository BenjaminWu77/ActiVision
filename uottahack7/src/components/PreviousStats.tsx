import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const initialData = [
  { name: 'Sep', pushups: 250, situps: 240 },
  { name: 'Oct', pushups: 300, situps: 139 },
  { name: 'Nov', pushups: 200, situps: 980 },
  { name: 'Dec', pushups: 278, situps: 390 },
  { name: 'Jan', pushups: 60, situps: 110 },
];

interface PreviousStatsData {
  sep: { pushups: number, situps: number };
  oct: { pushups: number, situps: number };
  nov: { pushups: number, situps: number };
  dec: { pushups: number, situps: number };
  jan: { pushups: number, situps: number };
}

const PreviousStats: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchPreviousStats = async () => {
      try {
        const response = await axios.get<PreviousStatsData>('http://localhost:5001/api/previous-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const { sep, oct, nov, dec, jan } = response.data;

        setData([
          { name: 'Sep', pushups: sep.pushups, situps: sep.situps },
          { name: 'Oct', pushups: oct.pushups, situps: oct.situps },
          { name: 'Nov', pushups: nov.pushups, situps: nov.situps },
          { name: 'Dec', pushups: dec.pushups, situps: dec.situps },
          { name: 'Jan', pushups: jan.pushups, situps: jan.situps },
        ]);
      } catch (error) {
        console.error('Error fetching previous stats:', error);
      }
    };

    fetchPreviousStats();
  }, []);

  return (
    <div style={styles.previousStats}>
      <h2>Previous Stats</h2>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="90%" height={400}>
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
    </div>
  );
};

const styles = {
  previousStats: {
    padding: '20px',
    backgroundColor: 'transparent',
    borderRadius: '8px',
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

export default PreviousStats;