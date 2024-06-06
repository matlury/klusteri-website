import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import DefectForm from "../components/DefectForm";
import DefectList from "../components/DefectList";
import RepairConfirmDialog from "../components/RepairConfirmDialog.jsx";
import EmailConfirmDialog from "../components/EmailConfirmDialog.jsx";
const DefectFault = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeDefects, setActiveDefects] = useState([]);
  const [allDefects, setAllDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDefectId, setSelectedDefectId] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [confirmRepairOpen, setConfirmRepairOpen] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);

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

  const handleSendEmail = (id) => {
    setButtonPopup(true);
    axiosClient
      .put(`defects/email_defect/${id}/`, {})
      .then((response) => {
        setSuccess("Merkitseminen lähetetyksi onnistui");
        setTimeout(() => setSuccess(""), 5000);
        fetchDefects();
      })
      .catch((error) => {
        setError("Merkitseminen lähetetyksi epäonnistui");
        setTimeout(() => setError(""), 5000);
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
        setActiveDefects(
          defectData.filter(
            (resp) =>
              resp.repaired === "Ei"
          ),
        );
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
          <DefectList 
            loggedUser={loggedUser} 
            allDefects={allDefects} 
            activeDefects={activeDefects} 
            handleRepairClick={handleRepairClick} 
            handleEmailClick={handleEmailClick}/>
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
    </div>
  );
};

export default DefectFault;
