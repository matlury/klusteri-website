import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import CleanersList from "../components/CleanersList.jsx";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import moment from "moment";
import CleanersListJSONButton from "../components/CleanersListJSONButton.jsx";
import EmptyCleanersDialog from "../components/EmptyCleanersDialog.jsx";
import CleanersListUploadButton from "../components/CleanersListUploadButton.jsx";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleanersListAutomateButton from "../components/CleanersListAutomateButton.jsx";
import SaveDialog from "../components/SaveDialog";
import Stack from '@mui/material/Stack';

const CleaningSchedule = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirmOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const [allCleaning, setAllCleaning] = useState([]);
  const [rawCleaningData, setRawCleaningData] = useState(null);
  const [newData, setNewData] = useState(null);
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

  const handleClickRemove = () => {
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handleSaveClick = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveClose = () => {
    setSaveDialogOpen(false);
  };
  
  const handleFormSubmit = async (json) => {
    const orgdata = await axiosClient.get("/listobjects/organizations/");

    iterateThroughJSON(json);

    async function iterateThroughJSON(json) {
      for (let i = 0; i < json.length; i++) {
        const cleaningObject = {
          week: json[i].week,
          big: getOrgId(json[i].big.name),
          small: getOrgId(json[i].small.name),
        };
        confirmCleaning(cleaningObject);
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(10);
      }
    }

    function getOrgId(orgName) {
      for (let i = 0; i < orgdata.data.length; i++) {
        if (orgdata.data[i].name === orgName) {
          return orgdata.data[i].id;
        }
      }
    };

    function confirmCleaning(cleaningObject) {
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
  };

  const handleRemoveFormSubmit = async () => {
    axiosClient
      .delete(`/cleaning/remove/all`)
      .then((response) => {
        console.log("Cleaners deleted successfully");
        fetchCleaning();
        setSuccess("Siivousvuorot poistettu onnistuneesti.");
        setTimeout(() => setSuccess(""), 5000);
      })
      .catch((error) => {
        console.error("Error deleting cleaners:", error + " " + error.response.data);
      });
    setConfirmOpen(false);
  };

  const fetchCleaning = () => {
    axiosClient
      .get("/listobjects/cleaning/")
      .then((res) => {
        setRawCleaningData(res.data);

        const cleaningData = res.data.map((u, index) => ({
          id: u.week,
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
          <Stack direction="row" spacing={2}>
            <CleanersListJSONButton cleaners={rawCleaningData} />
            {loggedUser && loggedUser.role === 1 && (
              <React.Fragment>
                <CleanersListUploadButton setNewData={setNewData} onClick={() => handleFormSubmit(newData)} />
                <CleanersListAutomateButton updateNewData={setNewData} />
                <Button
                  startIcon={<SaveOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleSaveClick}
                >
                  Tallenna
                </Button>
                <Button
                  startIcon={<DeleteOutlineIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleClickRemove}
                >
                  Tyhjennä
                </Button>
              </React.Fragment>
            )}
          </Stack>
          <React.Fragment>
            <EmptyCleanersDialog confirm={confirm} handleCloseConfirm={handleCloseConfirm} handleRemoveFormSubmit={handleRemoveFormSubmit} />
            <SaveDialog open={saveDialogOpen} handleClose={handleSaveClose} handleSave={handleFormSubmit} newData={newData} />
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
