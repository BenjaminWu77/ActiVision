import React from 'react';

const BestWorkouts: React.FC = () => {
  return (
    <div style={styles.bestWorkouts}>
      <h2>Best Workouts</h2>
      <p>Most Pushups in a Day: 200</p>
      <p>Most Situps in a Day: 180</p>
      <p>Longest Workout Streak: 30 days</p>
    </div>
  );
};

const styles = {
  bestWorkouts: {
    margin: '20px 0',
  },
};

export default BestWorkouts;