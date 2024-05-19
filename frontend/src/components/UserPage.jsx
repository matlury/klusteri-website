import React from "react";

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
      <div>
        Käyttäjänimi:
        <input
          id="username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        Sähköposti:
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Telegram:
        <input
          id="telegram"
          type="telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>
      <br />
      <div>Rooli: {role}</div>
      <div>Virka:</div>
      <div>Tyyppi:</div>
      <div>Myöntämispäivä:</div>
      <div>Avaimet:</div>
      <br />
      <button
        onClick={handleUserDetails}
        className="create-user-button"
        type="button"
      >
        Vahvista muutokset
      </button>
    </form>
  );
};

export default UserPage;
