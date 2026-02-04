import { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { getCurrentDateTime } from "../utils/timehelpers.js";
import {
  getPermission,
} from "../utils/keyuserhelpers.js";
import YkvLogoutFunction from "../components/YkvLogoutFunction.jsx";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from '@mui/material';

const OwnKeys = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [responsibility, setResponsibility] = useState("");
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [allResponsibilities, setAllResponsibilities] = useState([]);
  const [allUsersWithKeys, setAllUsersWithKeys] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [selectedForYKV, setSelectedForYKV] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const API_URL = process.env.VITE_API_URL;

  const { t } = useTranslation();

  // fetches all users
  const fetchAllUsers = async () => {
    try {
      const response = await axiosClient.get(`listobjects/users/`);
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  // check if a user is valid for making an YKV-login
  const checkUser = (user, loggedUser) => {
    if (user.role === 5) {
      return false;
    }
    if (user.id === loggedUser.id) {
      return false;
    }
    return true;
  };

  // sets filtered users for YKV selection
  const setFilteredUsersForYKV = () => {
    const filteredUsers = allUsers.filter((user) =>
      checkUser(user, loggedUser),
    );
    setAllUsersWithKeys(filteredUsers);
  };

  // fetches all of the responsibilities and the ones that the logged user has done
  const fetchResponsibilitiesData = async () => {
    try {
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`);
      const rawData = response.data;
      setAllResponsibilities(rawData);

      // Update filtered users after responsibilities are fetched
      setFilteredUsersForYKV();
    } catch (error) {
      console.error("Error fetching responsibilities", error);
    }
  };

  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
    if (propIsLoggedIn) {
      const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (storedUser) {
        setLoggedUser(storedUser);
      }
    }
  }, [propIsLoggedIn]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (isLoggedIn && loggedUser) {
        // Fetch permission only once if not already set
        if (!hasPermission) {
          await getPermission({ API_URL, setHasPermission });
          return false
        }
        // Fetch all users once
        await fetchAllUsers();
        // Fetch responsibilities (consolidated)
        await fetchResponsibilitiesData();
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, loggedUser?.id, API_URL, hasPermission]); // Only refetch if login status or user ID changes

  const handleYkvLogin = async () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
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
        await axiosClient.post(`/ykv/create_responsibility`, responsibilityObject);
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
      await axiosClient.put(`ykv/logout_responsibility/${id}/`, {
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
              loggedUser={loggedUser}
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