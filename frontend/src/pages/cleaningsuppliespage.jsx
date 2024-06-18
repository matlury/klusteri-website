import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import CleaningToolForm from "../components/CleaningToolForm.jsx";
import CleaningSuppliesList from "../components/CleaningSuppliesList.jsx";
import CleaningSuppliesConfirmDialog from "../components/CleaningSuppliesConfirm.jsx";
import { useTranslation } from "react-i18next";


const CleaningSupplies = ({
  isLoggedIn: propIsLoggedIn,
  loggedUser: propLoggedUser,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [loggedUser, setLoggedUser] = useState(propLoggedUser);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeSupplies, setActiveSupplies] = useState([]);
  const [allCleaningSupplies, setAllCleanignSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToolId, setSelectedToolId] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
    //console.log("cleaningtoolobject", cleaningSupplyObject )

    function confirmCleaningSupplies(cleaningSupplyObject) {
      if (confirm) {
        axiosClient
          .post(`/cleaningsupplies/create_tool`, cleaningSupplyObject)
          .then((response) => {
            //console.log("siivousväline on lisätty")
            setSuccess(t("defectcreatesuccess"));   // luo oma tool success?
            setTimeout(() => setSuccess(""), 5000);
            fetchSupplies();
          })
          .catch((error) => {
            setError(t("defectcreatefail"));    //luo oma tool success?
            setTimeout(() => setError(""), 5000);
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
        setSuccess(t("defectfixsuccess"));
        setTimeout(() => setSuccess(""), 5000);
        fetchDefects();
      })
      .catch((error) => {
        setError(t("defectfixfail"));
        setTimeout(() => setError(""), 5000);
      });
  };


  const handleDeleteClick = (id) => {
    setSelectedToolId(id);
    setConfirmDeleteOpen(true);
  };


  const handleConfirmDeleteClose = () => {    //to do: deletelle oma confirm ikkuna
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
        console.log("supplies data", suppliesData)
        setAllCleanignSupplies(suppliesData);
        setActiveSupplies(suppliesData);    // tänne voi laitta deletointi filterin tms. (ks.muista)....
        
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="textbox">
      {!isLoggedIn && <h3>{t("loginsuggest")}</h3>}
      {isLoggedIn && (
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <h2>{t("defectfaults")}</h2>                  {/*Tänne siivousvälineet tms. otsikko/käännös */}
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
            activeSupplies={activeSupplies} 
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
    </div>
  );
};

export default CleaningSupplies;