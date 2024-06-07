import React from "react";
import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
  FormGroup,
} from "@mui/material";

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
  <FormGroup>
    <h3>Luo tili</h3>
    {error && <p style={{ color: "red" }}>{error}</p>}
    <div className="input-fields">
      <div>
        <TextField
          id="usernameInput"
          label="Käyttäjänimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="passwordInput"
          label="Salasana"
          type={showPasswords ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="confirmPasswordInput"
          label="Vahvista"
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
          label="Näytä salasana"
        />
      </div>
      <div>
        <TextField
          id="emailInput"
          label="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="telegramInput"
          label="Telegram (valinnainen)"
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
          Luo tili
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
          Takaisin
        </Button>
      </div> 
    </div>
  </FormGroup>
);

export default CreateForm;
