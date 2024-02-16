import React, { useState } from 'react';
import axios from 'axios'
import '../index.css'
import NewAccountPage from './createpage'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [error, setError] = useState('');

  const handleCreateUser = () => {
    setShowCreateUser(true); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/api/token/`, {
        username,
        password
      })
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setLoggedIn(true)
    } catch (err) {
      setError('Invalid username or password');
    }
  }

  const loginForm = () => (
    <form>
      <div>
        Käyttäjänimi:
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        Salasana:
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="login-button" onClick={handleLogin}>
        Login
      </button>
      <button type="create-button" onClick={handleCreateUser}>
        Create new account
      </button>
    </form>
  );

  return (
    <div id="right_content">
    {showCreateUser ? (
      <NewAccountPage /> 
    ) : loggedIn ? (
      <p>Welcome, {username}!</p>
    ) : (
      loginForm() 
    )}
  </div>
  );
};

export default LoginPage;
