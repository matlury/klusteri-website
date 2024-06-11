import React from "react";
import { TextField, Button, FormGroup } from "@mui/material";

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
      <FormGroup sx={{ marginBottom: 2 }}>
        <TextField
          id="email"
          label="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup sx={{ marginBottom: 2 }}>
        <TextField
          id="password"
          label="Salasana"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>

      <div style={{ marginTop: 10 }}>
        <Button
          variant="contained"
          className="login-button"
          color="primary"
          type="button"
          onClick={handleLogin}
        >
          Kirjaudu sisään
        </Button>
      </div>

      <div style={{ marginTop: 10 }}>
        <Button
          variant="text"
          className="create-user-button"
          color="primary"
          type="button"
          onClick={handleCreateUser}
        >
          Luo tili
        </Button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
