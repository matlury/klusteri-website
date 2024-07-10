import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { getCurrentDateTime } from "../utils/timehelpers.js";
import {
  getPermission,
  fetchAllUsersWithKeys,
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
  const [email, setEmail] = useState("");
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [allResponsibilities, setAllResponsibilities] = useState([]);
  const [ownResponsibilities, setOwnResponsibilities] = useState([]);
  const [activeResponsibilities, setActiveResponsibilities] = useState([]);
  const [allUsersWithKeys, setAllUsersWithKeys] = useState([]);

  const [nameFilter, setNameFilter] = useState("");
  const [ykvFilter, setYkvFilter] = useState("");
  var d = new Date();
  d.setDate(d.getDate() - 6);
  const [minFilter, setMinFilter] = useState(d.toISOString().slice(0, -8));
  d.setDate(d.getDate() + 7);
  const [maxFilter, setMaxFilter] = useState(d.toISOString().slice(0, -8));

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [buttonPopup, setButtonPopup] = useState(false);
  const [idToLogout, setIdToLogout] = useState([]);

  const [editButtonPopup, setEditButtonPopup] = useState(false);
  const [respToEdit, setRespToEdit] = useState("");

  const [selectedForYKV, setSelectedForYKV] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const API_URL = process.env.API_URL;

  const { t } = useTranslation();

  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
    if (propIsLoggedIn) {
      const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (storedUser) {
        setEmail(storedUser.email);
        setLoggedUser(storedUser);
        getPermission({ API_URL, setHasPermission });
      }
    }
  }, [propIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && loggedUser) {
      getResponsibility();
      getActiveResponsibilities();
      getPermission({ API_URL, setHasPermission });
    }
  }, [isLoggedIn, loggedUser, selectedForYKV]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedUser) {
        await getActiveResponsibilities();
        await fetchAllUsersWithKeys({
          API_URL,
          allUsersWithKeys,
          setAllUsersWithKeys,
          loggedUser,
          allResponsibilities,
        });
      }
    };

    fetchData();
  }, [loggedUser]);

  const handleYkvLogin = async (event) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) return;

    const user_id = loggedUser.id;
    const email = loggedUser.email;
    const loginTime = getCurrentDateTime();

    const userdata = await axiosClient.get("/listobjects/users/");
    const user = userdata.data.find((user) => user.id === user_id);
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
        setSuccess(t("ykvsuccess"));
        handleSnackbar(t("ykvsuccess"), "success");
        setTimeout(() => setSuccess(""), 5000);
        await getResponsibility();
        await getActiveResponsibilities();
      } catch (error) {
        setError(t("ykvfail"));
        handleSnackbar(t("ykvfail"), "error");
        setTimeout(() => setError(""), 5000);
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

  // fetches all of the responsibilities and the ones that the logged user has done
  const getResponsibility = async () => {
    try {
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`);
      setAllResponsibilities(response.data);
      const filteredResponsibilities = response.data.filter(
        (item) =>
          item.email === email ||
          (loggedUser && item.created_by === loggedUser.username),
      );
      setOwnResponsibilities(filteredResponsibilities);
    } catch (error) {
      console.error("Error fetching responsibilities", error);
    }
  };

  const getActiveResponsibilities = async () => {
    try {
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`);
      setAllResponsibilities(response.data);
      const active = response.data.filter((item) => item.present === true);
      setActiveResponsibilities(active);
    } catch (error) {
      console.error("Error fetching responsibilities", error);
    }
  };

  // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGOUT

  // handles the end of taking responsibility
  const handleYkvLogout = async (id) => {
    setButtonPopup(true);
    try {
      await axiosClient.put(`ykv/logout_responsibility/${id}/`, {
        logout_time: getCurrentDateTime(),
      });
      setSuccess(t("ykvlogoutsuccess"));
      handleSnackbar(t("ykvlogoutsuccess"), "success");
      setTimeout(() => setSuccess(""), 5000);
      await getResponsibility();
      await getActiveResponsibilities();
      await fetchAllUsersWithKeys({
        API_URL,
        allUsersWithKeys,
        setAllUsersWithKeys,
        loggedUser,
        allResponsibilities,
      });
    } catch (error) {
      setError(t("ykvlogoutfail"));
      handleSnackbar(t("ykvlogoutfail"), "error");
      setTimeout(() => setError(""), 5000);
      console.error(t("ykvlogoutfail"), error);
    }
  };

  // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGIN EDITS
  const handleYkvEdit = async (respId, respToEdit) => {
    try {
      await axiosClient.put(`ykv/update_responsibility/${respId}/`, respToEdit);
      setSuccess(t("ykveditsuccess"));
      handleSnackbar(t("ykveditsuccess"), "success");
      setTimeout(() => setSuccess(""), 5000);
      await getResponsibility();
      await getActiveResponsibilities();
    } catch (error) {
      setError(t("ykveditfail"));
        handleSnackbar(t("ykveditfail"), "error");
      setTimeout(() => setError(""), 5000);
      console.error("Ykv-muokkaus epäonnistui", error);
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
              idToLogout={idToLogout}
              buttonPopup={buttonPopup}
              setButtonPopup={setButtonPopup}
              activeResponsibilities={activeResponsibilities}
              setIdToLogout={setIdToLogout}
              loggedUser={loggedUser}
              setEditButtonPopup={setEditButtonPopup}
              editButtonPopup={editButtonPopup}
              setRespToEdit={setRespToEdit}
              handleYkvEdit={handleYkvEdit}
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