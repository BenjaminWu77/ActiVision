import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const mockLeaderboard = [
  { name: 'Alice', workouts: 50 },
  { name: 'Bob', workouts: 45 },
  { name: 'Charlie', workouts: 40 },
  { name: 'Dave', workouts: 35 },
];

const socket = io('http://localhost:5001');

const Leaderboard: React.FC = () => {
  const [user, setUser] = useState<{ name: string; workouts: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        
        const response = await axios.get<{ name: string; workouts: number }>(
          'http://localhost:5001/api/user-data',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('Fetched user data:', response.data); // Add this for debugging
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();

    socket.on('updateLeaderboard', (updatedUser) => {
      setLeaderboard((prevLeaderboard) => {
        const newLeaderboard = prevLeaderboard.map(u => 
          u.name === updatedUser.name ? updatedUser : u
        );
        newLeaderboard.sort((a, b) => b.workouts - a.workouts);
        return newLeaderboard;
      });
    });

    return () => {
      socket.off('updateLeaderboard');
    };
  }, []);

  const combinedLeaderboard = user ? [...leaderboard.filter(u => u.name !== user.name), user] : leaderboard;
  combinedLeaderboard.sort((a, b) => b.workouts - a.workouts);

  return (
    <div style={styles.leaderboard}>
      <h2>Weekly Leaderboard</h2>
      <ul style={styles.list}>
        {combinedLeaderboard.map((user, index) => (
          <li key={index} style={styles.listItem}>
            <div style={styles.rank}>{index + 1}</div>
            <div style={styles.name}>{user.name}</div>
            <div style={styles.workouts}>{user.workouts} workouts</div>
            {index === 0 && <div style={styles.trophy}>🏆</div>}
            {index === 1 && <div style={styles.trophy}>🥈</div>}
            {index === 2 && <div style={styles.trophy}>🥉</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  leaderboard: {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#e3f2fd',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  rank: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  name: {
    flex: 1,
    fontSize: '1.2em',
  },
  workouts: {
    fontSize: '1.2em',
    marginRight: '10px',
  },
  trophy: {
    fontSize: '1.5em',
  },
};

export default Leaderboard;