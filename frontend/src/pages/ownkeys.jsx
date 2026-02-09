import { useState, useEffect } from "react";
import { useStateContext } from "@context/ContextProvider";
import { nightResponsibilitiesAPI, ykvAPI } from "../api/api.ts";
import { getCurrentDateTime } from "../utils/timehelpers.js";
import {
  getPermission,
} from "../utils/keyuserhelpers.js";
import YkvLogoutFunction from "../components/YkvLogoutFunction.jsx";
import { useTranslation } from "react-i18next";
import { Snackbar, Alert } from '@mui/material';
import { Role } from "../roles.js";

const OwnKeys = () => {
  const { user: loggedUser } = useStateContext();
  const isLoggedIn = !!loggedUser;
  const [responsibility, setResponsibility] = useState("");
  const [allResponsibilities, setAllResponsibilities] = useState([]);
  const [allUsersWithKeys, setAllUsersWithKeys] = useState([]);
  const [selectedForYKV, setSelectedForYKV] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { t } = useTranslation();

  // Set default organization when loggedUser is available
  useEffect(() => {
    if (loggedUser && loggedUser.keys && loggedUser.keys.length > 0 && !selectedOrg) {
      setSelectedOrg(loggedUser.keys[0]);
    }
  }, [loggedUser, selectedOrg]);

  // fetches eligible users for YKV
  const fetchEligibleUsers = async () => {
    try {
      const response = await ykvAPI.getEligibleUsers();
      // Filter out the logged-in user if present
      const filteredUsers = response.data.filter(user => user.id !== loggedUser.id);
      setAllUsersWithKeys(filteredUsers);
    } catch (error) {
      console.error("Error fetching eligible users", error);
    }
  };

  // fetches all of the responsibilities and the ones that the logged user has done
  const fetchResponsibilitiesData = async () => {
    try {
      const response = await nightResponsibilitiesAPI.getNightResponsibilities();
      const rawData = response.data;
      setAllResponsibilities(rawData);
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
        await fetchEligibleUsers();
        await fetchResponsibilitiesData();
      }
    };
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, loggedUser?.id, hasPermission]);

  const handleYkvLogin = async () => {
    if (!loggedUser) return;
    const user_id = loggedUser.id;
    const loginTime = getCurrentDateTime();
    const organizations = selectedOrg ? [selectedOrg.id] : [];
    
    const responsibilityObject = {
      user: user_id,
      responsible_for: responsibility,
      login_time: loginTime,
      created_by: loggedUser.id,
      organizations: organizations,
    };
    await confirmYKV(responsibilityObject);
    for (const user of selectedForYKV) {
      const responsibilityObject = {
        user: user.id,
        responsible_for: responsibility,
        login_time: loginTime,
        created_by: loggedUser.id,
        organizations: organizations,
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
      if (loggedUser.role !== Role.TAVALLINEN) {
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
              selectedForYKV={selectedForYKV}
              setSelectedForYKV={setSelectedForYKV}
              selectedOrg={selectedOrg}
              setSelectedOrg={setSelectedOrg}
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