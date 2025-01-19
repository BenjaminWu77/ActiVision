import React, { useState } from 'react';

const ExerciseLauncher: React.FC = () => {
  const [exerciseType, setExerciseType] = useState('0');
  const [duration, setDuration] = useState('60');

  const handleLaunch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:5001/api/launch-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ exerciseType, duration, token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Exercise session started! Results: ${JSON.stringify(data.results)}`);
        alert('Exercise session started!');
      } else {
        const errorData = await response.json();
        alert(`Failed to start exercise session: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while starting the exercise session.');
    }
  };

  return (
    <div>
      <h2>Exercise Launcher</h2>
      <label>
        Exercise Type:
        <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)}>
          <option value="0">Push-ups</option>
          <option value="1">Sit-ups</option>
        </select>
      </label>
      <label>
        Duration (seconds):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
      <button onClick={handleLaunch}>Start</button>
    </div>
  );
};

export default ExerciseLauncher;