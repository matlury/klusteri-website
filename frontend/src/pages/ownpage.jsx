import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import axios from "axios";
import axiosClient from "../axios.js";
import "../index.css";
import UserPage from "../components/UserPage.jsx";
import OrganisationPage from "../components/OrganisationPage.jsx";
import CreateOrganization from "../components/CreateOrganization.jsx";
import AllUsers from "../components/AllUsers.jsx";
import { useTranslation } from "react-i18next";

const OwnPage = ({ isLoggedIn: propIsLoggedIn }) => {
  const { user, setUser } = useStateContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [role, setRole] = useState("5");

  // user_details* variables for viewing and updating someone else's information
  const [userDetailsUsername, setUserDetailsUsername] = useState("");
  const [userDetailsPassword, setUserDetailsPassword] = useState("");
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

  const { t } = useTranslation();

  const API_URL = process.env.API_URL;
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
  const handleUserDetails = (event) => {
    event.preventDefault();

    const details = {
      username: username,
      email: email,
      telegram: telegram,
    };

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const user_id = loggedUser.id;

    if (!username || !email) {
      setError(t("usereditmandfields"));
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (telegram) {
      axios
        .get(`${API_URL}/api/listobjects/users/?telegram=${telegram}`)
        .then((response) => {
          const existingUsers = response.data;
          if (
            existingUsers.some(
              (user) => user.telegram === telegram && user.id !== loggedUser.id,
            )
          ) {
            setError(t("telegraminuse"));
            setTimeout(() => setError(""), 5000);
            return;
          }
        });
    }

    axios
      .get(`${API_URL}/api/listobjects/users/?email=${email}`)
      .then((response) => {
        const existingUsers = response.data;
        if (
          existingUsers.some(
            (user) => user.email === email && user.id !== loggedUser.id,
          )
        ) {
          setError(t("emailinuse"));
          setTimeout(() => setError(""), 5000);
          return;
        }
        confirmupdate();
      });

    function confirmupdate() {
      const confirmUpdate = window.confirm(
        t("usereditconfirm"),
      );

      if (confirmUpdate) {
        axiosClient
          .put(`/users/update/${user_id}/`, details)
          .then((response) => {
            localStorage.setItem("loggedUser", JSON.stringify(response.data));
            setUser(response.data);
            setSuccess(t("usereditsuccess"));
            setTimeout(() => setSuccess(""), 5000);
          })
          .catch((error) => {
            console.error(t("usereditfail"), error);
          });
      } else {
        console.log("User cancelled the update.");
      }
    }
  };

  const handleUpdateAnotherUser = (userDetailsId, userDetailsUsername, userDetailsPassword, userDetailsEmail, userDetailsTelegram, userDetailsRole,
    userDetailsOrganizations) => {  
  
    /*
    Event handler for updating someone else's information.
    No validation here because backend takes care of it.
    */
    //event.preventDefault();

    const confirmUpdate = window.confirm(
      t("usereditforother"),
    );

    const updatedValues = {
      username: userDetailsUsername,
      password: userDetailsPassword,
      email: userDetailsEmail,
      telegram: userDetailsTelegram,
      role: userDetailsRole,
      id: userDetailsId, 
    };

    if (confirmUpdate) {
      axiosClient
        .put(`/users/update/${userDetailsId}/`, updatedValues)
        .then((response) => {
          console.log(t("usereditsuccess"));

          setSuccess(t("usereditsuccess"));
          setTimeout(() => setSuccess(""), 5000);
          getAllUsers();

          if (userDetailsEmail === email) {
            localStorage.setItem("loggedUser", JSON.stringify(response.data));
            setUser(response.data);
          }
        })
        .catch((error) => {
          console.error(t("usereditfail"), error);
          setError(t("usereditfail"));
          setTimeout(() => setError(""), 5000);
        });
    } else {
      console.log("User cancelled the update.");
    }
  };

  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION OF THE ORGANIZATIONS

  // Keeps the organization information up-to-date
  const getOrganisations = () => {
    axios
      .get(`${API_URL}/api/listobjects/organizations/`)
      .then((response) => {
        const data = response.data;
        setOrganisations(data);
      })
      .catch((error) => {
        console.error("Error fetching organisations:", error);
      });
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
  const handleOrganizationDetails = (organization_new_name, organization_new_email, organization_new_homepage,  organization_new_color, orgId) => {
    const newOrganizationObject = {
      name: organization_new_name,
      email: organization_new_email,
      homepage: organization_new_homepage,
      color: organization_new_color,
    };
        axiosClient
          .put(
            `/organizations/update_organization/${orgId}/`,
            newOrganizationObject,
          )
          .then((response) => {
            console.log("Organization created successfully!", response.data);
            setSuccess("Järjestö muokattu onnistuneesti!");
            setTimeout(() => setSuccess(""), 5000);
            getOrganisations();
          })
          .catch((error) => {
            console.error("Error creating account:", error);
          });
  };

  // Handles deletion of organization
  const handleDeleteOrganization = (orgId) => {
    const confirmUpdate = window.confirm(
      t("orgdeleteconfirm"),
    );

    if (confirmUpdate) {
      axiosClient
        .delete(`/organizations/remove/${orgId}/`)
        .then((response) => {
          console.log(t("orgdeletesuccess"), response.data);
          getOrganisations();
          setSuccess(t("orgdeletesuccess"));
          setTimeout(() => setSuccess(""), 5000);
        })
        .catch((error) => {
          console.error(t("orgdelelefail"), error);
        });
    }
  };

  // Handles the creation of organizations
  const handleCreateOrganization = () => {
    axios
      .get(
        `${API_URL}/api/listobjects/organizations/?email=${organization_email}`,
      )
      .then((response) => {
        const existingOrganizations = response.data;
        if (
          existingOrganizations.some((org) => org.name === organization_name)
        ) {
          setError(t("orgcreatenamefail"));
          setTimeout(() => setError(""), 5000);
        }
        if (
          existingOrganizations.some((org) => org.email === organization_email)
        ) {
          setError(t("emailinuse"));
          setTimeout(() => setError(""), 5000);
        } else {
          const organizationObject = {
            name: organization_name,
            email: organization_email,
            homepage: organization_homepage,
            color: organization_color,
          };
          console.log(organizationObject);
          axiosClient
            .post("organizations/create", organizationObject)
            .then((response) => {
              console.log("Organization created successfully!");
              setSuccess(t("orgcreatesuccess"));
              setTimeout(() => setSuccess(""), 5000);
              getOrganisations();
            })
            .catch((error) => {
              console.error("Error creating account:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);
      });
  };

  // HERE BEGINS THE FUNCTIONS THAT HANDLES THE INFORMATION FOR ALL USERS (ONLY VISIBLE FOR LEPPIS PJ)

  // Gets every users data from backend
  const getAllUsers = () => {
    axios
      .get(`${API_URL}/api/listobjects/users/`)
      .then((response) => {
        const data = response.data;
        setAllUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching all users:", error);
      });
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
    setuserDetailsOrganizations(
      orgDict.map(org => org.name),
    );

    setSelectedUser((prevSelectedUser) => {
      if (prevSelectedUser === userId) {
        return null;
      }
      return userId;
    });
  };

  // Handles PJ change
  const handlePJChange = (userId) => {
    const selectedUserId = userId;
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const loggedUserId = loggedUser.id;

    confirmupdate();

    function confirmupdate() {
      const confirmUpdate = window.confirm(
        t("pjchange"),
      );

      if (confirmUpdate) {
        axiosClient
          .put(`/users/update/${selectedUserId}/`, { role: 1 })
          .then((response) => {
            console.log("Role updated successfully:", response.data);
          });
        axiosClient
          .put(`/users/update/${loggedUserId}/`, { role: 5 })
          .then((response) => {
            console.log("Role updated successfully", response.data);
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

  // Handles key submit
  //const handleKeySubmit = async (event) => {
  const handleKeySubmit = async (UserId, Organization) => {
   // event.preventDefault();

    // if (!selectedUserId || !selectedOrganization) {
    //   console.error("Please select a user and an organization");
    //   return;
    // }

    // Display a confirmation dialog before handing over the key
    const confirmKeyHandover = window.confirm(
      t("handoverkeyconfirm")
    );

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
        } else if (currentUser.role == 2 || currentUser.role == 3) {
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
          {error && <p style={{ color: "red" }}>{t("fail")}: {error}</p>}
          {success && <p style={{ color: "green" }}>{t("success")}: {success}</p>}
          <div style={{ display: "flex" }}>
            <div id="left_content">
              <div id="leftleft_content">
                {
                  <UserPage
                    username={username}
                    setUsername={setUsername}
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
                    organisations={organisations}
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
                  />
                )}
                {hasPermissionOrg === true && (
                  <AllUsers
                    allUsers={allUsers}
                    toggleUserDetails={toggleUserDetails}
                    userDetailsUsername={userDetailsUsername}
                    setUserDetailsUsername={setUserDetailsUsername}
                    userDetailsPassword={userDetailsPassword}
                    setUserDetailsPassword={setUserDetailsPassword}
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
              >
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnPage;
