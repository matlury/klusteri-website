import "../index.css";
import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { getCurrentDateTime } from "../utils/timehelpers.js";
import {
  getPermission,
  fetchAllUsersWithKeys,
} from "../utils/keyuserhelpers.js";
import YkvLogoutFunction from "../components/YkvLogoutFunction.jsx";

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

  const API_URL = process.env.API_URL;

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

  // THE FOLLOWING FUNCTIONS HANDLES TAKING THE YKV-RESPONSIBILITIES

  // this function handles the event of taking responsibility (check above)
  const handleYkvLogin = async (event) => {
    // event.preventDefault();

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

    confirmYKV(responsibilityObject);

    selectedForYKV.map((user) => {
      const responsibilityObject = {
        user: user.id,
        email: user.email,
        responsible_for: responsibility,
        login_time: loginTime,
        created_by: loggedUser.username,
        organizations: user_orgs,
      };
      confirmYKV(responsibilityObject);
    });

    function confirmYKV(responsibilityObject) {
      if (confirm) {
        axiosClient
          .post(`/ykv/create_responsibility`, responsibilityObject)
          .then((response) => {
            setSuccess("YKV-sisäänkirjaus onnistui");
            setTimeout(() => setSuccess(""), 5000);
            getResponsibility();
            getActiveResponsibilities();
          })
          .catch((error) => {
            setError("YKV-sisäänkirjaus epäonnistui");
            setTimeout(() => setError(""), 5000);
            console.error("Pyyntö ei menny läpi", error);
          });
      } else {
        console.log("YKV peruttu");
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
  const getResponsibility = () => {
    axiosClient
      .get(`listobjects/nightresponsibilities/`)
      .then((response) => {
        setAllResponsibilities(response.data);
        const filteredResponsibilities = response.data.filter(
          (item) =>
            item.email === email ||
            (loggedUser && item.created_by === loggedUser.username),
        );
        setOwnResponsibilities(filteredResponsibilities);
      })
      .catch((error) => {
        console.error("Error fetching responsibilities", error);
      });
  };

  const getActiveResponsibilities = () =>
    axiosClient
      .get(`listobjects/nightresponsibilities/`)
      .then((response) => {
        setAllResponsibilities(response.data);
        const active = response.data.filter((item) => item.present === true);
        setActiveResponsibilities(active);
      })
      .catch((error) => {
        console.error("Error fetching responsibilities", error);
      });

  // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGOUT

  // handles the end of taking responsibility
  const handleYkvLogout = (id) => {
    setButtonPopup(true);
    axiosClient
      .put(`ykv/logout_responsibility/${id}/`, {
        logout_time: getCurrentDateTime(),
      })
      .then((response) => {
        setSuccess("YKV-uloskirjaus onnistui");
        setTimeout(() => setSuccess(""), 5000);
        getResponsibility();
        getActiveResponsibilities();
        fetchAllUsersWithKeys({
          API_URL,
          allUsersWithKeys,
          setAllUsersWithKeys,
          loggedUser,
          allResponsibilities,
        });
      })
      .catch((error) => {
        setError("YKV-uskirjaus epäonnistui");
        setTimeout(() => setError(""), 5000);
        console.error("Ykv-uloskirjaus epäonnistui", error);
      });
  };

  // THE FOLLOWING FUNCTIONS HANDLE THE YKV-LOGIN EDITS

  const handleYkvEdit = (respId, respToEdit) => {
    axiosClient
      .put(`ykv/update_responsibility/${respId}/`, respToEdit)
      .then((response) => {
        setSuccess("YKV-muokkaus onnistui");
        setTimeout(() => setSuccess(""), 5000);
        getResponsibility();
        getActiveResponsibilities();
      })
      .catch((error) => {
        setError("YKV-muokkaus epäonnistui");
        setTimeout(() => setError(""), 5000);
        console.error("Ykv-muokkaus epäonnistui", error);
      });
  };

  return (
    <div id="left_content">
      {!isLoggedIn && <h3>Kirjaudu sisään</h3>}
      {isLoggedIn && (
        <div id="leftleft_content">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
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
        </div>
      )}
    </div>
  );
};

export default OwnKeys;
