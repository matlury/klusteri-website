import React, { useState } from 'react';
import axios from 'axios'
import '../index.css'
import NewAccountPage from './createpage'
import axiosClient from "../axios.js";
import { useStateContext } from "../context/ContextProvider.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [error, setError] = useState('');
  const { user, token, setUser, setToken } = useStateContext()

  const handleCreateUser = () => {
    setShowCreateUser(true); 
  };

  const handleLogin = event => {
    event.preventDefault()

    const credentials = {
      email: email,
      password: password
    }

    axiosClient.post('/token/', credentials)
      .then(({ data }) => {
        setToken(data.access);
        axiosClient.get('/users/userlist', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setUser(response.data)
          console.log('User details:', response.data)
      })})
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setError(response.data.message)
        }
      })
  }

  const loginForm = () => (
    <form>
      <div>
        Sähköposti:
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    ) : user ? (
      <p>Welcome, {user.username}!</p>
    ) : (
      loginForm() 
    )}
  </div>
  );
};

export default LoginPage;
