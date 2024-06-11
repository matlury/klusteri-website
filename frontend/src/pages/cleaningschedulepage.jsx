import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import DefectForm from "../components/DefectForm";
import CleanersList from "../components/CleanersList.jsx";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from '@mui/icons-material/Upload';
import moment from "moment";

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


  const handleFormSubmit = async (description) => {
    const defectFaultObject = {
      description: description,
    };
    const cleaningdata = await axiosClient.get("/listobjects/cleaning/")

    confirmDefectFault(defectFaultObject);

    function confirmDefectFault(defectFaultObject) {
      if (confirm) {
        axiosClient
          .post(`/defects/create_defect`, defectFaultObject)
          .then((response) => {
            setSuccess("Vian kirjaus onnistui");
            setTimeout(() => setSuccess(""), 5000);
            fetchCleaning();
          })
          .catch((error) => {
            setError("Vian kirjaus epäonnistui");
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
        const cleaningData = res.data.map((u, index) => ({
          id: u.id, // DataGrid requires a unique 'id' for each row
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
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Tuo lista
            </Button>

            <Button
              startIcon={<UploadIcon />}
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Vie lista
            </Button>
           
            <DefectForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} />
          </React.Fragment>
        <React.Fragment>
          <CleanersList allCleaners={allCleaning}/>
        </React.Fragment>
      </div>
       )}
    </div>
  );
};

export default CleaningSchedule;
