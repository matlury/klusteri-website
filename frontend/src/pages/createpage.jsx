import React, { useState } from 'react';
import LoginPage from './loginpage';
import '../index.css'
import axios from 'axios'

const NewAccountPage = ({ onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoginPage, setShowLoginPage] = useState(false)

  const handleCreateAccount = () => {
    if (password !== confirmPassword) {
      console.log('Passwords do not match. Please try again.');
      return;
    }

    const userObject = {
      username: username,
      password: password,
      email: email,
      telegram: telegram,
      role: 5
    }

    axios
    .post('http://localhost:8000/users/', userObject)
    .then(response => {
      console.log(response)
    })

    console.log('Account created successfully!');
    if (onAccountCreated) {
      onAccountCreated();
    }
  
  };
  const handleBackToLogin = () => {
    setShowLoginPage(true)
    }

    const createForm = () => (
      <form>
        <h2>Create New Account</h2>
        <div>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          e-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          telegram:
          <input
            type="telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleCreateAccount}>
          Create Account
        </button>
        <button type="button" onClick={handleBackToLogin}>
          Back
        </button>
      </form>
    );



  return (
    <div id="right_content">
      {showLoginPage ? (
        <LoginPage />
    ) : (
      createForm()
    )}
  </div>
  );
};




export default NewAccountPage;