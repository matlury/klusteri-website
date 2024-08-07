import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import axios from "axios";
import axiosClient from "../axios.js";
import UserPage from "../components/UserPage.jsx";
import OrganisationPage from "../components/OrganisationPage.jsx";
import CreateOrganization from "../components/CreateOrganization.jsx";
import AllUsers from "../components/AllUsers.jsx";
import updateaccountcheck from "../utils/updateaccountcheck.js";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from "@mui/material";
import { ROLE_DESCRIPTIONS, ROLE_OPTIONS } from "../roles.js";

const OwnPage = ({ isLoggedIn: propIsLoggedIn }) => {
  const { user, setUser } = useStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [role, setRole] = useState("5");

  // user_details* variables for viewing and updating someone else's information
  const [userDetailsUsername, setUserDetailsUsername] = useState("");
  const [userDetailsPassword, setUserDetailsPassword] = useState("");
  const [userDetailsConfirmPassword, setUserDetailsConfirmPassword] =
    useState("");
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
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", "info", "warning"

  const { t } = useTranslation();

  const API_URL = process.env.VITE_API_URL;
  // Writes down if a user is logged in
  useEffect(() => {
    setIsLoggedIn(false);
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || null;
    if (loggedUser) {
      setIsLoggedIn(true);
      setUsername(loggedUser.username);
      setEmail(loggedUser.email);
      setTelegram(loggedUser.telegram);
      setRole(loggedUser.role);
      getOrganisations();
      getPermission();
    }
  }, [user || propIsLoggedIn]);

  // Fetches the organisations if a user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      getOrganisations();
      getAllUsers();
      getPermission();
    }
  }, [isLoggedIn]);

  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE LOGGED IN USER

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

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const user_id = loggedUser.id;

    if (!username || !email) {
      setError(t("usereditmandfields"));
      setTimeout(() => setError(""), 5000);
      handleSnackbar(t("usereditmandfields"), "error");
      return;
    }
  
    try {
      if (telegram) {
        const response = await axios.get(`${API_URL}/api/listobjects/users/?telegram=${telegram}`);
        const existingUsers = response.data;
        if (existingUsers.some((user) => user.telegram === telegram && user.id !== loggedUser.id)) {
          setError(t("telegraminuse"));
          handleSnackbar(t("telegraminuse"), "error");
          setTimeout(() => setError(""), 5000);
          return;
        }
      }
  
      if (password) {
        if (password !== confirmPassword) {
          setError(t("diffpass"));
          setTimeout(() => setError(""), 5000);
          handleSnackbar(t("diffpass"), "error");
          return;
        }
        if (password.length < 8 || password.length > 20) {
          setError(t("mincharspass"));
          setTimeout(() => setError(""), 5000);
          handleSnackbar(t("mincharspass"), "error");
          return;
        }
        if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
          setError(t("invalidpass"));
          setTimeout(() => setError(""), 5000);
          handleSnackbar(t("invalidpass"), "error");
          return;
        }
      }
  
      const response = await axios.get(`${API_URL}/api/listobjects/users/?email=${email}`);
      const existingUsers = response.data;
      if (existingUsers.some((user) => user.email === email && user.id !== loggedUser.id)) {
        setError(t("emailinuse"));
        handleSnackbar(t("emailinuse"), "error");
        setTimeout(() => setError(""), 5000);
        return;
      }
  
      const confirmUpdate = window.confirm(t("usereditconfirm"));
      if (!confirmUpdate) {
        console.log("User cancelled the update.");
        return;
      }

      const updateResponse = await axiosClient.put(`/users/update/${user_id}/`, details);
      localStorage.setItem("loggedUser", JSON.stringify(updateResponse.data));
      setUser(updateResponse.data);
      setSuccess(t("usereditsuccess"));
      setTimeout(() => setSuccess(""), 5000);
      handleSnackbar(t("usereditsuccess"), "success");
      await getAllUsers();
    } catch (error) {
      console.error(t("usereditfail"), error);
      setError(t("usereditfail"));
      setTimeout(() => setError(""), 5000);
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
      setError(t("usereditmandfields"));
      handleSnackbar(t("usereditmandfields"), "error");
      setTimeout(() => setError(""), 5000);
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
        API_URL,
        t
      });
  
      if (typeof validationError === "string") {
        setError(validationError);
        handleSnackbar(validationError, "error");
        setTimeout(() => setError(""), 5000);
        return;
      }

      const response = await axiosClient.put(`/users/update/${userDetailsId}/`, updatedValues);
      setSuccess(t("usereditsuccess"));
      handleSnackbar(t("usereditsuccess"), "success");
      setTimeout(() => setSuccess(""), 5000);
  
      if (userDetailsEmail === email) {
        localStorage.setItem("loggedUser", JSON.stringify(response.data));
        setUser(response.data);
      }
  
      await getAllUsers();
    } catch (error) {
      setError(t("usereditfail"));
      handleSnackbar(t("usereditfail"), "error");
      setTimeout(() => setError(""), 5000);
    }
  };
  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE ORGANIZATIONS

  // Keeps the organization information up-to-date
  const getOrganisations = async () => {
    try {
      const res = await 
      axiosClient.get("listobjects/organizations/")
      const orgData = res.data.map((u) => ({
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

  useEffect(() => {
    getOrganisations();
  }, []);

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
      await axiosClient
        .put(
          `/organizations/update_organization/${orgId}/`,
          newOrganizationObject);
        setSuccess("Järjestö muokattu onnistuneesti!");
        handleSnackbar("Järjestö muokattu onnistuneesti!", "success");
        setTimeout(() => setSuccess(""), 5000);
        await getOrganisations();
        } catch(error) {
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
        const response = await axiosClient.delete(`/organizations/remove/${orgId}/`);
        await getOrganisations();
        await getAllUsers();
        setSuccess(t("orgdeletesuccess"));
        handleSnackbar(t("orgdeletesuccess"), "success");
        setTimeout(() => setSuccess(""), 5000);
      } catch(error) {
        setError(t("orgdeletefail"));
      }
    }
  };

  // Handles the creation of organizations
  const handleCreateOrganization = async () => {
    try {
      const response = await axios
      .get(
        `${API_URL}/api/listobjects/organizations/?email=${organization_email}`,
      );
      const existingOrganizations = response.data;
      if (
        existingOrganizations.some((org) => org.name === organization_name)
      ) {
        setError(t("orgcreatenamefail"));
        handleSnackbar(t("orgcreatenamefail"), "error");
        setTimeout(() => setError(""), 5000);
      }
      if (
        existingOrganizations.some((org) => org.email === organization_email)
      ) {
        setError(t("emailinuse"));
        handleSnackbar(t("emailinuse"), "error");
        setTimeout(() => setError(""), 5000);
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
      await axiosClient
      .post("organizations/create", organizationObject);
      setSuccess(t("orgcreatesuccess"));
      handleSnackbar(t("orgcreatesuccess"), "success");
      setTimeout(() => setSuccess(""), 5000);
      await getOrganisations();
    } catch(error) {
      console.error("Error creating organization:", error);
    }
  };
    
  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION FOR ALL USERS (ONLY VISIBLE FOR LEPPIS PJ)

  // Gets every users data from backend
  const getAllUsers = async () => {
    try {
      const response = await axiosClient.get("listobjects/users/");
      const userData = response.data.map((u) => ({
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
        axiosClient
          .put(`/users/update/${selectedUserId}/`, { role: 1 })
          .then((response) => {
            console.log("Role updated successfully:", response.data);
          });
        axiosClient
          .put(`/users/update/${loggedUserId}/`, { role: 5 })
          .then((response) => {
            localStorage.setItem("loggedUser", JSON.stringify(response.data));
            setUser(response.data);
            setSuccess(t("usereditsuccess"));
            setTimeout(() => setSuccess(""), 5000);
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
        axiosClient
          .put(`/users/change_rights_reservation/${selectedUserId}/`)
          .then((response) => {
            setSuccess(t("usereditsuccess"));
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
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      const response = await axios.put(
        `${API_URL}/api/keys/hand_over_key/${UserId}/`,
        {
          organization_name: Organization,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Check the response and update the UI accordingly
      if (response.status === 200) {
        // Successful key handover
        setSuccess(t("handoverkeysuccess"));
        setTimeout(() => {
          setSuccess("");
        }, 5000);
        await getAllUsers();
      } else {
        // Error in key handover
        setError("ERROR");
      }
    } catch (error) {
      console.error("Error in key handover:", error);
      setError(t("handoverkeyfail"));
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

    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    await axios
      .get(`${API_URL}/api/users/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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
