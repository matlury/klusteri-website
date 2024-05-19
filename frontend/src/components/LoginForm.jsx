import React from "react";

const LoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  handleCreateUser,
  error,
}) => {
  return (
    <form>
      <h3>Sisäänkirjautuminen</h3>
      <div className="form-group">
        <label htmlFor="email">Sähköposti:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Salasana:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" type="submit" onClick={handleLogin}>
        Kirjaudu sisään
      </button>
      <button
        className="create-user-button"
        type="button"
        onClick={handleCreateUser}
      >
        Luo uusi käyttäjä
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
