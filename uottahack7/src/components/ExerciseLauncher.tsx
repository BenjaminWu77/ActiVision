import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const ExerciseLauncher: React.FC = () => {
  const [exerciseType, setExerciseType] = useState(0); // 0 for Push-ups, 1 for Sit-ups
  const [duration, setDuration] = useState('20');
  const [durationType, setDurationType] = useState('seconds');
  const [message, setMessage] = useState<string | null>(null);

  const handleLaunch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      let durationInSeconds = parseInt(duration);
      if (durationType === 'minutes') {
        durationInSeconds *= 60;
      }

      const response = await fetch('http://localhost:5001/api/launch-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ exerciseType, duration: durationInSeconds }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Exercise session completed successfully!');
        socket.emit('join-exercise-session', data.user._id);
      } else {
        setMessage('Failed to start exercise session.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    socket.on('exercise-complete', (data) => {
      setMessage('Exercise session completed successfully!');
    });

    return () => {
      socket.off('exercise-complete');
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Launch Exercise</h2>
      <div style={styles.formGroup}>
        <div style={styles.leftColumn}>
          <label style={styles.label}>Exercise Type:</label>
          <div style={styles.buttonGroup}>
            <button
              style={exerciseType === 0 ? styles.activeButton : styles.button}
              onClick={() => setExerciseType(0)}
            >
              Push-ups
            </button>
            <button
              style={exerciseType === 1 ? styles.activeButton : styles.button}
              onClick={() => setExerciseType(1)}
            >
              Sit-ups
            </button>
          </div>
        </div>
        <div style={styles.rightColumn}>
          <label style={styles.label}>Duration:</label>
          <div style={styles.durationGroup}>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={styles.input}
              min="0"
              step="1"
            />
            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              style={styles.select}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
            </select>
          </div>
          <div style={styles.quickButtons}>
            <button onClick={() => { setDuration('10'); setDurationType('seconds'); }} style={styles.quickButton}>10s</button>
            <button onClick={() => { setDuration('30'); setDurationType('seconds'); }} style={styles.quickButton}>30s</button>
          </div>
        </div>
      </div>
      <button onClick={handleLaunch} style={styles.launchButton}>Start Exercise</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as 'center',
    padding: '20px',
    borderRadius: '10px',
    background: '#e0f7fa',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  header: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '20px',
  },
  leftColumn: {
    flex: 1,
    marginRight: '10px',
  },
  rightColumn: {
    flex: 1,
    marginLeft: '10px',
  },
  label: {
    display: 'block',
    fontSize: '1.2em',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  },
  activeButton: {
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #007bff',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  durationGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  input: {
    width: '60px',
    padding: '10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    appearance: 'textfield',
  },
  select: {
    padding: '10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  quickButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  quickButton: {
    padding: '5px 10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  },
  launchButton: {
    padding: '10px 20px',
    fontSize: '1.2em',
    borderRadius: '5px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontSize: '1.2em',
    color: '#007bff',
  },
};

export default ExerciseLauncher;