import React, { useState, useEffect } from "react";
import { useStateContext } from "@context/ContextProvider";
import { usersAPI, organizationsAPI, keysAPI, authAPI } from "../api/api.ts";
import UserPage from "../components/UserPage.jsx";
import OrganisationPage from "../components/OrganisationPage.jsx";
import CreateOrganization from "../components/CreateOrganization.jsx";
import AllUsers from "../components/AllUsers.jsx";
import updateaccountcheck from "../utils/updateaccountcheck.js";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert, Tabs, Tab, Box } from "@mui/material";
import { Role } from "../roles.js";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const OwnPage = () => {
  const { user, setUser } = useStateContext();
  const isLoggedIn = !!user;
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [telegram, setTelegram] = useState(user?.telegram || "");
  const [role, setRole] = useState(user?.role || Role.TAVALLINEN);


  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [organisations, setOrganisations] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

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
      current_password: currentPassword,
      email: email,
      telegram: telegram,
    };

    const user_id = user.id;

    if (!username || !email) {
      handleSnackbar(t("usereditmandfields"), "error");
      return;
    }

    if (!currentPassword) {
      handleSnackbar(t("currentpasswordrequired"), "error");
      return;
    }

    try {
      // Validation is now handled by the backend
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

      const confirmUpdate = window.confirm(t("usereditconfirm"));
      if (!confirmUpdate) {
        console.log("User cancelled the update.");
        return;
      }

      const updateResponse = await usersAPI.updateUser(user_id, details);
      setUser(updateResponse.data);
      handleSnackbar(t("usereditsuccess"), "success");
      await getAllUsers();

      // Clear passwords after successful update
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error(t("usereditfail"), error);
      // Handle specific validation errors from backend
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (errors.current_password) {
          handleSnackbar(t("invalidcurrentpassword"), "error");
          return;
        }
        if (errors.email) {
          handleSnackbar(t("emailinuse"), "error");
          return;
        }
        if (errors.username) {
          handleSnackbar(t("usernameinuse"), "error");
          return;
        }
        if (errors.telegram) {
          handleSnackbar(t("telegraminuse"), "error");
          return;
        }
      }
      handleSnackbar(t("usereditfail"), "error");
    }
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
  const handleCreateOrganization = async (organizationObject) => {
    try {
      const response = await organizationsAPI.getOrganizationsByEmail(organizationObject.email);
      const existingOrganizations = response.data;
      if (
        existingOrganizations.some((org) => org.name === organizationObject.name)
      ) {
        handleSnackbar(t("orgcreatenamefail"), "error");
      }
      if (
        existingOrganizations.some((org) => org.email === organizationObject.email)
      ) {
        handleSnackbar(t("emailinuse"), "error");
      } else {
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
        username: u.username,
        email: u.email,
        telegram: u.telegram,
        role: u.role,
        memberships: u.keys ? u.keys.map((organization) => organization.name) : [],
        resrights: u.rights_for_reservation,
      }));
      setAllUsers(userData);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
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
          .updateUser(selectedUserId, { role: Role.LEPPISPJ })
          .then((response) => {
            console.log("Role updated successfully:", response.data);
          });
        usersAPI
          .updateUser(loggedUserId, { role: Role.TAVALLINEN })
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

  const getPermission = async () => {
    /*
    Check if the logged user has permissions for something
    This prevents harm caused by localstorage manipulation
    */

    await authAPI
      .getUserInfo()
      .then((response) => {
        const currentUser = response.data;
        if (currentUser.role === Role.LEPPISPJ) {
          setHasPermission(true);
          setHasPermissionOrg(true);
        } else if (
          currentUser.role == Role.LEPPISVARAPJ ||
          currentUser.role == Role.MUOKKAUS ||
          currentUser.role == Role.JARJESTOPJ
        ) {
          setHasPermissionOrg(true);
          setHasPermission(false);
        } else if (currentUser[0]) {
          if (currentUser[0].role === Role.LEPPISPJ) {
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
                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="user settings tabs">
                    <Tab label={t("owninfo")} />
                    <Tab label={t("changepassword")} />
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  <UserPage
                    mode="info"
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    telegram={telegram}
                    setTelegram={setTelegram}
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    handleUserDetails={handleUserDetails}
                    role={role}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <UserPage
                    mode="password"
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    handleUserDetails={handleUserDetails}
                  />
                </TabPanel>
                {
                  <OrganisationPage
                    organizations={organisations}
                    hasPermissionOrg={hasPermissionOrg}
                    handleOrganizationDetails={handleOrganizationDetails}
                    handleDeleteOrganization={handleDeleteOrganization}
                    fetchOrganizations={getOrganisations}
                  />
                }
                {hasPermission === true && (
                  <CreateOrganization
                    handleCreateOrganization={handleCreateOrganization}
                    fetchOrganizations={getOrganisations}
                  />
                )}
                {hasPermissionOrg === true && (
                  <AllUsers
                    allUsers={allUsers}
                    organizations={organisations}
                    handleUpdateAnotherUser={handleUpdateAnotherUser}
                    handlePJChange={handlePJChange}
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
