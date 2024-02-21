import React, { useState } from 'react';
import '../index.css';
import NewAccountPage from './createpage';
import axiosClient from "../axios.js";
import { useStateContext } from "../context/ContextProvider.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const { user, setUser, setToken } = useStateContext();

  const handleCreateUser = () => {
    setShowCreateUser(true);
  };

  const handleLogin = event => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    axiosClient.post('/token/', credentials)
      .then(({ data }) => {
        setToken(data.access);
        axiosClient.get('/users/userlist', {
          headers: {
            Authorization: `Bearer ${data.access}`
          }
        })
        .then(response => {
          setUser(response.data);
          console.log('User details:', response.data);
      })})
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setError(response.data.message);
        }
      });
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <div id="right_content">
      {showCreateUser ? (
        <NewAccountPage />
      ) : user ? (
        <>
          <p>Hei {user.username}!</p>
          <button className="logout-button" onClick={handleLogout}>Kirjaudu ulos</button>
        </>
      ) : (
        <form>
          <div className="form-group">
            <label htmlFor="email">Sähköposti:</label>
            <input
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana:</label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-button" type="submit" onClick={handleLogin}>Kirjaudu sisään</button>
          <button className="create-user-button" type="button" onClick={handleCreateUser}>Luo uusi käyttäjä</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
