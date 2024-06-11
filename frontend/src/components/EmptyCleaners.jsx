import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";

const EmptyCleaners = ({ confirm, handleCloseConfirm, handleRemoveFormSubmit }) => {

  const onSubmit = (event) => {
    event.preventDefault();
    handleRemoveFormSubmit();
    handleCloseConfirm();
  };

  return (
  <Dialog
    open={confirm}
    onClose={handleCloseConfirm}
    PaperProps={{
      component: "form",
      onSubmit: onSubmit,
    }}
>
      <DialogTitle>Haluatko varmasti tyhjentää siivousvuorot? </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseConfirm}>Peruuta</Button>
        <Button 
          type="submit" 
          data-testid="createdefect"
          id="addfault"
          >
          Tyhjennä
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmptyCleaners;