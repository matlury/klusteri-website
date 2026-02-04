import { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { usersAPI, nightResponsibilitiesAPI, ykvAPI } from "../api/api.ts";
import { getCurrentDateTime } from "../utils/timehelpers.js";
import {
  getPermission,
} from "../utils/keyuserhelpers.js";
import YkvLogoutFunction from "../components/YkvLogoutFunction.jsx";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from '@mui/material';

const OwnKeys = () => {
  const { user: loggedUser } = useStateContext();
  const isLoggedIn = !!loggedUser;
  const [responsibility, setResponsibility] = useState("");
  const [allResponsibilities, setAllResponsibilities] = useState([]);
  const [allUsersWithKeys, setAllUsersWithKeys] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedForYKV, setSelectedForYKV] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { t } = useTranslation();

  // fetches all users
  const fetchAllUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  // check if a user is valid for making an YKV-login
  const checkUser = (user) => {
    if (user.role === 5) {
      return false;
    }
    if (loggedUser && user.id === loggedUser.id) {
      return false;
    }
    return true;
  };

  // sets filtered users for YKV selection
  const setFilteredUsersForYKV = () => {
    const filteredUsers = allUsers.filter((user) =>
      checkUser(user),
    );
    setAllUsersWithKeys(filteredUsers);
  };

  // fetches all of the responsibilities and the ones that the logged user has done
  const fetchResponsibilitiesData = async () => {
    try {
      const response = await nightResponsibilitiesAPI.getNightResponsibilities();
      const rawData = response.data;
      setAllResponsibilities(rawData);

      // Update filtered users after responsibilities are fetched
      setFilteredUsersForYKV();
    } catch (error) {
      console.error("Error fetching responsibilities", error);
    }
  };


  useEffect(() => {
    const fetchAllData = async () => {
      if (isLoggedIn && loggedUser) {
        if (!hasPermission) {
          await getPermission({ setHasPermission });
          return false;
        }
        await fetchAllUsers();
        await fetchResponsibilitiesData();
      }
    };
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, loggedUser?.id, hasPermission]);

  const handleYkvLogin = async () => {
    if (!loggedUser) return;
    const user_id = loggedUser.id;
    const email = loggedUser.email;
    const loginTime = getCurrentDateTime();
    const user = allUsers.find((user) => user.id === user_id);
    const user_orgs = user.keys.map((key) => key.id);
    const responsibilityObject = {
      user: user_id,
      email: email,
      responsible_for: responsibility,
      login_time: loginTime,
      created_by: loggedUser.username,
      organizations: user_orgs,
    };
    await confirmYKV(responsibilityObject);
    for (const user of selectedForYKV) {
      const responsibilityObject = {
        user: user.id,
        email: user.email,
        responsible_for: responsibility,
        login_time: loginTime,
        created_by: loggedUser.username,
        organizations: user_orgs,
      };
      await confirmYKV(responsibilityObject);
    }
    async function confirmYKV(responsibilityObject) {
      try {
        await ykvAPI.createResponsibility(responsibilityObject);
        handleSnackbar(t("ykvsuccess"), "success");
        await fetchResponsibilitiesData();
      } catch (error) {
        handleSnackbar(t("ykvfail"), "error");
        console.error(t("ykvfail"), error);
      }
    }
    setSelectedForYKV([]);
  };

  // function that checks if the user logged in (if there are no responsibilities, the user cant be logged in either)
  function checkIfLoggedIn() {
    if (loggedUser) {
      if (loggedUser.role !== 5) {
        return true;
      }
      return false;
    }
    return false;
  }

  // THE FOLLOWING FUNCTIONS RENDER SPECIFIC YKV-RESPONSIBILITIES

  // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGOUT

  // handles the end of taking responsibility
  const handleYkvLogout = async (id) => {
    try {
      await ykvAPI.logoutResponsibility(id, {
        logout_time: getCurrentDateTime(),
      });
      handleSnackbar(t("ykvlogoutsuccess"), "success");
      await fetchResponsibilitiesData();
    } catch (error) {
      handleSnackbar(t("ykvlogoutfail"), "error");
      console.error(t("ykvlogoutfail"), error);
    }
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  return (
    <div id="left_content">
      {!isLoggedIn && <h3>{t("login")}</h3>}
      {isLoggedIn && (
        <div id="leftleft_content">
          {checkIfLoggedIn() && (
            <YkvLogoutFunction
              handleYkvLogin={handleYkvLogin}
              handleYkvLogout={handleYkvLogout}
              allResponsibilities={allResponsibilities}
              allUsersWithKeys={allUsersWithKeys}
              responsibility={responsibility}
              setResponsibility={setResponsibility}
            />
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            data-testid="snackbar"
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      )}
    </div>
  );
};

export default OwnKeys;