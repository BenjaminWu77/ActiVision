import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

const Login: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 
    const { login } = useContext(AuthContext); 

    const handleRegisterClick = () => {
        setIsRegister(true);
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleLoginClick = () => {
        setIsRegister(false);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
  
        // Registration logic
        if (isRegister) {
          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }
          try {
            await axios.post('http://localhost:5001/api/register', {
              email: username,
              password,
            });
            setMessage('Registration successful');
            setError('');
            setTimeout(() => {
              navigate('/home'); // Redirect to the dashboard after 3 seconds
            }, 3000);
          } catch (error) {
            setError('Registration failed');
          }
        } 
        // Login logic
        else {
          try {
            const response = await axios.post('http://localhost:5001/api/login', {
              email: username,
              password,
            });
            const { accessToken } = response.data; // Get token from response
  
            // Use AuthContext's login function to store the token
            login(accessToken); 
            localStorage.setItem('accessToken', accessToken); // Store token in local storage
            setMessage('Login successful');
            setError('');
            setTimeout(() => {
              navigate('/home'); // Redirect to the home after login
            }, 3000);
          } catch (error) {
            setError('Login failed');
          }
        }
    };

    return (
      <div style={styles.loginContainer}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
              <h1 style={styles.title}>{isRegister ? 'Register' : 'Login'}</h1>
              <div style={styles.inputBox}>
                <FaUser style={styles.icon} />
                <input 
                  type="text" 
                  placeholder='Username' 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  style={styles.input}
                />
              </div>
              <div style={styles.inputBox}>
                <FaLock style={styles.icon}/>
                <input 
                  type="password" 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={styles.input}
                />
              </div>

              {isRegister && (
                <div style={styles.inputBox}>
                  <FaLock style={styles.icon}/>
                  <input 
                    type="password" 
                    placeholder='Confirm Password' 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.rememberForget}>
                {!isRegister && (
                  <>
                    <label style={styles.checkboxLabel}><input type="checkbox" style={styles.checkbox} />Remember me</label>
                    <a href="#" style={styles.forgotPassword}>Forgot password?</a>
                  </>
                )}
              </div>

              <button type="submit" style={styles.button}>{isRegister ? 'Register' : 'Login'}</button>

              {error && <div style={{ ...styles.alert, ...styles.error }}>{error}</div>}
              {message && <div style={{ ...styles.alert, ...styles.success }}>{message}</div>}

              <div style={styles.registerLink}>
                <p>{isRegister ? 'Already have an account?' : "Don't have an account?"} <a href="#" onClick={isRegister ? handleLoginClick : handleRegisterClick} style={styles.link}>{isRegister ? 'Login' : 'Register'}</a></p>
              </div>

            </form>
        </div>
      </div>
    );
};

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '100px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  inputBox: {
    position: 'relative',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px 10px 10px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: '#333',
  },
  icon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: '#888',
  },
  rememberForget: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#333',
  },
  checkbox: {
    marginRight: '5px',
  },
  forgotPassword: {
    fontSize: '14px',
    color: '#007bff',
    textDecoration: 'none',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  alert: {
    textAlign: 'center',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;