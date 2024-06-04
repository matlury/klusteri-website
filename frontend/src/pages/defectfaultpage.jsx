import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

const DefectFault = () => {
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

      const handleDefectFaultRepair = (id) => {
        setButtonPopup(true);
        axiosClient
          .put(`defects/repair_defect/${id}/`, {
          })
          .then((response) => {
            setSuccess("Vian korjaus onnistui");
            setTimeout(() => setSuccess(""), 5000);
          })
          .catch((error) => {
            setError("Vian korjaus epäonnistui");
            setTimeout(() => setError(""), 5000);
          });
      };
    
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");
    const [allDefects, setAllDefects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDefectId, setSelectedDefectId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);


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
    const columns = [
      { field: "description", headerName: "Kuvaus", width: 400 },
      { field: "time", headerName: "Aika", width: 200}, 
      { field: "email", headerName: "Sähköposti lähetetty", width: 200}, 
      { field: "repaired", headerName: "Korjattu", width: 200},
      {
        field: "actions",
        headerName: "Korjaa",
        width: 90,
        renderCell: (params) => (
          <Button
            variant="outlined"
            onClick={() => handleLogoutClick(params.id)}
          >
            <CheckIcon />
          </Button>
        ),
      },
    ];

    useEffect(() => {
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
    }, []);

  return (
    <div className="textbox">
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <h2>Viat</h2>
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            + Lisää vika
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
          <DataGrid
            rows={allDefects}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
          <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Merkitse vika korjatuksi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Oletko varma, että haluat merkitä vian korjatuksi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Peruuta</Button>
          <Button
            onClick={() => handleRemove(selectedDefectId)}
            color="primary"
            variant="contained"
            id="confirmlogout"
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
        </React.Fragment>
      </div>
    </div>
  );
};

export default DefectFault;
