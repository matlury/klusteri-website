import React from "react";

const CreateForm = ({
  error,
  username,
  setUsername,
  showPasswords,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  toggleShowPasswords,
  email,
  setEmail,
  telegram,
  setTelegram,
  handleBackToLogin,
  handleCreateAccount,
}) => (
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
    <button className="login-button" type="button" onClick={handleBackToLogin}>
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

export default CreateForm;
