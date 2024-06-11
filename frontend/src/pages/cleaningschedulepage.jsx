import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import DefectForm from "../components/DefectForm";
import CleanersList from "../components/CleanersList.jsx";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from '@mui/icons-material/Upload';
import moment from "moment";
import CleanersListJSONButton from "../components/CleanersListJSONButton.jsx";
import { all } from "axios";

const CleaningSchedule = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [allCleaning, setAllCleaning] = useState([]);
  const [rawCleaningData, setRawCleaningData] = useState(null); // State for raw JSON data
  const [loading, setLoading] = useState(true);

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
    if (isLoggedIn && loggedUser) {
      fetchCleaning();
    }
  }, [isLoggedIn, loggedUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedUser) {
        await fetchCleaning();
      }
    };

    fetchData();
  }, [loggedUser]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async () => {
    const orgdata = await axiosClient.get("/listobjects/organizations/");
    console.log(getOrgId("Matrix"));

    confirmCleaning(cleaningObject);

    function getOrgId(orgName) {
      for (let i = 0; i < orgdata.data.length; i++) {
        if (orgdata.data[i].name === orgName) {
          return orgdata.data[i].id;
        }
      }
    };



    function confirmCleaning(cleaningObject) {
      if (confirm) {
        axiosClient
          .post(`/cleaning/create_cleaning`, cleaningObject)
          .then((response) => {
            setSuccess("Siivouksen kirjaus onnistui");
            setTimeout(() => setSuccess(""), 5000);
            fetchCleaning();
          })
          .catch((error) => {
            setError("Siivouksen kirjaus epäonnistui");
            setTimeout(() => setError(""), 5000);
            console.error("Pyyntö ei menny läpi", error);
          });
      }
    }
  };

  const fetchCleaning = () => {
    axiosClient
      .get("/listobjects/cleaning/")
      .then((res) => {
        setRawCleaningData(res.data); // Store the raw JSON data

        const cleaningData = res.data.map((u, index) => ({
          id: u.week, // DataGrid requires a unique 'id' for each row
          week: u.week,
          date: moment().day("Monday").week(u.week),
          big: u.big.name,
          small: u.small.name,
        }));
        setAllCleaning(cleaningData);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="textbox">
      {!isLoggedIn && <h3>Kirjaudu sisään</h3>}
      {isLoggedIn && (
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <h2>Siivousvuorot</h2>
          <React.Fragment>
            <CleanersListJSONButton cleaners={rawCleaningData} /> {/* Pass raw JSON data */}
            <Button
              startIcon={<UploadIcon />}
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Vie lista
            </Button>
          </React.Fragment>
          <React.Fragment>
            <CleanersList allCleaners={allCleaning} />
          </React.Fragment>
        </div>
      )}
    </div>
  );
};

export default CleaningSchedule;
