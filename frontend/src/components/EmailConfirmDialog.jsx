// RepairConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const EmailConfirmDialog = ({ open, handleConfirmClose, handleMarkEmailSent, selectedDefectId }) => {
  return (
    <Dialog open={open} onClose={handleConfirmClose}>
      <DialogTitle>Merkitse sähöposti lähetetyksi</DialogTitle>
      <DialogContent>
        <DialogContentText>Oletko varma, että haluat merkitä sähköpostin lähetetyksi?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmClose}>Peruuta</Button>
        <Button
          onClick={() => handleMarkEmailSent(selectedDefectId)}
          color="primary"
          variant="contained"
          data-testid="confirmlogout"
        >
          Vahvista
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailConfirmDialog;
