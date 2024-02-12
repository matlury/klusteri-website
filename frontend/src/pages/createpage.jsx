import React, { useState } from 'react';
import axios from 'axios';
import LoginPage from './loginpage';
import '../index.css';

const NewAccountPage = ({ onAccountCreated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleCreateAccount = () => {
    if (password !== confirmPassword) {
      console.log('Passwords do not match. Please try again.');
      return;
    }

    const userObject = { username, password, email, telegram, role: 5 };

    axios.post('http://localhost:8000/users/', userObject).then(response => {
      console.log(response);
      console.log('Account created successfully!');
      onAccountCreated && onAccountCreated();
    });
    setShowLoginPage(true);
  };

  const handleBackToLogin = () => {
    setShowLoginPage(true);
  };

  const toggleShowPasswords = () => {
    setShowPasswords(prevState => !prevState);
  };

  const createForm = () => (
    <form>
      <h2>Create New Account</h2>
      {['Username', 'Password', 'Confirm Password', 'e-mail', 'telegram'].map(field => (
        <div key={field.toLowerCase()}>
          {field}:
          <input
            type={field.toLowerCase().includes('password') && !showPasswords ? 'password' : 'text'}
            value={
              field === 'Username' ? username :
              field === 'Password' ? password :
              field === 'Confirm Password' ? confirmPassword :
              field === 'e-mail' ? email :
              field === 'telegram' ? telegram : ''
            }
            onChange={(e) => {
              const value = e.target.value;
              switch (field) {
                case 'Username':
                  setUsername(value);
                  break;
                case 'Password':
                  setPassword(value);
                  break;
                case 'Confirm Password':
                  setConfirmPassword(value);
                  break;
                case 'e-mail':
                  setEmail(value);
                  break;
                case 'telegram':
                  setTelegram(value);
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      ))}
      <button type="button" onClick={handleCreateAccount}>
        Create Account
      </button>
      <button type="button" onClick={handleBackToLogin}>
        Back
      </button>
      <button type="button" onClick={toggleShowPasswords}>
        {showPasswords ? "Hide Passwords" : "Show Passwords"}
      </button>
    </form>
  );

  return (
    <div id="right_content">{showLoginPage ? <LoginPage /> : createForm()}</div>
  );
};

export default NewAccountPage;
