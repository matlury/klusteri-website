import React, { useState, useEffect } from "react";
import { useStateContext } from "@context/ContextProvider";
import { organizationsAPI, cleaningAPI } from "../api/api.ts";
import { Button, Snackbar, Alert } from "@mui/material";
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
import { useTranslation } from "react-i18next";
import { Role } from "../roles";

const CleaningSchedule = () => {
  const { user: loggedUser } = useStateContext();
  const isLoggedIn = !!loggedUser;
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirmOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [allCleaning, setAllCleaning] = useState([]);
  const [rawCleaningData, setRawCleaningData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { t } = useTranslation();

  // No need to sync isLoggedIn or loggedUser from props/localStorage

  useEffect(() => {
    if (isLoggedIn && loggedUser) {
      fetchCleaning();
    }
  }, [isLoggedIn, loggedUser]);

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

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
    const orgdata = await organizationsAPI.getOrganizations();

    if (allCleaning.length > 0) {
      setError(t("cleaningerrorold"));
      handleSnackbar(t("cleaningerrorold"), "error");
      return;
    }

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
      const orgs = orgdata.data;
      for (let i = 0; i < orgs.length; i++) {
        if (orgs[i].name === orgName) {
          return orgs[i].id;
        }
      }
    }

    function confirmCleaning(cleaningObject) {
      cleaningAPI
        .createCleaning(cleaningObject)
        .then((response) => {
          setSuccess(t("cleaningsubmitsuccess"));
          handleSnackbar(t("cleaningsubmitsuccess"), "success");
          setTimeout(() => setSuccess(""), 5000);
          fetchCleaning();
        })
        .catch((error) => {
          setError(t("cleaningsubmitfail"));
          handleSnackbar(t("cleaningsubmitfail"), "error");
          setTimeout(() => setError(""), 5000);
          console.error("Error submitting cleaning", error);
        });
    }
  };

  const handleRemoveFormSubmit = async () => {
    cleaningAPI
      .deleteAllCleaning()
      .then((response) => {
        fetchCleaning();
        setSuccess(t("cleaningclearedsuccess"));
        handleSnackbar(t("cleaningclearedsuccess"), "success");
        setTimeout(() => setSuccess(""), 5000);
      })
      .catch((error) => {
        console.error("Error deleting cleaners:", error + " " + error.response.data);
        setError(t("cleaningclearfail"));
        handleSnackbar(t("cleaningclearfail"), "error");
        setTimeout(() => setError(""), 5000);
      });
    setConfirmOpen(false);
  };

  const fetchCleaning = () => {
    cleaningAPI
      .getCleaning()
      .then((res) => {
        const rawData = res.data;
        setRawCleaningData(rawData);

        const cleaningData = rawData.map((u, index) => ({
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
      {!isLoggedIn && <h3>{t("loginsuggest")}</h3>}
      {isLoggedIn && (
        <div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <h2>{t("cleaningschedule")}</h2>
          <Stack direction="row" spacing={2}>
            <CleanersListJSONButton cleaners={rawCleaningData} />
            {isLoggedIn && loggedUser.role === Role.LEPPISPJ && (
              <React.Fragment>
                <CleanersListUploadButton setNewData={setNewData} onClick={() => handleFormSubmit(newData)} />
                <CleanersListAutomateButton
                  updateNewData={setNewData}
                  setError={setError} />
                <Button
                  startIcon={<SaveOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  data-testid="save-cleaning-button"
                  onClick={handleSaveClick}
                >
                  {t("save")}
                </Button>
                <Button
                  startIcon={<DeleteOutlineIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleClickRemove}
                >
                  {t("clear")}
                </Button>
              </React.Fragment>
            )}
          </Stack>
          <React.Fragment>
            <EmptyCleanersDialog
              confirm={confirm}
              handleCloseConfirm={handleCloseConfirm}
              handleRemoveFormSubmit={handleRemoveFormSubmit} />
            <SaveDialog
              open={saveDialogOpen}
              handleClose={handleSaveClose}
              handleSave={handleFormSubmit}
              newData={newData} />
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
