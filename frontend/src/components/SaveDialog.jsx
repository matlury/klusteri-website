import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const SaveDialog = ({ open, handleClose, handleSave, newData }) => {
  const [jsonData, setJsonData] = useState("");

  const handleChange = (event) => {
    setJsonData(event.target.value);
  };

  const handleSubmit = () => {
    handleSave(newData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tallennetaanko siivousvuorot?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Peruuta
        </Button>
        <Button 
          className="save-cleaninglist-button"
          data-testid="save-cleaninglist-button"
          onClick={handleSubmit} color="primary">
          Tallenna
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
