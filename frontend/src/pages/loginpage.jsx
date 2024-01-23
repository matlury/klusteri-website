import React, { useState } from 'react';
import '../index.css'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    const validUsername = 'demoUser';
    const validPassword = 'demoPassword';
    if (username === validUsername && password === validPassword) {
      setLoggedIn(true);
      console.log('Login successful!');
    } else {
      setLoggedIn(false);
      console.log('Invalid username or password. Please try again.');
    }
  };

  const handleNewUser = () => {
    console.log('New user registration...');
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
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      <button type="button" onClick={handleNewUser}>
        Create new account
      </button>
    </form>
  );

  return (
    <div id="content2">
      {loggedIn ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p>{loginForm()}</p>
      )}
    </div>
  );
};

export default LoginPage;
