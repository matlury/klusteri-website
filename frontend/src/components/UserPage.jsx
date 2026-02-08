import React from "react";
import {
  Button,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ROLE_DESCRIPTIONS } from "../roles";

const UserPage = ({
  mode = "info", // "info" or "password"
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  currentPassword,
  setCurrentPassword,
  telegram,
  setTelegram,
  handleUserDetails,
  role,
}) => {
  const { t } = useTranslation();

  if (mode === "password") {
    return (
      <form>
        <h2>{t("changepassword")}</h2>
        <div style={{ display: "flex", flexDirection: "column", rowGap: "0.6em", width: "300px" }}>
          <TextField
            id="currentPassword"
            label={t("oldpassword")}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <TextField
            id="password"
            data-testid="password-field"
            label={t("newpassword")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            id="confirmPassword"
            data-testid="confirm-password-field"
            label={t("confirmnewpassword")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleUserDetails}
            variant="contained"
            className="update-password-button"
            data-testid="savepassword"
          >
            {t("save")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form>
      <h2>{t("owninfo")}</h2>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.6em", width: "300px" }}>
        <TextField
          id="username"
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="telegram"
          label="Telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />

        <TextField
          id="currentPassword"
          label={t("currentpassword")}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ marginTop: "1em" }}
          helperText={t("currentpassword_helper")}
        />

        <Button
          onClick={handleUserDetails}
          variant="contained"
          className="create-user-button"
          data-testid="saveuserdata"
        >
          {t("save")}
        </Button>
        <div style={{ marginTop: "0.5em", fontSize: "0.9em", color: "#666" }}>
          {t("userrole")}: {ROLE_DESCRIPTIONS[role]}
        </div>
      </div>
    </form>
  );
};

export default UserPage;
