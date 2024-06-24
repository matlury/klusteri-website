import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import CleaningToolForm from "../components/CleaningToolForm.jsx";
import CleaningSuppliesList from "../components/CleaningSuppliesList.jsx";
import CleaningSuppliesConfirmDialog from "../components/CleaningSuppliesConfirm.jsx";
import { useTranslation } from "react-i18next";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CleaningSupplies = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [open, setOpen] = useState(false);
  const [allCleaningSupplies, setAllCleaningSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToolId, setSelectedToolId] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { t } = useTranslation();

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
      fetchSupplies();
    }
  }, [isLoggedIn, loggedUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedUser) {
        await fetchSupplies();
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

  const handleFormSubmit = async (tool) => {
    const cleaningSupplyObject = {
      tool: tool,
    };

    confirmCleaningSupplies(cleaningSupplyObject);

    function confirmCleaningSupplies(cleaningSupplyObject) {
      if (confirm) {
        axiosClient
          .post(`/cleaningsupplies/create_tool`, cleaningSupplyObject)
          .then((response) => {
            setSnackbarMessage(t("createtool"));
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            fetchSupplies();
          })
          .catch((error) => {
            setSnackbarMessage(t("createtoolfail"));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error(t("cleaningtoolfixfail"), error);
          });
      }
    }
  };


  const handleDeleteCleaningTool = (id) => {
    setButtonPopup(true);
    axiosClient
      .delete(`cleaningsupplies/delete_tool/${id}/`, {})
      .then((response) => {
        setSnackbarMessage(t("deletetoolsuccess"));
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchSupplies();
      })
      .catch((error) => {
        setSnackbarMessage(t("cleaningtoolfixfail"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };


  const handleDeleteClick = (id) => {
    setSelectedToolId(id);
    setConfirmDeleteOpen(true);
  };


  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };


  const handleDelete = (id) => {
    handleDeleteCleaningTool(id);
    setConfirmDeleteOpen(false);
  };

  const fetchSupplies = () => {
    axiosClient
      .get("/listobjects/cleaningsupplies/")
      .then((res) => {
        const suppliesData = res.data.map((u, index) => ({
          id: u.id, // DataGrid requires a unique 'id' for each row
          tool: u.tool,
        }));
        setAllCleaningSupplies(suppliesData);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="textbox">
      {!isLoggedIn && <h3>{t("loginsuggest")}</h3>}
      {isLoggedIn && (
        <div>
          <h2>{t("cleaningsupplies")}</h2>
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              data-testid="addcleaningsupplies"
            >
              + {t("add_cleaning_supplies")}
            </Button>
            <CleaningToolForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} />
          </React.Fragment>
          <React.Fragment>
            <CleaningSuppliesList 
              loggedUser={loggedUser} 
              allCleaningSupplies={allCleaningSupplies} 
              handleDeleteClick={handleDeleteClick}
            />
            <CleaningSuppliesConfirmDialog
              open={confirmDeleteOpen}
              handleConfirmClose={handleConfirmDeleteClose}
              handleDelete={handleDelete}
              selectedToolId={selectedToolId}
            />
          </React.Fragment>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CleaningSupplies;
