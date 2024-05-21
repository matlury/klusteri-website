import React from "react";
import UserDetails from "./UserDetails";

// Shows all users
const AllUsers = ({
  allUsers,
  toggleUserDetails,
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
  return (
    <div>
      <p></p>
      <h4>Käyttäjät</h4>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {allUsers.map((user) => (
          <li key={user.id}>
            {user.username}
            <button
              className="login-button"
              onClick={() => toggleUserDetails(user.id)}
            >
              View
            </button>
            {
              <UserDetails
                allUsers={allUsers}
                userId={user.id}
                userDetailsUsername={userDetailsUsername}
                setUserDetailsUsername={setUserDetailsUsername}
                userDetailsEmail={userDetailsEmail}
                setuserDetailsEmail={setuserDetailsEmail}
                userDetailsTelegram={userDetailsTelegram}
                userDetailsRole={userDetailsRole}
                setuserDetailsRole={setuserDetailsRole}
                userDetailsOrganizations={userDetailsOrganizations}
                hasPermissionOrg={hasPermissionOrg}
                handleUpdateAnotherUser={handleUpdateAnotherUser}
                hasPermission={hasPermission}
                handlePJChange={handlePJChange}
                selectedUser={selectedUser}
              />
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
