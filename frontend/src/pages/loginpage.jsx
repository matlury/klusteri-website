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

  // Saves the logged user (if there is one)
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [setUser])

  // Handles the switch to the create user view if the button is clicked
  const handleCreateUser = () => {
    setShowCreateUser(true);
    onCreateNewUser()
  };

  // Handles the login function
  const handleLogin = event => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    // Checks if the credentials match using tokens, and if the user is authenticated it saves the logged user to local storage
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
          localStorage.setItem('isLoggedIn', true)
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

  // Handles the logout function
  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    localStorage.removeItem('isLoggedIn')
    setUser(null)
    setIsLoggedIn(false)
    onLogout()
  };

  // renders the NewAccountPage if the showCreateUser function is true, if the user is logged in, it shows the username and logout-button
  // if the user is not logged nor in the create new user page, it shows the loginpage

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
