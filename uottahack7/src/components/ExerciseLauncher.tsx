import React, { useState } from 'react';

const ExerciseLauncher: React.FC = () => {
  const [exerciseType, setExerciseType] = useState('0');
  const [duration, setDuration] = useState('60');

  const handleLaunch = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/launch-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseType, duration }),
      });

      if (response.ok) {
        alert('Exercise session started!');
      } else {
        alert('Failed to start exercise session.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while starting the exercise session.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Start Exercise Session</h2>
      <div style={styles.inputGroup}>
        <label>Exercise Type:</label>
        <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} style={styles.input}>
          <option value="0">Push-ups</option>
          <option value="1">Sit-ups</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label>Duration (seconds):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleLaunch} style={styles.button}>Start</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    borderRadius: '10px',
    background: '#e0f7fa',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '5px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default ExerciseLauncher;