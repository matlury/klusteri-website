import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import DefectForm from "../components/DefectForm";
import DefectList from "../components/DefectList";
import RepairConfirmDialog from "../components/RepairConfirmDialog.jsx";

const DefectFault = ({
  isLoggedIn: propIsLoggedIn,
}) => {
  
  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
    if (propIsLoggedIn) {
      const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    }
  }, [propIsLoggedIn]);

  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [allDefects, setAllDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDefectId, setSelectedDefectId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);

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
        axiosClient
          .post(`/defects/create_defect`, defectFaultObject)
          .then((response) => {
            setSuccess("Vian kirjaus onnistui");
            setTimeout(() => setSuccess(""), 5000);
            fetchDefects();
          })
          .catch((error) => {
            setError("Vian kirjaus epäonnistui");
            setTimeout(() => setError(""), 5000);
            console.error("Pyyntö ei menny läpi", error);
          });
      }
    }
  };

  const handleDefectFaultRepair = (id) => {
    setButtonPopup(true);
    axiosClient
      .put(`defects/repair_defect/${id}/`, {})
      .then((response) => {
        setSuccess("Vian korjaus onnistui");
        setTimeout(() => setSuccess(""), 5000);
        fetchDefects();
      })
      .catch((error) => {
        setError("Vian korjaus epäonnistui");
        setTimeout(() => setError(""), 5000);
      });
  };

  const handleLogoutClick = (id) => {
    setSelectedDefectId(id);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleRemove = (id) => {
    handleDefectFaultRepair(id);
    setConfirmOpen(false);
  };

  const fetchDefects = () => {
    axiosClient
      .get("/listobjects/defects/")
      .then((res) => {
        const defectData = res.data.map((u, index) => ({
          id: u.id, // DataGrid requires a unique 'id' for each row
          description: u.description,
          time: new Date(u.time),
          email: u.email_sent == null ? "Ei" : new Date(u.email_sent),
          repaired: u.repaired == null ? "Ei" : new Date(u.repaired),
        }));
        setAllDefects(defectData);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  return (
    <div className="textbox">
      {!isLoggedIn && <h3>Kirjaudu sisään</h3>}
      {isLoggedIn && (
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <h2>Viat</h2>
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              data-testid="defectfaultdialog"
            >
              + Lisää vika
            </Button>
            <DefectForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} />
          </React.Fragment>

          <React.Fragment>
            <DefectList allDefects={allDefects} handleLogoutClick={handleLogoutClick} />
            <RepairConfirmDialog
              open={confirmOpen}
              handleConfirmClose={handleConfirmClose}
              handleRemove={handleRemove}
              selectedDefectId={selectedDefectId}
            />
          </React.Fragment>
        </div>
      )}
    </div>
  );
};

export default DefectFault;
