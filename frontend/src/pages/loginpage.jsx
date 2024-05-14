import React, { useState, useEffect } from "react";
import "../index.css";
import NewAccountPage from "./createpage";
import { useStateContext } from "../context/ContextProvider.jsx";
import CountdownTimer from "../context/CountdownTimer.jsx";
import login from "../utils/login.js";
import LoginForm from "../../components/LoginForm.jsx";

const LoginPage = ({ onLogin, onLogout, onCreateNewUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const { user, setUser, setToken, timeLeft } = useStateContext();
  const [error, setError] = useState("");

  // Saves the logged user (if there is one)
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, [setUser]);

  // Handles the switch to the create user view if the button is clicked
  const handleCreateUser = () => {
    setShowCreateUser(true);
    onCreateNewUser();
  };

  // Handles the login function
  const handleLogin = (event) => {
    event.preventDefault();
    login({ email, password, setError, setToken, onLogin, setUser });
  };

  // Handles the logout function and clears the countdown timer
  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("countdownTime");
    setUser(null);
    onLogout();
  };

  // renders the NewAccountPage if the showCreateUser function is true, if the user is logged in, it shows the username and logout-button
  // if the user is not logged nor in the create new user page, it shows the loginpage
  // starts the countdown timer for automatic logout

  return (
    <div id="right_content">
      {showCreateUser ? (
        <NewAccountPage />
      ) : user ? (
        <>
          <p>Hei {user.username}!</p>
          <button className="logout-button" onClick={handleLogout}>
            Kirjaudu ulos
          </button>
          <br />
          <br />
          <p>Automaattinen uloskirjaus:</p>
          <CountdownTimer initialTime={timeLeft} onExpire={handleLogout} />
        </>
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
