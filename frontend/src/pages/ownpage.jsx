import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { usersAPI, organizationsAPI, keysAPI, authAPI } from "../api/api.ts";
import UserPage from "../components/UserPage.jsx";
import OrganisationPage from "../components/OrganisationPage.jsx";
import CreateOrganization from "../components/CreateOrganization.jsx";
import AllUsers from "../components/AllUsers.jsx";
import updateaccountcheck from "../utils/updateaccountcheck.js";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from "@mui/material";
import { ROLE_DESCRIPTIONS } from "../roles.js";

const OwnPage = () => {
  const { user, setUser } = useStateContext();
  const isLoggedIn = !!user;
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [telegram, setTelegram] = useState(user?.telegram || "");
  const [role, setRole] = useState(user?.role || "5");

  // user_details* variables for viewing and updating someone else's information
  const [userDetailsUsername, setUserDetailsUsername] = useState("");
  const [userDetailsPassword, setUserDetailsPassword] = useState("");
  const [userDetailsConfirmPassword, setUserDetailsConfirmPassword] = useState("");
  const [userDetailsEmail, setuserDetailsEmail] = useState("");
  const [userDetailsTelegram, setuserDetailsTelegram] = useState("");
  const [userDetailsRole, setuserDetailsRole] = useState(null);
  const [userDetailsOrganizations, setuserDetailsOrganizations] = useState([]);
  const [userDetailsId, setuserDetailsId] = useState("");

  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const [organization_email, setOrganizationEmail] = useState("");
  const [organization_name, setOrganizationName] = useState("");
  const [organization_homepage, setOrganizationHomePage] = useState("");
  const [organization_color, setOrganizationColor] = useState("");

  const [organization_new_email, setOrganizationNewEmail] = useState("");
  const [organization_new_name, setOrganizationNewName] = useState("");
  const [organization_new_homepage, setOrganizationNewHomePage] = useState("");
  const [organization_new_color, setOrganizationNewColor] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [hasPermissionOrg, setHasPermissionOrg] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", "info", "warning"

  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn && user) {
      setUsername(user.username);
      setEmail(user.email);
      setTelegram(user.telegram);
      setRole(user.role);
      getOrganisations();
      getAllUsers();
      getPermission();
    }
  }, [isLoggedIn, user]);

  // Handles the user info update when the 'Vahvista Muutokset' button is clicked and gives error messages if the new username, email or telegram are taken by some other user
  const handleUserDetails = async (event) => {
    event.preventDefault();

    const details = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      email: email,
      telegram: telegram,
    };

    const user_id = user.id;

    if (!username || !email) {
      handleSnackbar(t("usereditmandfields"), "error");
      return;
    }

    try {
      if (telegram) {
        const response = await usersAPI.getUsersByTelegram(telegram);
        const existingUsers = response.data;
        if (existingUsers.some((u) => u.telegram === telegram && u.id !== user.id)) {
          handleSnackbar(t("telegraminuse"), "error");
          return;
        }
      }

      if (password) {
        if (password !== confirmPassword) {
          handleSnackbar(t("diffpass"), "error");
          return;
        }
        if (password.length < 8 || password.length > 20) {
          handleSnackbar(t("mincharspass"), "error");
          return;
        }
        if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
          handleSnackbar(t("invalidpass"), "error");
          return;
        }
      }

      const response = await usersAPI.getUsersByEmail(email);
      const existingUsers = response.data;
      if (existingUsers.some((u) => u.email === email && u.id !== user.id)) {
        handleSnackbar(t("emailinuse"), "error");
        return;
      }

      const confirmUpdate = window.confirm(t("usereditconfirm"));
      if (!confirmUpdate) {
        console.log("User cancelled the update.");
        return;
      }

      const updateResponse = await usersAPI.updateUser(user_id, details);
      setUser(updateResponse.data);
      setUser(updateResponse.data);
      handleSnackbar(t("usereditsuccess"), "success");
      await getAllUsers();
    } catch (error) {
      console.error(t("usereditfail"), error);
      handleSnackbar(t("usereditfail"), "error");
    }

    setPassword("");
    setConfirmPassword("");
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleUpdateAnotherUser = async (
    userDetailsId,
    userDetailsUsername,
    userDetailsPassword,
    userDetailsConfirmPassword,
    userDetailsEmail,
    userDetailsTelegram,
    userDetailsRole,
    userDetailsOrganizations,
  ) => {
    /*
    Event handler for updating someone else's information.
    No validation here because backend takes care of it.
    */
    //event.preventDefault();

    const confirmUpdate = window.confirm(t("usereditforother"));

    if (!confirmUpdate) {
      return;
    }

    if (!userDetailsUsername || !userDetailsEmail) {
      handleSnackbar(t("usereditmandfields"), "error");
      return;
    }

    const updatedValues = {
      username: userDetailsUsername,
      password: userDetailsPassword,
      email: userDetailsEmail,
      telegram: userDetailsTelegram,
      role: userDetailsRole,
      id: userDetailsId,
    };

    try {
      const validationError = await updateaccountcheck({
        username: userDetailsUsername,
        password: userDetailsPassword,
        email: userDetailsEmail,
        telegram: userDetailsTelegram,
        confirmPassword: userDetailsConfirmPassword,
        t
      });

      if (typeof validationError === "string") {
        handleSnackbar(validationError, "error");
        return;
      }

      const response = await usersAPI.updateUser(userDetailsId, updatedValues);
      handleSnackbar(t("usereditsuccess"), "success");

      if (userDetailsEmail === email) {
        localStorage.setItem("loggedUser", JSON.stringify(response.data));
        setUser(response.data);
      }

      await getAllUsers();
    } catch (error) {
      handleSnackbar(t("usereditfail"), "error");
    }
  };
  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE ORGANIZATIONS

  // Keeps the organization information up-to-date
  const getOrganisations = async () => {
    try {
      const res = await organizationsAPI.organizationsWithKeys();
      const rawData = res.data;
      console.log("Fetched organizations:", rawData);
      const orgData = rawData.map((u) => ({
        id: u.id,
        Organisaatio: u.name,
        email: u.email,
        kotisivu: u.homepage,
        color: u.color,
        Avaimia: u.user_set.length,

      }));
      setOrganisations(orgData);
    } catch (error) {
      console.error(error);
    }
  };

  // Shows the information of organizations after clicking the view-button
  const toggleOrgDetails = (orgId) => {
    const organization = organisations.find((org) => org.id === orgId);
    setOrganizationNewName(organization.name);
    setOrganizationNewEmail(organization.email);
    setOrganizationNewHomePage(organization.homepage);
    setOrganizationNewColor(organization.color);
    setSelectedOrg((prevSelectedOrg) => {
      if (prevSelectedOrg === orgId) {
        return null;
      }
      return orgId;
    });
  };

  // Handles organization detail updates
  const handleOrganizationDetails = async (
    organization_new_name,
    organization_new_email,
    organization_new_homepage,
    organization_new_color,
    orgId,
  ) => {
    const newOrganizationObject = {
      name: organization_new_name,
      email: organization_new_email,
      homepage: organization_new_homepage,
      color: organization_new_color,
    };
    try {
      await organizationsAPI.updateOrganization(orgId, newOrganizationObject);
      handleSnackbar("Järjestö muokattu onnistuneesti!", "success");
      await getOrganisations();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  // Handles deletion of organization
  const handleDeleteOrganization = async (orgId) => {
    const confirmUpdate = window.confirm(
      t("orgdeleteconfirm"),
    );
    if (confirmUpdate) {
      try {
        await organizationsAPI.deleteOrganization(orgId);
        await getOrganisations();
        await getAllUsers();
        handleSnackbar(t("orgdeletesuccess"), "success");
      } catch (error) {
        handleSnackbar(t("orgdeletefail"), "error");
      }
    }
  };

  // Handles the creation of organizations
  const handleCreateOrganization = async () => {
    try {
      const response = await organizationsAPI.getOrganizationsByEmail(organization_email);
      const existingOrganizations = response.data;
      if (
        existingOrganizations.some((org) => org.name === organization_name)
      ) {
        handleSnackbar(t("orgcreatenamefail"), "error");
      }
      if (
        existingOrganizations.some((org) => org.email === organization_email)
      ) {
        handleSnackbar(t("emailinuse"), "error");
      } else {
        const organizationObject = {
          name: organization_name,
          email: organization_email,
          homepage: organization_homepage,
          color: organization_color,
        };
        await createOrganization(organizationObject);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };
  const createOrganization = async (organizationObject) => {
    try {
      await organizationsAPI.createOrganization(organizationObject);
      handleSnackbar(t("orgcreatesuccess"), "success");
      await getOrganisations();
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION FOR ALL USERS (ONLY VISIBLE FOR LEPPIS PJ)

  // Gets every users data from backend
  const getAllUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      const rawData = response.data;
      const userData = rawData.map((u) => ({
        id: u.id,
        Käyttäjänimi: u.username,
        email: u.email,
        Telegram: u.telegram,
        Rooli: ROLE_DESCRIPTIONS[u.role],
        Jäsenyydet: u.keys.map((organization) => organization.name),
        resrights: u.rights_for_reservation,
      }));
      setAllUsers(userData);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const toggleUserDetails = (userId) => {
    const showThisUser = allUsers.find((user) => user.id === userId);
    setUserDetailsUsername(showThisUser.username);
    setuserDetailsEmail(showThisUser.email);
    setuserDetailsTelegram(showThisUser.telegram);
    setuserDetailsRole(showThisUser.role);
    setuserDetailsId(showThisUser.id);

    // get a list of each organization the user is a member of
    const orgDict = showThisUser.keys;
    setuserDetailsOrganizations(orgDict.map((org) => org.name));

    setSelectedUser((prevSelectedUser) => {
      if (prevSelectedUser === userId) {
        return null;
      }
      return userId;
    });
  };

  // Handles PJ change
  const handlePJChange = async (userId) => {
    const selectedUserId = userId;
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const loggedUserId = loggedUser.id;

    confirmupdate();

    function confirmupdate() {
      const confirmUpdate = window.confirm(t("pjchange"));

      if (confirmUpdate) {
        usersAPI
          .updateUser(selectedUserId, { role: 1 })
          .then((response) => {
            console.log("Role updated successfully:", response.data);
          });
        usersAPI
          .updateUser(loggedUserId, { role: 5 })
          .then((response) => {
            localStorage.setItem("loggedUser", JSON.stringify(response.data));
            setUser(response.data);
          })
          .catch((error) => {
            console.error("Error updating user details:", error);
          });
      } else {
        console.log("User cancelled the update.");
      }
    }
  };

  const handleResRightChange = async (userId) => {
    const selectedUserId = userId;

    confirmupdate();

    function confirmupdate() {
      const confirmUpdate = window.confirm(t("resrightsconfirm"));

      if (confirmUpdate) {
        usersAPI
          .changeReservationRights(selectedUserId)
          .then(() => {
          })
          .catch((error) => {
            console.error("Error changing reservation rights:", error);
          });
      } else {
        console.log("User cancelled the update.");
      }
    }
  };

  // Handles key submit
  //const handleKeySubmit = async (event) => {
  const handleKeySubmit = async (UserId, Organization) => {
    // event.preventDefault();

    // if (!selectedUserId || !selectedOrganization) {
    //   console.error("Please select a user and an organization");
    //   return;
    // }

    // Display a confirmation dialog before handing over the key
    const confirmKeyHandover = window.confirm(t("handoverkeyconfirm"));

    if (!confirmKeyHandover) {
      return;
    }

    try {
      const response = await keysAPI.handOverKey(UserId, {
        organization_name: Organization,
      });
      // Check the response and update the UI accordingly
      if (response.status === 200) {
        // Successful key handover
        handleSnackbar(t("handoverkeysuccess"), "success");
        await getAllUsers();
      } else {
        // Error in key handover
        handleSnackbar("ERROR", "error");
      }
    } catch (error) {
      console.error("Error in key handover:", error);
      handleSnackbar(t("handoverkeyfail"), "error");
    }
  };

  // Handles select user
  const handleSelectUser = (event) => {
    setSelectedUser(event.target.value);
  };

  // Handles select organization
  const handleSelectOrganization = (event) => {
    setSelectedOrganization(event.target.value);
  };

  const getPermission = async () => {
    /*
    Check if the logged user has permissions for something
    This prevents harm caused by localstorage manipulation
    */

    await authAPI
      .getUserInfo()
      .then((response) => {
        const currentUser = response.data;
        if (currentUser.role === 1) {
          setHasPermission(true);
          setHasPermissionOrg(true);
        } else if (
          currentUser.role == 2 ||
          currentUser.role == 3 ||
          currentUser.role == 6
        ) {
          setHasPermissionOrg(true);
          setHasPermission(false);
        } else if (currentUser[0]) {
          if (currentUser[0].role === 1) {
            setHasPermission(true);
            setHasPermissionOrg(true);
          }
        } else {
          setHasPermission(false);
          setHasPermissionOrg(false);
        }
      });
  };

  return (
    <div>
      {!isLoggedIn && <h3>{t("loginsuggest")}</h3>}
      {isLoggedIn && (
        <div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            data-testid="snackbar"
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <div style={{ display: "flex" }}>
            <div id="left_content">
              <div id="leftleft_content">
                {
                  <UserPage
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    email={email}
                    setEmail={setEmail}
                    telegram={telegram}
                    setTelegram={setTelegram}
                    handleUserDetails={handleUserDetails}
                    role={role}
                  />
                }
                {
                  <OrganisationPage
                    organizations={organisations}
                    selectedOrg={selectedOrg}
                    hasPermissionOrg={hasPermissionOrg}
                    organization_new_name={organization_new_name}
                    setOrganizationNewName={setOrganizationNewName}
                    organization_new_homepage={organization_new_homepage}
                    setOrganizationNewHomePage={setOrganizationNewHomePage}
                    organization_new_email={organization_new_email}
                    setOrganizationNewEmail={setOrganizationNewEmail}
                    organization_new_color={organization_new_color}
                    setOrganizationNewColor={setOrganizationNewColor}
                    handleOrganizationDetails={handleOrganizationDetails}
                    hasPermission={hasPermission}
                    handleDeleteOrganization={handleDeleteOrganization}
                    toggleOrgDetails={toggleOrgDetails}
                    fetchOrganizations={getOrganisations}
                  />
                }
                {hasPermission === true && (
                  <CreateOrganization
                    organization_name={organization_name}
                    setOrganizationName={setOrganizationName}
                    organization_email={organization_email}
                    setOrganizationEmail={setOrganizationEmail}
                    organization_homepage={organization_homepage}
                    setOrganizationHomePage={setOrganizationHomePage}
                    organization_color={organization_color}
                    setOrganizationColor={setOrganizationColor}
                    handleCreateOrganization={handleCreateOrganization}
                    fetchOrganizations={getOrganisations}
                  />
                )}
                {hasPermissionOrg === true && (
                  <AllUsers
                    allUsers={allUsers}
                    organizations={organisations}
                    toggleUserDetails={toggleUserDetails}
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
                    handleKeySubmit={handleKeySubmit}
                    handleResRightChange={handleResRightChange}
                    fetchOrganizations={getOrganisations}
                    getAllUsers={getAllUsers}
                  />
                )}
              </div>
            </div>
            {hasPermission === true && (
              <div
                id="centered_content"
                style={{
                  position: "center",
                  bottom: "170px",
                  left: "30%",
                  width: "30%",
                  height: "40%",
                  backgroundColor: "#fff",
                  padding: "20px",
                }}
              ></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnPage;
