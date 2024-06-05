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

const RepairConfirmDialog = ({ open, handleConfirmClose, handleRemove, selectedDefectId }) => {
  return (
    <Dialog open={open} onClose={handleConfirmClose}>
      <DialogTitle>Merkitse vika korjatuksi</DialogTitle>
      <DialogContent>
        <DialogContentText>Oletko varma, että haluat merkitä vian korjatuksi?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmClose}>Peruuta</Button>
        <Button
          onClick={() => handleRemove(selectedDefectId)}
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

export default RepairConfirmDialog;
