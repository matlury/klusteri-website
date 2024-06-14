import React, { useState } from "react";
import LoginPage from "./loginpage";
import newaccountcheck from "../utils/newaccountcheck";
import CreateForm from "../components/CreateForm";
import createaccount from "../utils/createaccount";
import { useTranslation } from "react-i18next";

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
  const [recaptchaResponse, setRecaptchaResponse] = useState("");

  const API_URL = process.env.API_URL;

  const { t } = useTranslation();

  const handleCreateAccount = async () => {
    const response = await newaccountcheck({
      username,
      password,
      email,
      telegram,
      confirmPassword,
      API_URL,
      t
    });
    if (typeof response === "string") {
      setError(response);
    } else if (response === true) {
      const resp = await createaccount({
        API_URL,
        email,
        username,
        password,
        telegram,
        setUserCreated,
        setShowLoginPage,
        onAccountCreated,
        recaptchaResponse,
        t
      });
      if (typeof resp === "string") {
        setError(resp);
      }
    } else {
      setError(t("errorusercreate"));
    }
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
          setRecaptchaResponse={setRecaptchaResponse}
        />
      )}
      {userCreated && (
        <p style={{ color: "green" }}>{t("usersuccess")}</p>
      )}
    </div>
  );
};

export default NewAccountPage;
