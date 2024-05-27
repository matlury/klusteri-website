import React from "react";
import { TextField, Button } from "@mui/material";

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
        <TextField
          id="email"
          label="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <TextField
          id="password"
          label="Salasana"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        variant="text"
        className="create-user-button"
        color="primary"
        type="submit"
        onClick={handleCreateUser}
      >
        Luo tili
      </Button>

      <Button
        variant="contained"
        className="login-button"
        color="primary"
        type="submit"
        onClick={handleLogin}
      >
        Kirjaudu sisään
      </Button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
