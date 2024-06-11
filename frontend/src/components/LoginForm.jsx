import React from "react";
import { TextField, Button, FormGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

const LoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  handleCreateUser,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <form>
      <FormGroup>
        <TextField
          id="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          id="password"
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>

      <div style={{ marginTop: 10 }}>
        <Button
          id="login-button"
          variant="contained"
          className="login-button"
          color="primary"
          type="button"
          onClick={handleLogin}
        >
          {t("login")}
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
          {t("createacc")}
        </Button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
