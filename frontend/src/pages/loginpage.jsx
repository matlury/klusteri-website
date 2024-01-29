import React, { useState } from 'react';
import axios from 'axios'
import '../index.css'
import NewAccountPage from './createpage'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false)

  //esimerkkifunktio datan hakemiselle rajapinnasta
  const getData = () => {
    axios
    .get('http://localhost:8000/users/')
    .then(response => {
      const data = response.data
      //setUsername(data[1].username)
      console.log(response.data)
    })
  }

  //esimerkkifunktio datan lähettämiselle rajapintaan
  const sendData = () => {
    const userObject = {
      username: username,
      password: password,
      role: 5
    }
  
    axios
      .post('http://localhost:8000/users/', userObject)
      .then(response => {
        console.log(response)
      })
  }

  const handleCreateUser = () => {
    setShowCreateUser(true); 
  };

  const handleLogin = () => {
    setLoggedIn(true)
  };

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
