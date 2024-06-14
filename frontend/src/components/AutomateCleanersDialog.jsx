/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AutomateCleanersDialog = ({ open, handleClose, handleAutomate }) => {
  const [threshold, setThreshold] = useState('');

  const { t } = useTranslation();

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const handleSubmit = () => {
    handleAutomate(Number(threshold));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("cleanigcreatelistauto")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("cleaningcreatedesc")}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="threshold_value"
          label={t("threshold")}
          type="number"
          fullWidth
          variant="standard"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button className="create-cleaning-button"
        onClick={handleSubmit}>{t("cleaningcreatelist")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutomateCleanersDialog;
