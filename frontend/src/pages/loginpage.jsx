import React, { useState, useEffect } from 'react';
import '../index.css';
import NewAccountPage from './createpage';
import axiosClient from "../axios.js";
import { useStateContext } from "../context/ContextProvider.jsx";

const LoginPage = ({ onLogin, onLogout, onCreateNewUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const { user, setUser, setToken } = useStateContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Merkitsee kirjautuneen käyttäjän
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [setUser])


  const handleCreateUser = () => {
    setShowCreateUser(true);
    onCreateNewUser()
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
          localStorage.setItem('loggedUser', JSON.stringify(response.data))
          setIsLoggedIn(true)
          onLogin()
      })})
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setError(response.data.message);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    setUser(null)
    setIsLoggedIn(false)
    onLogout()
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
