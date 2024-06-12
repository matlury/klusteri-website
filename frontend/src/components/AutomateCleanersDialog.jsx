import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const AutomateCleanersDialog = ({ open, handleClose, handleAutomate }) => {
  const [threshold, setThreshold] = useState('');

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const handleSubmit = () => {
    handleAutomate(Number(threshold));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Luo siivouslista automaattisesti</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Luo siivouslista automaattisesti algoritmin avulla. Anna raja-arvo, jonka mukaan järjestöt jaetaan suuriin ja pieniin järjestöihin.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Raja-arvo"
          type="number"
          fullWidth
          variant="standard"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Peruuta</Button>
        <Button onClick={handleSubmit}>Luo lista</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutomateCleanersDialog;
