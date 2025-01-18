import React from 'react';
import Leaderboard from './Leaderboard';
import WebsiteBlocker from './WebsiteBlocker';
import PreviousStats from './PreviousStats';
import BestWorkouts from './BestWorkouts';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.dashboard}>
      <h1>Workout Dashboard</h1>
      <div style={styles.bentoBox}>
        <div style={{ ...styles.box, ...styles.leaderboardBox }}>
          <Leaderboard />
        </div>
        <div style={{ ...styles.box, ...styles.statsBox }}>
          <PreviousStats />
        </div>
        <div style={{ ...styles.box, ...styles.workoutsBox }}>
          <BestWorkouts />
        </div>
        <div style={{ ...styles.box, ...styles.blockerBox }}>
          <WebsiteBlocker />
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    width: '90%',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  bentoBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    gap: '20px',
  },
  box: {
    padding: '20px',
    borderRadius: '10px',
    background: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  leaderboardBox: {
    gridColumn: 'span 2',
    background: '#e3f2fd',
  },
  statsBox: {
    background: '#ffebee',
  },
  workoutsBox: {
    background: '#e8f5e9',
  },
  blockerBox: {
    background: '#fff3e0',
  },
};

export default Dashboard;