import React from 'react';

const PreviousStats: React.FC = () => {
  return (
    <div style={styles.previousStats}>
      <h2>Previous Stats</h2>
      <p>Total Workouts: 120</p>
      <p>Total Pushups: 3000</p>
      <p>Total Situps: 2500</p>
    </div>
  );
};

const styles = {
  previousStats: {
    margin: '20px 0',
  },
};

export default PreviousStats;