import React from "react";
import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
  FormGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
}) => {
  const { t } = useTranslation();
  return (
  <FormGroup>
    <h3>{t("createacc")}</h3>
    {error && <p style={{ color: "red" }}>{error}</p>}
    <div className="input-fields">
      <div>
        <TextField
          id="usernameInput"
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="passwordInput"
          label={t("password")}
          type={showPasswords ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="confirmPasswordInput"
          label={t("confirmpassword")}
          type={showPasswords ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox checked={showPasswords} onChange={toggleShowPasswords} />
          }
          label={t("showpassword")}
        />
      </div>
      <div>
        <TextField
          id="emailInput"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="telegramInput"
          label={t("telegram")}
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>
    </div>
    <div className="button-container">
      <div>
        <Button
          variant="contained"
          className="create-user-button"
          color="primary"
          type="button"
          onClick={handleCreateAccount}
        >
          {t("createacc")}
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          className="login-button"
          color="primary"
          type="button"
          onClick={handleBackToLogin}
        >
          {t("goback")}
        </Button>
      </div> 
    </div>
  </FormGroup>
)};

export default CreateForm;
