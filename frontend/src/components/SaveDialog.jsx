/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const SaveDialog = ({ open, handleClose, handleSave, newData }) => {
  const [jsonData, setJsonData] = useState("");

  const { t } = useTranslation();

  const handleChange = (event) => {
    setJsonData(event.target.value);
  };

  const handleSubmit = () => {
    handleSave(newData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("cleaningsaveconfirm")}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("cancel")}
        </Button>
        <Button 
          className="save-cleaninglist-button"
          data-testid="save-cleaninglist-button"
          onClick={handleSubmit} color="primary">
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
