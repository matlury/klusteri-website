import React, { useState, useEffect } from "react";
import { defectsAPI } from "../api/api.ts";
import { Button, Snackbar, Alert } from "@mui/material";
import DefectForm from "../components/DefectForm";
import DefectList from "../components/DefectList";
import RepairConfirmDialog from "../components/RepairConfirmDialog.jsx";
import EmailConfirmDialog from "../components/EmailConfirmDialog.jsx";
import { useTranslation } from "react-i18next";
import { useStateContext } from "@context/ContextProvider";

const DefectFault = () => {
  const { user } = useStateContext();
  const isLoggedIn = !!user;
  const loggedUser = user;
  const [open, setOpen] = useState(false);
  const [activeDefects, setActiveDefects] = useState([]);
  const [allDefects, setAllDefects] = useState([]);
  const [selectedDefectId, setSelectedDefectId] = useState(null);
  const [confirmRepairOpen, setConfirmRepairOpen] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn && loggedUser) {
      fetchDefects();
    }
  }, [isLoggedIn, loggedUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (loggedUser) {
        await fetchDefects();
      }
    };

    fetchData();
  }, [loggedUser]);

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

  const handleFormSubmit = async (description) => {
    const defectFaultObject = {
      description: description,
    };

    confirmDefectFault(defectFaultObject);

    function confirmDefectFault(defectFaultObject) {
      if (confirm) {
        defectsAPI
          .createDefect(defectFaultObject)
          .then(() => {
            handleSnackbar(t("defectcreatesuccess"), "success");
            fetchDefects();
          })
          .catch((error) => {
            handleSnackbar(t("defectcreatefail"), "error");
            console.error(t("defectfixfail"), error);
          });
      }
    }
  };

  const handleDefectFaultRepair = (id) => {
    defectsAPI
      .repairDefect(id)
      .then(() => {
        handleSnackbar(t("defectfixsuccess"), "success");
        fetchDefects();
      })
      .catch((error) => {
        handleSnackbar(t("defectfixfail"), "error");
      });
  };

  const handleSendEmail = (id) => {
    defectsAPI
      .emailDefect(id)
      .then(() => {
        handleSnackbar(t("defectmailsuccess"), "success");
        fetchDefects();
      })
      .catch((error) => {
        handleSnackbar(t("defectmailfail"), "error");
      });
  };

  const handleRepairClick = (id) => {
    setSelectedDefectId(id);
    setConfirmRepairOpen(true);
  };

  const handleEmailClick = (id) => {
    setSelectedDefectId(id);
    setConfirmEmailOpen(true);
  };

  const handleConfirmRepairClose = () => {
    setConfirmRepairOpen(false);
  };

  const handleConfirmEmailClose = () => {
    setConfirmEmailOpen(false);
  };

  const handleRepairFault = (id) => {
    handleDefectFaultRepair(id);
    setConfirmRepairOpen(false);
  };

  const handleMarkEmailSent = (id) => {
    handleSendEmail(id);
    setConfirmEmailOpen(false);
  };

  const fetchDefects = () => {
    defectsAPI
      .getDefects()
      .then((res) => {
        const rawData = res.data;
        const defectData = rawData.map((u) => ({
          id: u.id, // DataGrid requires a unique 'id' for each row
          description: u.description,
          time: new Date(u.time),
          email: u.email_sent == null ? "Ei" : new Date(u.email_sent),
          repaired: u.repaired == null ? "Ei" : new Date(u.repaired),
        }));
        setAllDefects(defectData);
        setActiveDefects(
          defectData.filter(
            (resp) =>
              resp.repaired === "Ei"
          ),
        );
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
          <h2>{t("defectfaults")}</h2>
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              data-testid="defectfaultdialog"
            >
              + {t("add_defect")}
            </Button>
            <DefectForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} />
          </React.Fragment>
          <React.Fragment>
            <DefectList
              allDefects={allDefects}
              activeDefects={activeDefects}
              handleRepairClick={handleRepairClick}
              handleEmailClick={handleEmailClick} />
            <RepairConfirmDialog
              open={confirmRepairOpen}
              handleConfirmClose={handleConfirmRepairClose}
              handleRepairFault={handleRepairFault}
              selectedDefectId={selectedDefectId}
            />
            <EmailConfirmDialog
              open={confirmEmailOpen}
              handleConfirmClose={handleConfirmEmailClose}
              handleMarkEmailSent={handleMarkEmailSent}
              selectedDefectId={selectedDefectId}
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

export default DefectFault;
