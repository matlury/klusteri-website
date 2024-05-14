import React, { useState } from "react";
import axios from "axios";
import LoginPage from "./loginpage";
import "../index.css";
import newaccountcheck from "../utils/newaccountcheck";
import CreateForm from "../../components/CreateForm";

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

  const handleCreateAccount = async () => {
    const response = await newaccountcheck({
      username,
      password,
      email,
      telegram,
      confirmPassword,
      API_URL,
    });
    if (typeof response === "string") {
      setError(response);
    } else if (response === true) {
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

  return (
    <div id="right_content">
      {showLoginPage ? (
        <LoginPage />
      ) : (
        <CreateForm
          error={error}
          username={username}
          setUsername={setUsername}
          showPasswords={showPasswords}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          toggleShowPasswords={toggleShowPasswords}
          email={email}
          setEmail={setEmail}
          telegram={telegram}
          setTelegram={setTelegram}
          handleBackToLogin={handleBackToLogin}
          handleCreateAccount={handleCreateAccount}
        />
      )}
      {userCreated && (
        <p style={{ color: "green" }}>Käyttäjä luotu onnistuneesti!</p>
      )}
    </div>
  );
};

export default NewAccountPage;
