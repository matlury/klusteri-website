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
import { useTranslation } from "react-i18next";

const DefectForm = ({ open, handleClose, handleFormSubmit }) => {
  const [description, setDescription] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(description);
    setDescription("");
    handleClose();
  };

  const { t } = useTranslation();

  return (
  <Dialog
    open={open}
    onClose={handleClose}
    PaperProps={{
      component: "form",
      onSubmit: onSubmit,
    }}
>
      <DialogTitle>{t("writedefect")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("writedefect_desc")}</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          data-testid="description"
          id="description"
          value={description}
          type="text"
          label={t("defect_desc")}
          fullWidth
          variant="standard"
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button 
          variant="contained"
          type="submit" 
          data-testid="createdefect"
          id="addfault"
          >
          {t("save_defect")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefectForm;
