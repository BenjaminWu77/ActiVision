import React from 'react';
import Dashboard from './components/components/Dashboard';

const App: React.FC = () => {
  return (
    <div style={styles.app}>
      <Dashboard />
    </div>
  );
};

const styles = {
  app: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default App;