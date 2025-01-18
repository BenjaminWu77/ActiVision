import React from 'react';

const mockLeaderboard = [
  { name: 'Alice', workouts: 50 },
  { name: 'Bob', workouts: 45 },
  { name: 'Charlie', workouts: 40 },
];

const Leaderboard: React.FC = () => {
  return (
    <div style={styles.leaderboard}>
      <h2>Leaderboard</h2>
      <ul>
        {mockLeaderboard.map((user, index) => (
          <li key={index}>
            {user.name}: {user.workouts} workouts
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  leaderboard: {
    margin: '20px 0',
  },
};

export default Leaderboard;