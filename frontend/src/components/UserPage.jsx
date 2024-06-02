import React from "react";
import { Button, TextField } from "@mui/material";

const UserPage = ({
  username,
  setUsername,
  email,
  setEmail,
  telegram,
  setTelegram,
  handleUserDetails,
  role,
}) => {
  return (
    <form>
      <h2>Omat tiedot</h2>
      <div>
        <TextField
          id="username"
          label="Käyttäjänimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="email"
          label="Sähköposti"
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
        Tallenna{" "}
      </Button>
      <br />
      <div>Käyttäjän rooli: {role}</div>

      <br />
    </form>
  );
};

export default UserPage;
