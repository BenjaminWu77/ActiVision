import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './login';
import { AuthProvider, AuthContext } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div style={styles.app}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? <>{children}</> : <Navigate to="/login" />;
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