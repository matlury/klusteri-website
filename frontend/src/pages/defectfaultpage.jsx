import React, { useState } from "react";
import axiosClient from "../axios.js";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";

const DefectFault = () => {
    const getJSON = async (event) => {
        const userdata = await axiosClient.get("/listobjects/defects/");
    };
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleDefectFault();
        handleClose(); 
      };
    
      const handleDefectFault = async (event) => {
    
        const defectFaultObject = {
            description: description,
          };
    
        confirmDefectFault(defectFaultObject)
    
        function confirmDefectFault(defectFaultObject) {
            if (confirm) {
                axiosClient
                  .post(`/defects/create_defect`, defectFaultObject)
                  .then((response) => {
                    setSuccess("Vian kirjaus onnistui");
                    setTimeout(() => setSuccess(""), 5000);
                  })
                  .catch((error) => {
                    setError("Vian kirjaus epäonnistui");
                    setTimeout(() => setError(""), 5000);
                    console.error("Pyyntö ei menny läpi", error);
                  });
              }
            }
      };
    
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");

  return (
    <div className="textbox">
      <h1>Viat</h1>
      <div>
        <h2>Napit</h2>
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            Lisää
          </Button>
          <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleFormSubmit,
          }}
        >
          <DialogTitle>Kirjaa vika</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Kirjaa Klusteriin liittyviä vikoja.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              type="text"
              label="Kuvaile vika"
              fullWidth
              variant="standard"
              onChange={(e) => setDescription(e.target.value)}
              data-testid="responsibilityfield"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Peruuta</Button>
            <Button
              type="submit"
              id="takeresp"
            >
              Kirjaa vika
            </Button>
          </DialogActions>
        </Dialog>
        </React.Fragment>
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            onClick={getJSON}
          >
            JSON
          </Button>
        </React.Fragment>
      </div>
    </div>
  );
};

export default DefectFault;
