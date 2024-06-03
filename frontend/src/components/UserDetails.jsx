import React from "react";

// Shows user details if view button is pressed
const UserDetails = ({
  allUsers,
  userId,
  userDetailsUsername,
  setUserDetailsUsername,
  userDetailsEmail,
  setuserDetailsEmail,
  userDetailsTelegram,
  userDetailsRole,
  setuserDetailsRole,
  userDetailsOrganizations,
  hasPermissionOrg,
  handleUpdateAnotherUser,
  hasPermission,
  handlePJChange,
  selectedUser,
}) => {
  const user = allUsers.find((user) => user.id === userId);
  if (selectedUser === userId && user) {
    return (
      <div>
        Käyttäjänimi:
        <input
          id="user_new_username"
          type="text"
          value={userDetailsUsername}
          onChange={(e) => setUserDetailsUsername(e.target.value)}
        />
        Sähköposti:
        <input
          id="user_new_email"
          type="text"
          value={userDetailsEmail}
          onChange={(e) => setuserDetailsEmail(e.target.value)}
        />
        Telegram:
        <input
          id="user_new_telegram"
          type="text"
          value={userDetailsTelegram}
          onChange={(e) => setuserDetailsTelegram(e.target.value)}
        />
        Rooli:
        <input
          id="user_new_role"
          type="text"
          value={userDetailsRole}
          onChange={(e) => setuserDetailsRole(e.target.value)}
        />
        <p>Jäsenyydet: </p>
        <ul>
          {userDetailsOrganizations.map((org) => (
            <li key={org}> {org}</li>
          ))}
        </ul>
        <br />
        {/* display a button for saving the changes if the user has a role <= 3 */}
        {hasPermissionOrg === true && (
          <button
            onClick={handleUpdateAnotherUser}
            className="create-user-button"
            type="button"
            style={{ marginBottom: ".25em" }}
          >
            Vahvista muutokset
          </button>
        )}
        {hasPermission === true && (
          <button
            onClick={() => handlePJChange(user.id)}
            className="change-pj-button"
            type="button"
          >
            Siirrä PJ-oikeudet
          </button>
        )}
        <p></p>
      </div>
    );
  }
  return null;
};

export default UserDetails;
