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
  const [error, setError] = useState('');

  const handleCreateAccount = () => {
    // Tarkista, että käyttäjänimi, salasana, sähköposti ja vahvista salasana eivät ole tyhjiä
    if (!username || !password || !email || !confirmPassword) {
      setError('Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.');
      return;
    }

    // Tarkista, että salasana ja vahvista salasana ovat samat
    if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää.');
      return;
    }

    // Tarkista, että salasana on 8-20 merkkiä pitkä
    if (password.length < 8 || password.length > 20) {
      setError('Salasanan tulee olla 8-20 merkkiä pitkä.');
      return;
    }

    // Lähetä käyttäjän tiedot palvelimelle
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
    <div className="background">
      <form className="form-container">
        <h2>Luo uusi käyttäjä</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="input-fields">
          <div>
            Käyttäjänimi:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            Salasana:
            <input
              type={showPasswords ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={toggleShowPasswords}
            />
            Näytä salasana
          </div>
          <div>
            Vahvista salasana:
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            Sähköposti:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            Telegram (valinnainen):
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>
        </div>
        <div className="button-container">
          <button type="button" onClick={handleCreateAccount}>
            Luo käyttäjä
          </button>
          <button type="button" onClick={handleBackToLogin}>
            Takaisin
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div id="right_content">{showLoginPage ? <LoginPage /> : createForm()}</div>
  );
};

export default NewAccountPage;
