import React, { useState } from "react";
import axios from "axios";
import LoginPage from "./loginpage";
import "../index.css";
import newaccountcheck from "../utils/newaccountcheck";

const NewAccountPage = ({ onAccountCreated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [error, setError] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const API_URL = process.env.API_URL;

  const handleCreateAccount = () => {
    const response = newaccountcheck({
      username,
      password,
      email,
      telegram,
      confirmPassword,
      API_URL,
    });
    if (typeof response === "string") {
      setError(response);
    } else {
      createAccount();
    }
  };

  const createAccount = () => {
    /*
    Send request to server to check if email is already in use
    */

    axios
      .get(`${API_URL}/api/listobjects/users/?email=${email}`)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        const existingUsers = response.data;
        if (existingUsers.some((user) => user.email === email)) {
          setError("Sähköposti on jo käytössä.");
        } else {
          const userObject = {
            username,
            password,
            email,
            telegram,
            role: 5,
            organization: null,
            keys: null,
          };
          axios
            .post(`${API_URL}/api/users/register`, userObject)
            .then((response) => {
              console.log(response);
              console.log("Account created successfully!");
              setUserCreated(true);
              onAccountCreated && onAccountCreated();

              // Set timeout to hide success message after 5 seconds
              setTimeout(() => {
                setUserCreated(false);
              }, 5000);
            })
            .catch((error) => {
              console.error("Error creating account:", error);
              setError("Virhe luotaessa käyttäjää.");
            });
          setShowLoginPage(true);
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        setError("Virhe tarkistettaessa sähköpostia.");
      });
  };

  const handleBackToLogin = () => {
    setShowLoginPage(true);
  };

  const toggleShowPasswords = () => {
    setShowPasswords((prevState) => !prevState);
  };

  const createForm = () => (
    <form className="form-container">
      <h3>Luo uusi käyttäjä</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="input-fields">
        <div>
          <label htmlFor="usernameInput">Käyttäjänimi:</label>
          <input
            id="usernameInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="passwordInput">Salasana:</label>
          <input
            id="passwordInput"
            type={showPasswords ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPasswordInput">Vahvista salasana:</label>
          <input
            id="confirmPasswordInput"
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={toggleShowPasswords}
          />
          Näytä salasana
        </div>
        <div>
          <label htmlFor="emailInput">Sähköposti:</label>
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="telegramInput">Telegram (valinnainen):</label>
          <input
            id="telegramInput"
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
      </div>
      <button
        className="login-button"
        type="button"
        onClick={handleBackToLogin}
      >
        Takaisin
      </button>
      <button
        className="create-user-button"
        type="button"
        onClick={handleCreateAccount}
      >
        Luo käyttäjä
      </button>
    </form>
  );

  return (
    <div id="right_content">
      {showLoginPage ? <LoginPage /> : createForm()}
      {userCreated && (
        <p style={{ color: "green" }}>Käyttäjä luotu onnistuneesti!</p>
      )}
    </div>
  );
};

export default NewAccountPage;
