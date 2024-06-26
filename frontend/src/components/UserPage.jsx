import React from "react";
import { Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ROLE_DESCRIPTIONS } from "../roles";

const UserPage = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  telegram,
  setTelegram,
  handleUserDetails,
  role,
}) => {
  const { t } = useTranslation();
  return (
    <form>
      <h2>{t("owninfo")}</h2>
      <div>
        <TextField
          id="username"
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="password"
          data-testid="password-field"
          label={t("password")}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="confirmPassword"
          data-testid="confirm-password-field"
          label={t("confirmpassword")}
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="telegram"
          label="Telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>
      <Button
        onClick={handleUserDetails}
        variant="contained"
        className="create-user-button"
        data-testid="saveuserdata"
      >
        {t("save")}{" "}
      </Button>

      <div>
        {t("userrole")}: {ROLE_DESCRIPTIONS[role]}
      </div>
    </form>
  );
};

export default UserPage;
