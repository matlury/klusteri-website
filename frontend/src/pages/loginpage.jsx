import React, { useState, useEffect } from "react";
import NewAccountPage from "./createpage";
import { useStateContext } from "../context/ContextProvider.jsx";
import login from "../utils/login.js";
import LoginForm from "../components/LoginForm.jsx";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from '@mui/material';

const LoginPage = ({ onLogin, onLogout, onCreateNewUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const { user, setUser, setToken, timeLeft } = useStateContext();
  const [error, setError] = useState("");

  const { t } = useTranslation();
  
  // Saves the logged user (if there is one)
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, [setUser]);

  // Handles the switch to the create user view if the button is clicked
  const handleCreateUser = (event) => {
    event.preventDefault();
    setShowCreateUser(true);
    onCreateNewUser();
  };

  // Handles the login function
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await login({ email, password, setError, setToken, onLogin, setUser, t });
      window.location.reload(); // Reload the page after successful login
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // renders the NewAccountPage if the showCreateUser function is true, if the user is logged in, it shows the username and logout-button
  // if the user is not logged nor in the create new user page, it shows the loginpage
  // starts the countdown timer for automatic logout

  return (
    <div id="right_content">
      {showCreateUser ? (
        <NewAccountPage />
      ) : (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleCreateUser={handleCreateUser}
          error={error}
        />
      )}
    </div>
  );
};

export default LoginPage;
