// DefectForm.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DefectForm = ({ open, handleClose, handleFormSubmit }) => {
  const [description, setDescription] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(description);
    setDescription("");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle>Kirjaa vika</DialogTitle>
      <DialogContent>
        <DialogContentText>Kirjaa Klusteriin liittyviä vikoja.</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          data-testid="description"
          value={description}
          type="text"
          label="Kuvaile vika"
          fullWidth
          variant="standard"
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Peruuta</Button>
        <Button type="submit" data-testid="createdefect">
          Kirjaa vika
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefectForm;
